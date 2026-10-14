import { Metadata } from "next";
import { BlogSlugView, BlogSlugLoadingStatus } from "@/modules/blog/ui/views/blog-slug-view";
import { getQueryClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { siteConfig } from "@/site.config";

type Props = {
  params: Promise<{ slug: string }>;
};

function getSocialVersion(
  updatedAt: Date | string | null | undefined,
  fallback: string
) {
  return `3-${updatedAt ? new Date(updatedAt).getTime() : fallback}`;
}

function getOgImageUrl(
  baseUrl: string,
  coverImage: string | null | undefined,
  updatedAt: Date | string | null | undefined
) {
  if (!coverImage) {
    return `${baseUrl}/fotoku.png`;
  }

  const params = new URLSearchParams({
    key: coverImage,
    // A new version prevents social crawlers from reusing a previous failed
    // thumbnail fetch. Changes to the post naturally produce a new URL.
    v: getSocialVersion(updatedAt, coverImage),
  });

  return `${baseUrl}/api/og-image?${params.toString()}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const decodedSlug = decodeURIComponent(slug);
  const queryClient = getQueryClient();

  try {
    const data = await queryClient.fetchQuery(
      trpc.blog.getOne.queryOptions({ slug: decodedSlug })
    );

    if (!data) {
      return {
        title: "Artikel Tidak Ditemukan",
        description: "Artikel yang Anda cari tidak ditemukan.",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://me.tepegrafi.id";
    const postUrl = `${baseUrl}/blog/${data.slug}`;
    const socialUrl = `${postUrl}?og=${getSocialVersion(
      data.updatedAt,
      data.coverImage || data.slug
    )}`;

    // Proxy via /api/og-image (served over me.tepegrafi.id with valid SSL)
    // Direct R2 CDN URL has broken SSL cert so WhatsApp/social crawlers can't fetch it
    const ogImage = getOgImageUrl(baseUrl, data.coverImage, data.updatedAt);

    const cleanDescription =
      data.description || siteConfig.metadata.description;

    return {
      title: data.title,
      description: cleanDescription,
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: data.title,
        description: cleanDescription,
        // Keep the canonical URL clean, but rotate this cache identity when a
        // post changes so WhatsApp/Meta fetches a fresh preview.
        url: socialUrl,
        siteName: siteConfig.name,
        locale: "id_ID",
        type: "article",
        publishedTime: data.createdAt
          ? new Date(data.createdAt).toISOString()
          : undefined,
        modifiedTime: data.updatedAt
          ? new Date(data.updatedAt).toISOString()
          : undefined,
        authors: [siteConfig.name],
        tags: data.tags ?? [],
        images: [
          {
            url: ogImage,
            secureUrl: ogImage,
            width: 1200,
            height: 630,
            alt: data.title,
            type: "image/jpeg",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: cleanDescription,
        images: [ogImage],
        creator: "@zakitripamungkas",
      },
    };
  } catch {
    return {
      title: "Blog — " + siteConfig.name,
      description: siteConfig.metadata.description,
    };
  }
}

export default async function page({ params }: Props) {
  const slug = (await params).slug;
  const decodedSlug = decodeURIComponent(slug);
  const queryClient = getQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://me.tepegrafi.id";
  const postUrl = `${baseUrl}/blog/${decodedSlug}`;

  let jsonLd: Record<string, unknown> | null = null;

  try {
    const post = await queryClient.fetchQuery(
      trpc.blog.getOne.queryOptions({ slug: decodedSlug })
    );

    if (post) {
      const ogImage = getOgImageUrl(baseUrl, post.coverImage, post.updatedAt);

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description || post.title,
        image: [ogImage],
        datePublished: post.createdAt
          ? new Date(post.createdAt).toISOString()
          : undefined,
        dateModified: post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : undefined,
        author: {
          "@type": "Person",
          name: siteConfig.name,
          url: baseUrl,
        },
        publisher: {
          "@type": "Person",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/profil.jpg`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
      };
    }
  } catch {
    // Handled by ErrorBoundary
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<BlogSlugLoadingStatus />}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <BlogSlugView slug={decodedSlug} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
