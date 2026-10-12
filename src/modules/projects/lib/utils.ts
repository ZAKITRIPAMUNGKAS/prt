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
  const s3Url = keyToUrl(coverKey);
  if (!s3Url || s3Url.includes("your-custom-domain.com") || s3Url.startsWith("/")) {
    return "/placeholder.svg";
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
