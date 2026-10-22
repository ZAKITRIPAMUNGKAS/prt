import { z } from "zod";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import {
  projects,
  projectsInsertSchema,
  projectsUpdateSchema,
} from "@/db/schema";
import { escapeLike } from "@/lib/escape-like";

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  if ("code" in error && error.code === "23505") return true;
  return "cause" in error && isUniqueViolation(error.cause);
}

export const projectsRouter = createTRPCRouter({
  getHome: baseProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        slug: projects.slug,
        title: projects.title,
        coverKey: projects.coverKey,
        previewVideoKey: projects.previewVideoKey,
      })
      .from(projects)
      .orderBy(asc(projects.order), desc(projects.createdAt))
      .limit(3);
  }),

  // Public: List projects
  getMany: baseProcedure
    .input(
      z
        .object({
          featured: z.boolean().optional(),
          limit: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.featured !== undefined) {
        conditions.push(eq(projects.featured, input.featured));
      }

      const query = ctx.db
        .select()
        .from(projects)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(projects.order), desc(projects.createdAt));

      if (input?.limit) {
        return query.limit(input.limit);
      }

      return query;
    }),

  // Public: Get project by slug
  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.slug, input.slug));

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  // Protected: Get single project by ID for editing
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id));

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  // Protected: Admin list with pagination & search
  getManyAdmin: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const searchCondition = search
        ? ilike(projects.title, `%${escapeLike(search)}%`)
        : undefined;

      const [items, [total]] = await Promise.all([
        ctx.db
          .select()
          .from(projects)
          .where(searchCondition)
          .orderBy(asc(projects.order), desc(projects.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        ctx.db
          .select({ count: count() })
          .from(projects)
          .where(searchCondition),
      ]);

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items,
        total: total.count,
        totalPages,
      };
    }),

  // Protected: Create project
  create: protectedProcedure
    .input(projectsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [newProject] = await ctx.db
          .insert(projects)
          .values(input)
          .returning();

        return newProject;
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Project with this slug already exists",
          });
        }
        throw error;
      }
    }),

  // Protected: Update project
  update: protectedProcedure
    .input(projectsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      if (!id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "ID is required" });
      }

      try {
        const [updatedProject] = await ctx.db
          .update(projects)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(projects.id, id))
          .returning();

        if (!updatedProject) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        return updatedProject;
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Project with this slug already exists",
          });
        }
        throw error;
      }
    }),

  // Protected: Delete project
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(projects)
        .where(eq(projects.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return deleted;
    }),
});
