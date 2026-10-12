export interface LightboxPhoto {
  id: string;
  url: string;
  title: string;
  description?: string | null;
  blurData?: string | null;
  width?: number | null;
  height?: number | null;
  aspectRatio?: number | null;
  city?: string | null;
  country?: string | null;
  countryCode?: string | null;
  placeFormatted?: string | null;
  make?: string | null;
  model?: string | null;
  lensModel?: string | null;
  focalLength?: number | null;
  focalLength35mm?: number | null;
  fNumber?: number | null;
  iso?: number | null;
  exposureTime?: number | null;
  exposureCompensation?: number | null;
  dateTimeOriginal?: string | Date | null;
}

export interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  activePhotoId: string | null;
  onClose: () => void;
  onNavigate?: (photoId: string) => void;
}
