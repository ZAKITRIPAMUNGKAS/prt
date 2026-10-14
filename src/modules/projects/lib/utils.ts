import { keyToUrl } from "@/modules/s3/lib/key-to-url";

export function getProjectCoverUrl(coverKey: string | null | undefined): string {
  if (!coverKey) return "/placeholder.svg";
  if (
    coverKey.startsWith("http://") ||
    coverKey.startsWith("https://") ||
    coverKey.startsWith("/")
  ) {
    return coverKey;
  }

  return `/api/media?${new URLSearchParams({ key: coverKey }).toString()}`;
}

export function getProjectVideoUrl(videoKey: string | null | undefined): string | null {
  if (!videoKey) return null;
  if (
    videoKey.startsWith("http://") ||
    videoKey.startsWith("https://") ||
    videoKey.startsWith("/")
  ) {
    return videoKey;
  }
  const s3Url = keyToUrl(videoKey);
  if (!s3Url || s3Url.includes("your-custom-domain.com")) {
    return null;
  }
  return s3Url;
}

export function generateProjectSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
