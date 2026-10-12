"use client";

import VectorCombined from "@/components/vector-combined";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDownIcon } from "lucide-react";
import BlurImage from "@/components/blur-image";
import { Skeleton } from "@/components/ui/skeleton";
import ContactCard from "@/components/contact-card";
import Footer from "@/components/footer";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import dynamic from "next/dynamic";

const RichTextViewer = dynamic(
  () => import("@/components/editor/rich-text-viewer"),
  { ssr: false },
);
import { siteConfig } from "@/site.config";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

function formatBlogDate(value: Date | string) {
  const date = new Date(value);
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return {
    monthYear: `${month} ${year}`,
    date: `${date.getUTCDate()} ${month} ${year}`,
  };
}

export const BlogSlugView = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getOne.queryOptions({ slug }));

  const { monthYear: publishedLabel, date: publishedDate } = formatBlogDate(
    data.createdAt,
  );
  const contactHref =
    siteConfig.socialLinks.find((link) => link.title === "Contact me")?.href ??
    "";

  const scrollToArticle = () => {
    document
      .getElementById("article-content")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <div className="block w-full h-full relative rounded-xl overflow-hidden bg-muted">
          <BlurImage
            src={keyToUrl(data.coverImage) || "/placeholder.svg"}
            alt={data.title}
            fill
            quality={75}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />

          <div className="absolute right-0 bottom-0">
            <VectorCombined
              title={data.tags?.[0] || ""}
              position="bottom-right"
            />
          </div>
        </div>
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* CONTENT  */}
        <div className="bg-muted rounded-xl p-10 md:p-12 md:h-[calc(100vh-24px)] flex flex-col">
          <div className="mb-10">
            <span className="bg-muted-hover rounded-sm py-1 px-2 text-xs text-text-muted font-light">
              {publishedLabel}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <h1 className="text-4xl">{data.title}</h1>
            <h2 className="font-light">{data.description}</h2>

            <div className="mt-8">
              <button
                type="button"
                onClick={scrollToArticle}
                className="bg-background hover:bg-muted duration-150 transition-all flex items-center gap-1 py-[10px] pr-3 pl-[14px] rounded-lg"
              >
                <span className="text-sm font-light">Baca Artikel</span>{" "}
                <ArrowDownIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <p className="text-text-muted">Kategori</p>
            <p>{data.tags?.join(", ") || "Tanpa Kategori"}</p>
          </div>

          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <p className="text-text-muted">Waktu Baca</p>
            <p>{data.readingTimeMinutes} menit</p>
          </div>

          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <p className="text-text-muted">Tanggal</p>
            <p>{publishedDate}</p>
          </div>
        </div>

        {/* POST PREVIEW */}
        <article id="article-content" className="bg-muted rounded-xl p-8 md:p-12 scroll-mt-3">
          <RichTextViewer content={data.content || ""} />
        </article>

        {/* CONTACT CARD  */}
        <ContactCard
          title="Contact me"
          href={contactHref}
          className="bg-primary text-white hover:text-black dark:text-black dark:hover:text-white h-14"
        />

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};

export const BlogSlugLoadingStatus = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT SKELETON */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Spacer */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT SKELETON */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        <div className="bg-muted rounded-xl p-10 md:p-12 md:h-[calc(100vh-24px)] flex flex-col">
          <Skeleton className="w-24 h-5 rounded-sm" />
          <div className="mt-auto space-y-3">
            <Skeleton className="w-3/4 h-10 rounded-lg" />
            <Skeleton className="w-1/2 h-6 rounded-lg" />
            <div className="mt-8">
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-12 h-4" />
          </div>
          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>

        <div className="bg-muted rounded-xl p-8 md:p-12 space-y-3">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>

        <Footer />
      </div>
    </div>
  );
};
