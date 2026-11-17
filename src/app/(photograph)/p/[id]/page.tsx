import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  LoadingState,
  PhotographView,
} from "@/modules/photograph/ui/views/photograph-view";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const queryClient = getQueryClient();

  try {
    const data = await queryClient.fetchQuery(
      trpc.home.getPhotoById.queryOptions({ id })
    );

    return {
      title: data.title,
      description: data.description,
    };
  } catch {
    return {
      title: "Foto Tidak Ditemukan",
    };
  }
}

const page = async ({ params }: Props) => {
  const id = (await params).id;
  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery(trpc.home.getPhotoById.queryOptions({ id }));
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState />}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <PhotographView id={id} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
