export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 100;

// Upload image limit is 20MB
export const IMAGE_SIZE_LIMIT = 50 * 1024 * 1024;

export const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/avif",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".avif",
] as const;

// Video upload limit is 8MB
export const VIDEO_SIZE_LIMIT = 8 * 1024 * 1024;

export const ALLOWED_VIDEO_CONTENT_TYPES = [
  "video/mp4",
  "video/webm",
] as const;

export const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".webm"] as const;

export const ALL_ALLOWED_CONTENT_TYPES = [
  ...ALLOWED_CONTENT_TYPES,
  ...ALLOWED_VIDEO_CONTENT_TYPES,
] as const;

// Upload default folder
export const DEFAULT_PHOTOS_UPLOAD_FOLDER = "photos";
