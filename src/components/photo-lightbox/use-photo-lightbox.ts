"use client";

import { useQueryState, parseAsString } from "nuqs";
import { useCallback } from "react";

/**
 * Hook for managing photo lightbox state synced with the `?photo=<id>` URL query.
 * Uses history: "push" so browser Back button naturally closes the lightbox.
 */
export function usePhotoLightbox() {
  const [activePhotoId, setActivePhotoId] = useQueryState(
    "photo",
    parseAsString.withOptions({
      history: "push",
      shallow: true,
      scroll: false,
    })
  );

  const openPhoto = useCallback(
    (id: string) => {
      setActivePhotoId(id);
    },
    [setActivePhotoId]
  );

  const closePhoto = useCallback(() => {
    setActivePhotoId(null);
  }, [setActivePhotoId]);

  return {
    activePhotoId,
    openPhoto,
    closePhoto,
    setActivePhotoId,
  };
}
