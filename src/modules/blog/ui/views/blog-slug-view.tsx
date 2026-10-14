"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiArrowLeft } from "react-icons/pi";
import { navigateWithViewTransition } from "@/lib/view-transition";
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
);
import { siteConfig } from "@/site.config";
import { useBlogReaderTracking } from "../../hooks/use-blog-reader-tracking";

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
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getOne.queryOptions({ slug }));

  useBlogReaderTracking({ slug: data.slug });

  const { monthYear: publishedLabel, date: publishedDate } = formatBlogDate(
    data.createdAt,
  );
  const transitionName = `blog-${data.slug}`;

  const scrollToArticle = () => {
    document
      .getElementById("article-content")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <div
          className="block w-full h-full relative rounded-xl overflow-hidden bg-muted"
          style={{ viewTransitionName: transitionName }}
        >
          <BlurImage
            src={keyToUrl(data.coverImage) || "/placeholder.svg"}
            alt={data.title}
            fill
            quality={80}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />

          <div className="absolute right-0 bottom-0 pointer-events-none z-10">
            <VectorCombined
              title={data.tags?.[0] || "Artikel"}
              position="bottom-right"
            />
          </div>
        </div>
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* BACK LINK */}
        <div className="px-2 pt-1">
          <Link
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              navigateWithViewTransition(() => router.push("/blog"));
            }}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <PiArrowLeft size={16} />
            <span>Semua Artikel</span>
          </Link>
        </div>

        {/* HEADER CARD */}
        <div className="bg-muted rounded-xl p-8 md:p-10 flex flex-col gap-6 font-light">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="bg-background/80 border rounded-md py-1 px-2.5 text-xs text-text-muted font-light">
              {publishedLabel}
            </span>
            <span className="text-xs text-text-muted font-light">
              {data.readingTimeMinutes || 3} menit baca
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight">
              {data.title}
            </h1>
            {data.description && (
              <h2 className="text-base md:text-lg text-text-muted font-light leading-relaxed">
                {data.description}
              </h2>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToArticle}
                className="bg-background hover:bg-muted duration-150 transition-all border inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-light cursor-pointer"
              >
                <span>Baca Artikel</span>
                <ArrowDownIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* METADATA BAR ALA BENTO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-muted rounded-xl p-4 flex flex-col justify-between gap-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Kategori</p>
            <p className="font-medium text-foreground">{data.tags?.[0] || "Umum"}</p>
          </div>

          <div className="bg-muted rounded-xl p-4 flex flex-col justify-between gap-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Waktu Baca</p>
            <p className="font-medium text-foreground">{data.readingTimeMinutes || 3} Menit</p>
          </div>

          <div className="bg-muted rounded-xl p-4 flex flex-col justify-between gap-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Tanggal</p>
            <p className="font-medium text-foreground">{publishedDate}</p>
          </div>
        </div>

        {/* TAGS PILLS (IF MULTIPLE) */}
        {data.tags && data.tags.length > 1 && (
          <div className="bg-muted rounded-xl p-5 flex flex-col gap-2">
            <p className="text-xs text-text-muted uppercase tracking-wider">Topik Terkait</p>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-background/80 border rounded-md text-xs font-light"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ARTICLE CONTENT */}
        <article id="article-content" className="bg-muted rounded-xl p-8 md:p-12 scroll-mt-3">
          <RichTextViewer content={data.content || ""} />
        </article>

        {/* CONTACT CARDS */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {siteConfig.socialLinks.map((link) => (
            <ContactCard
              key={link.title}
              title={link.title}
              href={link.href}
              {...(link.primary && {
                className:
                  "bg-primary text-white dark:text-black hover:bg-primary",
              })}
            />
          ))}
        </div>

        {/* FOOTER */}
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
        <div className="bg-muted rounded-xl p-8 md:p-10 space-y-4">
          <Skeleton className="w-24 h-5 rounded-sm" />
          <div className="space-y-3">
            <Skeleton className="w-3/4 h-10 rounded-lg" />
            <Skeleton className="w-1/2 h-6 rounded-lg" />
            <div className="pt-2">
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>

        <div className="bg-muted rounded-xl p-8 md:p-12 space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>

        <Footer />
      </div>
    </div>
  );
};
