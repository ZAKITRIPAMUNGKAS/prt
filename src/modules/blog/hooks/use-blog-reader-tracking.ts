"use client";

import { useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

interface UseBlogReaderTrackingProps {
  slug: string;
}

export function useBlogReaderTracking({ slug }: UseBlogReaderTrackingProps) {
  const trpc = useTRPC();
  const recordView = useMutation(trpc.blog.recordView.mutationOptions());
  const recordReadingTime = useMutation(
    trpc.blog.recordReadingTime.mutationOptions()
  );

  const viewRecordedRef = useRef(false);
  const readingRecordedRef = useRef(false);
  const activeSecondsRef = useRef(0);
  const lastActiveTimestampRef = useRef<number | null>(null);

  // 1. Record view once on mount
  useEffect(() => {
    if (!slug || viewRecordedRef.current) return;
    viewRecordedRef.current = true;
    recordView.mutate({ slug });
  }, [slug, recordView]);

  // 2. Track active reading time
  useEffect(() => {
    if (!slug) return;

    readingRecordedRef.current = false;
    activeSecondsRef.current = 0;
    lastActiveTimestampRef.current = Date.now();

    const updateActiveTime = () => {
      if (lastActiveTimestampRef.current !== null) {
        const elapsed = (Date.now() - lastActiveTimestampRef.current) / 1000;
        activeSecondsRef.current += elapsed;
        lastActiveTimestampRef.current = Date.now();
      }
    };

    const flushReadingTime = () => {
      if (readingRecordedRef.current) return;
      updateActiveTime();
      const totalSeconds = Math.round(activeSecondsRef.current);
      // Only record if reader spent at least 5 seconds, capped at 1 hour (3600s)
      if (totalSeconds >= 5) {
        readingRecordedRef.current = true;
        const boundedSeconds = Math.min(3600, totalSeconds);
        recordReadingTime.mutate({
          slug,
          seconds: boundedSeconds,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateActiveTime();
        lastActiveTimestampRef.current = null;
        flushReadingTime();
      } else if (document.visibilityState === "visible") {
        lastActiveTimestampRef.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      flushReadingTime();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      flushReadingTime();
    };
  }, [slug, recordReadingTime]);
}
