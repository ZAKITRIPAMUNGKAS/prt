import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { desc, eq, isNotNull, and } from "drizzle-orm";
import { photos } from "@/db/schema";

export const discoverRouter = createTRPCRouter({
  getManyPhotos: baseProcedure.input(z.object({})).query(async ({ ctx }) => {
    const data = await ctx.db
      .select({
        id: photos.id,
        url: photos.url,
        title: photos.title,
        description: photos.description,
        latitude: photos.latitude,
        longitude: photos.longitude,
        blurData: photos.blurData,
        width: photos.width,
        height: photos.height,
        dateTimeOriginal: photos.dateTimeOriginal,
        make: photos.make,
        model: photos.model,
        lensModel: photos.lensModel,
        focalLength: photos.focalLength,
        focalLength35mm: photos.focalLength35mm,
        fNumber: photos.fNumber,
        iso: photos.iso,
        exposureTime: photos.exposureTime,
        city: photos.city,
        country: photos.country,
        countryCode: photos.countryCode,
        placeFormatted: photos.placeFormatted,
      })
      .from(photos)
      .where(
        and(
          eq(photos.visibility, "public"),
          isNotNull(photos.latitude),
          isNotNull(photos.longitude),
        ),
      )
      .orderBy(desc(photos.updatedAt));

    return data;
  }),
});
