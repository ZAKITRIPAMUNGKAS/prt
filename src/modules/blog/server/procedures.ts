import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { desc, eq, and, sql } from "drizzle-orm";
import { posts } from "@/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const blogRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select()
      .from(posts)
      .where(eq(posts.visibility, "public"))
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(20);

    return data;
  }),
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [data] = await ctx.db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, input.slug), eq(posts.visibility, "public")));

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return data;
    }),
  recordView: baseProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(posts)
        .set({
          views: sql`${posts.views} + 1`,
        })
        .where(and(eq(posts.slug, input.slug), eq(posts.visibility, "public")));

      return { success: true };
    }),
  recordReadingTime: baseProcedure
    .input(
      z.object({
        slug: z.string(),
        seconds: z.number().min(3).max(3600),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(posts)
        .set({
          totalReadingTimeSeconds: sql`${posts.totalReadingTimeSeconds} + ${Math.round(input.seconds)}`,
          readingCount: sql`${posts.readingCount} + 1`,
        })
        .where(and(eq(posts.slug, input.slug), eq(posts.visibility, "public")));

      return { success: true };
    }),
});
