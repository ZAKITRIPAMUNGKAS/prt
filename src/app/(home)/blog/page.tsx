import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  BlogView,
  BlogViewLoadingStatus,
} from "@/modules/blog/ui/views/blog-view";

import { type Metadata } from "next";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Kumpulan artikel, pemikiran, dan catatan teknis seputar web development, rekayasa sistem, dan visual maker oleh Zaki Tri Pamungkas.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog — ${siteConfig.name}`,
    description:
      "Kumpulan artikel, pemikiran, dan catatan teknis seputar web development, rekayasa sistem, dan visual maker.",
    url: "/blog",
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/fotoku.png",
        width: 1200,
        height: 630,
        alt: `Blog ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog — ${siteConfig.name}`,
    description:
      "Kumpulan artikel, pemikiran, dan catatan teknis seputar web development, rekayasa sistem, dan visual maker.",
    images: ["/fotoku.png"],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { PageEntrance } from "@/components/page-entrance";

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.blog.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageEntrance>
        <Suspense fallback={<BlogViewLoadingStatus />}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <BlogView />
          </ErrorBoundary>
        </Suspense>
      </PageEntrance>
    </HydrationBoundary>
  );
};

export default page;
