import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { asc, eq } from "drizzle-orm";
import { playlistTracks } from "@/db/schema";
import { defaultPlaylist } from "@/config/music";

export const playlistTrackFormSchema = z.object({
  title: z.string().min(1, "Judul lagu wajib diisi"),
  artist: z.string().default(""),
  src: z.string().min(1, "File / URL audio wajib diisi"),
  cover: z.string().nullable().optional(),
  lyrics: z.string().nullable().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const playlistRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    try {
      const tracks = await ctx.db
        .select()
        .from(playlistTracks)
        .where(eq(playlistTracks.isActive, true))
        .orderBy(asc(playlistTracks.order), asc(playlistTracks.createdAt));

      if (tracks.length === 0) {
        return defaultPlaylist;
      }

      return tracks.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist || "Tepe Radio",
        src: t.src,
        cover: t.cover || "/fotoku.png",
        lyrics: t.lyrics || null,
      }));
    } catch {
      return defaultPlaylist;
    }
  }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(playlistTracks)
      .orderBy(asc(playlistTracks.order), asc(playlistTracks.createdAt));
  }),

  create: protectedProcedure
    .input(playlistTrackFormSchema)
    .mutation(async ({ ctx, input }) => {
      const [inserted] = await ctx.db
        .insert(playlistTracks)
        .values({
          title: input.title,
          artist: input.artist || "",
          src: input.src,
          cover: input.cover || null,
          lyrics: input.lyrics || null,
          order: input.order,
          isActive: input.isActive,
        })
        .returning();
      return inserted;
    }),

  update: protectedProcedure
    .input(
      playlistTrackFormSchema.partial().extend({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(playlistTracks)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(playlistTracks.id, id))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(playlistTracks)
        .where(eq(playlistTracks.id, input.id));
      return { success: true };
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string().uuid(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.items.map((item) =>
          ctx.db
            .update(playlistTracks)
            .set({ order: item.order, updatedAt: new Date() })
            .where(eq(playlistTracks.id, item.id))
        )
      );
      return { success: true };
    }),

  syncDefault: protectedProcedure.mutation(async ({ ctx }) => {
    const existing = await ctx.db.select().from(playlistTracks);
    if (existing.length === 0) {
      await Promise.all(
        defaultPlaylist.map((track, idx) =>
          ctx.db.insert(playlistTracks).values({
            title: track.title,
            artist: track.artist,
            src: track.src,
            cover: track.cover,
            lyrics: track.lyrics || null,
            order: idx,
            isActive: true,
          })
        )
      );
    }
    return { success: true };
  }),
});
