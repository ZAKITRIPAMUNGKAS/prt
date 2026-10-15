import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { jobApplications } from "@/db/schema";
import { escapeLike } from "@/lib/escape-like";
import {
  applicationFormSchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
} from "../schemas";
import {
  APPLICATION_STATUSES,
  ApplicationStats,
  ApplicationStatus,
} from "../types";

const getApplicationsInputSchema = z.object({
  page: z.number().default(DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
  search: z.string().nullish(),
  status: z
    .union([z.array(z.string()), z.string()])
    .nullish(),
  platform: z.string().nullish(),
});

type GetApplicationsInput = z.infer<typeof getApplicationsInputSchema>;

async function fetchApplications(
  db: typeof import("@/db").db,
  input: GetApplicationsInput
) {
  const { page, pageSize, search, status, platform } = input;
  const conditions = [];

  if (search && search.trim().length > 0) {
    const escaped = escapeLike(search.trim());
    conditions.push(
      or(
        ilike(jobApplications.company, `%${escaped}%`),
        ilike(jobApplications.position, `%${escaped}%`)
      )
    );
  }

  if (status) {
    const rawStatuses = Array.isArray(status) ? status : [status];
    const validStatuses = rawStatuses.filter((s): s is ApplicationStatus =>
      APPLICATION_STATUSES.includes(s as ApplicationStatus)
    );
    if (validStatuses.length > 0) {
      conditions.push(inArray(jobApplications.status, validStatuses));
    }
  }

  if (platform && platform.trim().length > 0) {
    conditions.push(eq(jobApplications.platform, platform.trim()));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, [totalRecord]] = await Promise.all([
    db
      .select()
      .from(jobApplications)
      .where(whereClause)
      .orderBy(
        sql`${jobApplications.appliedAt} desc nulls last`,
        desc(jobApplications.createdAt)
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: count() })
      .from(jobApplications)
      .where(whereClause),
  ]);

  const total = totalRecord?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    items,
    total,
    totalPages,
  };
}

async function fetchApplicationStats(
  db: typeof import("@/db").db
): Promise<ApplicationStats> {
  const all = await db
    .select({
      id: jobApplications.id,
      status: jobApplications.status,
      appliedAt: jobApplications.appliedAt,
      createdAt: jobApplications.createdAt,
    })
    .from(jobApplications);

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(now.getDate() - 14);
  const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().slice(0, 10);

  let applied = 0;
  let inProgress = 0;
  let offer = 0;
  let rejected = 0;
  let followUpNeeded = 0;
  let last7Days = 0;

  const byStatus: Record<ApplicationStatus, number> = {
    draft: 0,
    applied: 0,
    screening: 0,
    test: 0,
    interview: 0,
    offer: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
    closed: 0,
  };

  for (const row of all) {
    const status = row.status as ApplicationStatus;
    if (byStatus[status] !== undefined) {
      byStatus[status] += 1;
    }

    if (status === "applied") {
      applied += 1;
      const dateToCompare =
        row.appliedAt ?? row.createdAt.toISOString().slice(0, 10);
      if (dateToCompare <= fourteenDaysAgoStr) {
        followUpNeeded += 1;
      }
    } else if (
      status === "screening" ||
      status === "test" ||
      status === "interview"
    ) {
      inProgress += 1;
    } else if (status === "offer") {
      offer += 1;
    } else if (status === "rejected") {
      rejected += 1;
    }

    const appliedDate =
      row.appliedAt ?? row.createdAt.toISOString().slice(0, 10);
    if (appliedDate >= sevenDaysAgoStr) {
      last7Days += 1;
    }
  }

  return {
    total: all.length,
    applied,
    inProgress,
    offer,
    rejected,
    followUpNeeded,
    last7Days,
    byStatus,
  };
}

export const applicationsRouter = createTRPCRouter({
  // Protected: List job applications with filters and pagination
  getMany: protectedProcedure
    .input(getApplicationsInputSchema)
    .query(async ({ ctx, input }) => {
      return fetchApplications(ctx.db, input);
    }),

  // Public: Read-only list for shared link view
  getManyPublic: baseProcedure
    .input(getApplicationsInputSchema)
    .query(async ({ ctx, input }) => {
      return fetchApplications(ctx.db, input);
    }),

  // Protected: Get stats for cards
  getStats: protectedProcedure.query(async ({ ctx }): Promise<ApplicationStats> => {
    return fetchApplicationStats(ctx.db);
  }),

  // Public: Read-only stats for shared link view
  getStatsPublic: baseProcedure.query(async ({ ctx }): Promise<ApplicationStats> => {
    return fetchApplicationStats(ctx.db);
  }),

  // Protected: Get single job application by ID
  getOne: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [application] = await ctx.db
        .select()
        .from(jobApplications)
        .where(eq(jobApplications.id, input.id));

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lamaran kerja tidak ditemukan",
        });
      }

      return application;
    }),

  // Protected: Create job application
  create: protectedProcedure
    .input(applicationFormSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(jobApplications)
        .values({
          ...input,
          company: input.company,
          platform: input.platform,
          status: input.status,
        })
        .returning();

      return created;
    }),

  // Protected: Update job application
  update: protectedProcedure
    .input(updateApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(jobApplications)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(jobApplications.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lamaran kerja tidak ditemukan",
        });
      }

      return updated;
    }),

  // Protected: Update application status inline
  updateStatus: protectedProcedure
    .input(updateApplicationStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(jobApplications)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(jobApplications.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lamaran kerja tidak ditemukan",
        });
      }

      return updated;
    }),

  // Protected: Remove job application
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(jobApplications)
        .where(eq(jobApplications.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lamaran kerja tidak ditemukan",
        });
      }

      return deleted;
    }),
});
