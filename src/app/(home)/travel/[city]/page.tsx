import { Metadata } from "next";
import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { CityView, CityViewLoadingStatus } from "@/modules/travel/ui/views/city-view";

type Props = {
  params: Promise<{
    city: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = (await params).city;
  const decodedCity = decodeURIComponent(city);
  const title = `Foto Perjalanan di ${decodedCity}`;
  const description = `Galeri fotografi dan dokumentasi perjalanan di ${decodedCity} oleh Zaki Tri Pamungkas.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const Page = async ({ params }: Props) => {
  const { city } = await params;

  // Decode URL-encoded params
  const decodedCity = decodeURIComponent(city);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.travel.getOne.queryOptions({
      city: decodedCity,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Suspense fallback={<CityViewLoadingStatus />}>
          <CityView city={decodedCity} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default Page;
