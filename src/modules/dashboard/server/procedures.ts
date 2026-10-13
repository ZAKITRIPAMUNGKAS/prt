import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { photos, citySets, posts } from "@/db/schema";
import { sql, and, gte } from "drizzle-orm";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

let worldGeoJsonCache: GeoJSON.FeatureCollection | null = null;

const loadWorldGeoJson = async (): Promise<GeoJSON.FeatureCollection> => {
  if (worldGeoJsonCache) return worldGeoJsonCache;

  const filePath = path.join(process.cwd(), "public", "world.geojson");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw) as GeoJSON.FeatureCollection;

  worldGeoJsonCache = parsed;
  return parsed;
};

export const dashboardRouter = createTRPCRouter({
  getPhotosCountByMonth: protectedProcedure
    .input(
      z
        .object({
          years: z.number().min(1).max(10).default(3),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const years = input?.years ?? 3;

      // Calculate the start date (years ago from now)
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - years);

      const result = await ctx.db
        .select({
          month: sql<string>`TO_CHAR(${photos.dateTimeOriginal}, 'YYYY-MM')`,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(photos)
        .where(sql`${photos.dateTimeOriginal} >= ${startDate}`)
        .groupBy(sql`TO_CHAR(${photos.dateTimeOriginal}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${photos.dateTimeOriginal}, 'YYYY-MM')`);

      // Fill in missing months with 0 count
      const monthlyData: { month: string; count: number }[] = [];
      const currentDate = new Date(startDate);
      const endDate = new Date();

      while (currentDate <= endDate) {
        const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM format
        const existingData = result.find((item) => item.month === monthKey);

        monthlyData.push({
          month: monthKey,
          count: existingData?.count ?? 0,
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return monthlyData;
    }),

  getVisitedCountries: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        country: photos.country,
        countryCode: photos.countryCode,
        photoCount: sql<number>`COUNT(*)::int`,
        firstVisit: sql<Date>`MIN(${photos.dateTimeOriginal})`,
        lastVisit: sql<Date>`MAX(${photos.dateTimeOriginal})`,
      })
      .from(photos)
      .where(
        sql`${photos.country} IS NOT NULL AND ${photos.countryCode} IS NOT NULL`,
      )
      .groupBy(photos.country, photos.countryCode)
      .orderBy(sql`COUNT(*) DESC`);
    return result;
  }),

  getVisitedCountriesWithGeoJson: protectedProcedure.query(async ({ ctx }) => {
    // Aggregate visited countries with counts and dates
    const countries = await ctx.db
      .select({
        country: photos.country,
        countryCode: photos.countryCode,
        photoCount: sql<number>`COUNT(*)::int`,
        firstVisit: sql<Date>`MIN(${photos.dateTimeOriginal})`,
        lastVisit: sql<Date>`MAX(${photos.dateTimeOriginal})`,
      })
      .from(photos)
      .where(
        sql`${photos.country} IS NOT NULL AND ${photos.countryCode} IS NOT NULL`,
      )
      .groupBy(photos.country, photos.countryCode)
      .orderBy(sql`COUNT(*) DESC`);

    const visitedSet = new Set(
      countries.map((c) => c.countryCode as string).filter(Boolean),
    );

    const world = await loadWorldGeoJson();

    const features = world.features.map((feature) => {
      const id = String(feature.id ?? "");
      return {
        ...feature,
        properties: {
          ...feature.properties,
          visited: visitedSet.has(id),
        },
      };
    });

    return {
      countries,
      geoJson: {
        ...world,
        features,
      } as GeoJSON.FeatureCollection,
    };
  }),

  getVisitedCountriesGeoJson: protectedProcedure.query(async ({ ctx }) => {
    const visited = await ctx.db
      .select({
        countryCode: photos.countryCode,
      })
      .from(photos)
      .where(sql`${photos.countryCode} IS NOT NULL`)
      .groupBy(photos.countryCode);

    const visitedSet = new Set(
      visited.map((c) => c.countryCode as string).filter(Boolean),
    );

    const world = await loadWorldGeoJson();

    const features = world.features.map((feature) => {
      const id = String(feature.id ?? "");
      return {
        ...feature,
        properties: {
          ...feature.properties,
          visited: visitedSet.has(id),
        },
      };
    });

    return {
      ...world,
      features,
    } as GeoJSON.FeatureCollection;
  }),

  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const lastYearStart = new Date(currentYear - 1, 0, 1);
    const lastYearEnd = new Date(currentYear, 0, 1);

    // Run independent database queries in parallel
    const [
      totalPhotosResult,
      thisYearPhotosResult,
      lastYearPhotosResult,
      countriesResult,
      lastYearCountriesResult,
      citiesResult,
      lastYearCitiesResult,
      blogStatsResult,
    ] = await Promise.all([
      // 1. Total photo count
      ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(photos)
        .where(sql`${photos.dateTimeOriginal} IS NOT NULL`),

      // 2. This year photo count
      ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(photos)
        .where(
          and(
            gte(photos.dateTimeOriginal, yearStart),
            sql`${photos.dateTimeOriginal} IS NOT NULL`,
          ),
        ),

      // 3. Last year photo count
      ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(photos)
        .where(
          and(
            gte(photos.dateTimeOriginal, lastYearStart),
            sql`${photos.dateTimeOriginal} < ${lastYearEnd}`,
            sql`${photos.dateTimeOriginal} IS NOT NULL`,
          ),
        ),

      // 4. Total countries visited
      ctx.db
        .selectDistinct({ country: photos.country })
        .from(photos)
        .where(sql`${photos.country} IS NOT NULL`),

      // 5. Last year countries visited
      ctx.db
        .selectDistinct({ country: photos.country })
        .from(photos)
        .where(
          and(
            gte(photos.dateTimeOriginal, lastYearStart),
            sql`${photos.dateTimeOriginal} < ${lastYearEnd}`,
            sql`${photos.country} IS NOT NULL`,
          ),
        ),

      // 6. Total cities
      ctx.db
        .selectDistinct({ city: citySets.city })
        .from(citySets),

      // 7. Last year cities
      ctx.db
        .selectDistinct({ city: citySets.city })
        .from(citySets)
        .where(
          and(
            gte(citySets.createdAt, lastYearStart),
            sql`${citySets.createdAt} < ${lastYearEnd}`,
          ),
        ),

      // 8. Total blog stats
      ctx.db
        .select({
          totalPosts: sql<number>`COUNT(*)::int`,
          totalViews: sql<number>`COALESCE(SUM(${posts.views}), 0)::int`,
          totalReadingTime: sql<number>`COALESCE(SUM(${posts.totalReadingTimeSeconds}), 0)::int`,
          totalReadingCount: sql<number>`COALESCE(SUM(${posts.readingCount}), 0)::int`,
        })
        .from(posts),
    ]);

    const totalPhotos = totalPhotosResult[0]?.count ?? 0;
    const thisYearPhotos = thisYearPhotosResult[0]?.count ?? 0;
    const lastYearPhotos = lastYearPhotosResult[0]?.count ?? 0;

    const thisYearPercentChange =
      lastYearPhotos === 0
        ? thisYearPhotos > 0
          ? 100
          : 0
        : Math.round(
            ((thisYearPhotos - lastYearPhotos) / lastYearPhotos) * 100,
          );

    const totalCountries = countriesResult.length;
    const lastYearCountries = lastYearCountriesResult.length;

    const countriesPercentChange =
      lastYearCountries === 0
        ? totalCountries > 0
          ? 100
          : 0
        : Math.round(
            ((totalCountries - lastYearCountries) / lastYearCountries) * 100,
          );

    const totalCities = citiesResult.length;
    const lastYearCities = lastYearCitiesResult.length;

    const citiesPercentChange =
      lastYearCities === 0
        ? totalCities > 0
          ? 100
          : 0
        : Math.round(((totalCities - lastYearCities) / lastYearCities) * 100);

    const blogStats = (blogStatsResult as {
      totalPosts: number;
      totalViews: number;
      totalReadingTime: number;
      totalReadingCount: number;
    }[])[0] ?? {
      totalPosts: 0,
      totalViews: 0,
      totalReadingTime: 0,
      totalReadingCount: 0,
    };

    const avgReadingTimeSeconds =
      blogStats.totalReadingCount > 0
        ? Math.round(blogStats.totalReadingTime / blogStats.totalReadingCount)
        : 0;

    return {
      totalPhotos,
      thisYearPhotos,
      thisYearPercentChange,
      totalCountries,
      countriesPercentChange,
      totalCities,
      citiesPercentChange,
      totalBlogPosts: blogStats.totalPosts,
      totalBlogViews: blogStats.totalViews,
      avgReadingTimeSeconds,
      totalReadingSessions: blogStats.totalReadingCount,
    };
  }),
});
