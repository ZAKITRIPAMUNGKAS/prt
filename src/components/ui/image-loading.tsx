"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ImageLoaderProps {
  /** Source URL of the target image */
  src?: string | null;
  /** Alt text for accessibility */
  alt?: string;
  /** Explicit width (e.g. "500px", 500, "100%") */
  width?: string | number;
  /** Explicit height (e.g. "630px", 630, "100%") */
  height?: string | number;
  /** Whether the image should fill its parent container */
  fill?: boolean;
  /** Number of grid columns (default: 20) */
  gridSize?: number;
  /** Number of grid rows (optional, computed automatically from aspect ratio if omitted) */
  gridRows?: number;
  /** Spacing between individual grid cells in pixels (default: 3) */
  cellGap?: number;
  /** Shape of each cell: "square" (crisp pixel), "circle", or "rounded" */
  cellShape?: "square" | "circle" | "rounded";
  /** Fallback or base color for the grid cells */
  cellColor?: string;
  /** Blinking animation speed in milliseconds (default: 2000) */
  blinkSpeed?: number;
  /** Expansion transition duration in milliseconds when gaps collapse (default: 500) */
  transitionDuration?: number;
  /** Fade out transition duration in milliseconds (default: 600) */
  fadeOutDuration?: number;
  /** Artificial loading delay in milliseconds (default: 0) */
  loadingDelay?: number;
  /** Optional aspect ratio (e.g. 0.75 for 3:4 portrait) to accurately shape the grid */
  aspectRatio?: number;
  /** Additional class names for the container */
  className?: string;
  /** Additional styles for the container */
  style?: React.CSSProperties;
  /** Callback fired when transition completes and image is fully revealed */
  onLoaded?: () => void;
  /** Optional content or overlay children */
  children?: React.ReactNode;
}

/**
 * Deterministic pseudo-random number based on grid coordinates.
 * Guarantees zero SSR hydration mismatch while producing natural organic blinking.
 */
function pseudoRandom(x: number, y: number): number {
  const sin = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return sin - Math.floor(sin);
}

/**
 * ImageLoader component based on Tony Sebastian's 21st.dev specification.
 *
 * Provides a futuristic, animated matrix grid overlay while data and images load.
 * 1. Initial State: Grid cells blink with staggered organic timing.
 * 2. Color Sampling: Samples colors from the loaded image canvas.
 * 3. Expansion: Gaps smoothly collapse into a pixel-mosaic preview.
 * 4. Fade Out: Seamlessly fades out to reveal the sharp final image.
 *
 * Can also be used as a standalone skeleton placeholder when real database data is pending.
 */
export function ImageLoader({
  src,
  alt = "",
  width,
  height,
  fill = false,
  gridSize = 20,
  gridRows,
  cellGap = 3,
  cellShape = "square",
  cellColor,
  blinkSpeed = 2000,
  transitionDuration = 500,
  fadeOutDuration = 600,
  loadingDelay = 0,
  aspectRatio,
  className,
  style,
  onLoaded,
  children,
}: ImageLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animKey = useId().replace(/:/g, "");

  // Grid dimensions
  const cols = Math.max(3, gridSize);
  const rows = useMemo(() => {
    if (gridRows && gridRows > 0) return gridRows;
    if (aspectRatio && aspectRatio > 0) {
      return Math.max(3, Math.round(cols / aspectRatio));
    }
    return cols; // Default square grid if no aspect ratio provided
  }, [gridRows, aspectRatio, cols]);

  const totalCells = cols * rows;

  // Animation lifecycle states:
  // "loading" -> "sampling" -> "expanding" -> "fading" -> "completed"
  const [stage, setStage] = useState<
    "loading" | "sampling" | "expanding" | "fading" | "completed"
  >("loading");
  const [sampledColors, setSampledColors] = useState<string[]>([]);

  // Precompute deterministic timing and shapes for every cell
  const cells = useMemo(() => {
    const list = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rand = pseudoRandom(c + 1, r + 1);
        const delay = Math.round(rand * blinkSpeed * 0.85);
        const duration = Math.round(blinkSpeed * (0.8 + rand * 0.4));
        list.push({ col: c, row: r, delay, duration });
      }
    }
    return list;
  }, [rows, cols, blinkSpeed]);

  // Color sampling logic when src is provided
  useEffect(() => {
    if (!src) return;

    let isCancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const handleSuccess = () => {
      if (isCancelled) return;

      const performSampling = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = cols;
          canvas.height = rows;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          if (ctx) {
            ctx.drawImage(img, 0, 0, cols, rows);
            const imgData = ctx.getImageData(0, 0, cols, rows);
            const extracted: string[] = [];

            for (let i = 0; i < totalCells; i++) {
              const r = imgData.data[i * 4];
              const g = imgData.data[i * 4 + 1];
              const b = imgData.data[i * 4 + 2];
              const a = (imgData.data[i * 4 + 3] / 255).toFixed(2);
              extracted.push(`rgba(${r}, ${g}, ${b}, ${a})`);
            }
            if (!isCancelled) {
              setSampledColors(extracted);
            }
          }
        } catch {
          // Fallback if canvas is tainted by CORS
        }

        if (isCancelled) return;
        setStage("sampling");

        // Sequence: Sampling -> Expanding -> Fading -> Completed
        window.setTimeout(() => {
          if (isCancelled) return;
          setStage("expanding");

          window.setTimeout(() => {
            if (isCancelled) return;
            setStage("fading");

            window.setTimeout(() => {
              if (isCancelled) return;
              setStage("completed");
              onLoaded?.();
            }, fadeOutDuration);
          }, transitionDuration);
        }, 150);
      };

      if (loadingDelay > 0) {
        window.setTimeout(performSampling, loadingDelay);
      } else {
        performSampling();
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      handleSuccess();
    } else {
      img.onload = handleSuccess;
      img.onerror = () => {
        if (!isCancelled) {
          setStage("completed");
        }
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [
    src,
    cols,
    rows,
    totalCells,
    loadingDelay,
    transitionDuration,
    fadeOutDuration,
    onLoaded,
  ]);

  // Border radius based on cellShape
  const shapeClass =
    cellShape === "circle"
      ? "rounded-full"
      : cellShape === "rounded"
      ? "rounded-xs"
      : "rounded-[1px]";

  // Gap collapses to 0 when expanding or fading
  const currentGap =
    stage === "expanding" || stage === "fading" || stage === "completed"
      ? 0
      : cellGap;

  // Keyframe animation name unique to this instance
  const keyframeName = `gridBlink_${animKey}`;

  // Container sizing
  const containerStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(aspectRatio && { aspectRatio: `${aspectRatio}` }),
  };

  const isOverlayVisible = stage !== "completed";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted/40",
        fill ? "absolute inset-0 w-full h-full" : "w-full h-full",
        className
      )}
      style={containerStyle}
    >
      <style>{`
        @keyframes ${keyframeName} {
          0%, 100% {
            opacity: 0.18;
            transform: scale(0.72);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.0);
          }
        }
      `}</style>

      {/* Real Next.js image if src is supplied */}
      {src && (
        <Image
          src={src}
          alt={alt}
          fill={fill || !width || !height}
          width={!fill && typeof width === "number" ? width : undefined}
          height={!fill && typeof height === "number" ? height : undefined}
          className={cn(
            "object-cover transition-opacity duration-700 ease-in-out",
            stage === "fading" || stage === "completed"
              ? "opacity-100"
              : "opacity-0"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* Children content (if any) */}
      {children}

      {/* Animated Matrix Grid Overlay */}
      {isOverlayVisible && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-10 p-1",
            "transition-opacity ease-out",
            stage === "fading" ? "opacity-0" : "opacity-100"
          )}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gap: `${currentGap}px`,
            transitionProperty: "gap, opacity",
            transitionDuration: `${
              stage === "fading" ? fadeOutDuration : transitionDuration
            }ms`,
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {cells.map(({ col, row, delay, duration }, index) => {
            const sampled = sampledColors[index];
            const hasColor = Boolean(sampled);

            return (
              <div
                key={`${col}-${row}`}
                className={cn(
                  "w-full h-full transition-all",
                  shapeClass,
                  // Default subtle color when not sampled
                  !hasColor &&
                    !cellColor &&
                    "bg-foreground/20 dark:bg-foreground/15 shadow-xs"
                )}
                style={{
                  backgroundColor: sampled || cellColor || undefined,
                  animation:
                    stage === "loading"
                      ? `${keyframeName} ${duration}ms ease-in-out infinite`
                      : "none",
                  animationDelay: `${delay}ms`,
                  transition: `background-color 300ms ease, transform ${transitionDuration}ms ease, border-radius ${transitionDuration}ms ease`,
                  transform:
                    stage === "expanding" || stage === "fading"
                      ? "scale(1.02)"
                      : undefined,
                  borderRadius:
                    stage === "expanding" || stage === "fading"
                      ? "0px"
                      : undefined,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ImageLoader;
