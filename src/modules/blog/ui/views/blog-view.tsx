"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import CardContainer from "@/components/card-container";
import Footer from "@/components/footer";
import ContactCard from "@/components/contact-card";
import { PostsSection } from "../components/blog-items";
import { LatestPostSection } from "../components/latest-blog-section";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/site.config";

export const BlogView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getMany.queryOptions());

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <LatestPostSection data={data?.[0]} />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* DESCRIPTION CARD  */}
        <CardContainer>
          <div className="flex flex-col p-6 md:p-8 gap-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Blog</h1>
              <span className="text-xs text-text-muted bg-muted px-2.5 py-1 rounded-full border border-border/40 font-light">
                {data.length} Artikel
              </span>
            </div>
            <div className="font-light text-text-muted leading-relaxed text-sm md:text-[15px]">
              <p>
                Selamat datang di blog saya. Di sini saya menuliskan pemikiran, catatan teknis seputar web development, studi kasus rekayasa sistem, serta cerita di balik foto dan proyek visual.
              </p>
            </div>
          </div>
        </CardContainer>

        {/* POST LIST  */}

        <PostsSection data={data} />

        {/* CONTACT CARDS  */}
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

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};

export const BlogViewLoadingStatus = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* DESCRIPTION CARD SKELETON */}
        <CardContainer>
          <div className="flex flex-col p-6 md:p-8 gap-3">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Blog</h1>
            <div className="font-light text-text-muted leading-relaxed text-sm md:text-[15px]">
              <p>
                Selamat datang di blog saya. Di sini saya menuliskan pemikiran, catatan teknis seputar web development, studi kasus rekayasa sistem, serta cerita di balik foto dan proyek visual.
              </p>
            </div>
          </div>
        </CardContainer>

        {/* POST LIST SKELETON */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-3/4 rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>

        {/* CONTACT CARDS  */}
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

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};
