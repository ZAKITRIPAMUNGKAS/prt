import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { citySets, photos } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const cityRouter = createTRPCRouter({
  // Get all city sets
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select({
        id: citySets.id,
        country: citySets.country,
        countryCode: citySets.countryCode,
        city: citySets.city,
        description: citySets.description,
        photoCount: citySets.photoCount,
        coverPhotoId: citySets.coverPhotoId,
        createdAt: citySets.createdAt,
        updatedAt: citySets.updatedAt,
        // Join with cover photo
        coverPhotoUrl: photos.url,
        coverPhotoBlurData: photos.blurData,
        coverPhotoTitle: photos.title,
      })
      .from(citySets)
      .innerJoin(photos, eq(citySets.coverPhotoId, photos.id))
      .orderBy(desc(citySets.updatedAt), desc(citySets.createdAt));

    return data;
  }),

  // Get one city set with all photos
  getOne: protectedProcedure
    .input(
      z.object({
        city: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { city } = input;

      // Get city set info
      const [citySet] = await ctx.db
        .select()
        .from(citySets)
        .where(and(eq(citySets.city, city)));

      if (!citySet) {
        return null;
      }

      // Get all photos in this city
      const cityPhotos = await ctx.db
        .select()
        .from(photos)
        .where(and(eq(photos.city, city), eq(photos.visibility, "public")))
        .orderBy(desc(photos.dateTimeOriginal), desc(photos.createdAt));

      return {
        ...citySet,
        photos: cityPhotos,
      };
    }),

  // Update city cover photo
  updateCoverPhoto: protectedProcedure
    .input(
      z.object({
        cityId: z.uuid(),
        photoId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId, photoId } = input;

      // Verify the photo exists
      const [photo] = await ctx.db
        .select()
        .from(photos)
        .where(eq(photos.id, photoId));

      if (!photo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Photo not found",
        });
      }

      // Verify the city set exists
      const [citySet] = await ctx.db
        .select()
        .from(citySets)
        .where(eq(citySets.id, cityId));

      if (!citySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      // Verify the photo belongs to this city
      if (photo.city !== citySet.city) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Photo does not belong to this city",
        });
      }

      // Update the cover photo
      const [updatedCitySet] = await ctx.db
        .update(citySets)
        .set({
          coverPhotoId: photoId,
          updatedAt: new Date(),
        })
        .where(eq(citySets.id, cityId))
        .returning();

      return updatedCitySet;
    }),

  // Update city (name and/or description)
  update: protectedProcedure
    .input(
      z.object({
        cityId: z.uuid(),
        city: z.string().trim().min(1, "City name is required").optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId, city: newCity, description } = input;

      const [citySet] = await ctx.db
        .select()
        .from(citySets)
        .where(eq(citySets.id, cityId));

      if (!citySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      const oldCity = citySet.city;
      const isRenaming = newCity !== undefined && newCity !== oldCity;

      if (isRenaming) {
        const [existing] = await ctx.db
          .select()
          .from(citySets)
          .where(
            and(
              eq(citySets.country, citySet.country),
              eq(citySets.city, newCity),
            ),
          );

        if (existing && existing.id !== cityId) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `A city named "${newCity}" already exists in ${citySet.country}`,
          });
        }
      }

      return await ctx.db.transaction(async (tx) => {
        if (isRenaming) {
          await tx
            .update(photos)
            .set({
              city: newCity,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(photos.city, oldCity),
                eq(photos.country, citySet.country),
              ),
            );
        }

        const updateData: {
          city?: string;
          description?: string;
          updatedAt: Date;
        } = {
          updatedAt: new Date(),
        };

        if (isRenaming) {
          updateData.city = newCity;
        }
        if (description !== undefined) {
          updateData.description = description;
        }

        const [updatedCitySet] = await tx
          .update(citySets)
          .set(updateData)
          .where(eq(citySets.id, cityId))
          .returning();

        return updatedCitySet;
      });
    }),

  // Update city name specifically
  updateName: protectedProcedure
    .input(
      z.object({
        cityId: z.uuid(),
        newName: z.string().trim().min(1, "City name is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId, newName } = input;

      const [citySet] = await ctx.db
        .select()
        .from(citySets)
        .where(eq(citySets.id, cityId));

      if (!citySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      const oldCity = citySet.city;
      if (oldCity === newName) {
        return citySet;
      }

      const [existing] = await ctx.db
        .select()
        .from(citySets)
        .where(
          and(
            eq(citySets.country, citySet.country),
            eq(citySets.city, newName),
          ),
        );

      if (existing && existing.id !== cityId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `A city named "${newName}" already exists in ${citySet.country}`,
        });
      }

      return await ctx.db.transaction(async (tx) => {
        await tx
          .update(photos)
          .set({
            city: newName,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(photos.city, oldCity),
              eq(photos.country, citySet.country),
            ),
          );

        const [updatedCitySet] = await tx
          .update(citySets)
          .set({
            city: newName,
            updatedAt: new Date(),
          })
          .where(eq(citySets.id, cityId))
          .returning();

        return updatedCitySet;
      });
    }),

  // Update city description
  updateDescription: protectedProcedure
    .input(
      z.object({
        cityId: z.uuid(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { cityId, description } = input;

      // Verify the city set exists
      const [citySet] = await ctx.db
        .select()
        .from(citySets)
        .where(eq(citySets.id, cityId));

      if (!citySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      // Update the description
      const [updatedCitySet] = await ctx.db
        .update(citySets)
        .set({
          description,
          updatedAt: new Date(),
        })
        .where(eq(citySets.id, cityId))
        .returning();

      return updatedCitySet;
    }),
});
