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
 * High-Performance ImageLoader component based on Tony Sebastian's 21st.dev specification.
 *
 * Implemented using an ultra-lightweight GPU-accelerated HTML5 Canvas instead of
 * thousands of DOM divs, reducing DOM node count by >95% and running at 60fps without lag.
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animKey = useId();

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

  const sampledColorsRef = useRef<string[] | null>(null);

  // Precompute random seeds for each cell
  const seeds = useMemo(() => {
    const arr = new Float32Array(totalCells);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr[r * cols + c] = pseudoRandom(c + 1, r + 1);
      }
    }
    return arr;
  }, [rows, cols, totalCells]);

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
          const sampleCanvas = document.createElement("canvas");
          sampleCanvas.width = cols;
          sampleCanvas.height = rows;
          const ctx = sampleCanvas.getContext("2d", { willReadFrequently: true });

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
              sampledColorsRef.current = extracted;
            }
          }
        } catch {
          // Fallback if canvas is tainted by CORS
        }

        if (isCancelled) return;
        setStage("sampling");

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

  // High-performance 60fps Canvas render loop
  useEffect(() => {
    if (stage === "completed") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let startTime: number | null = null;
    let expandStartTime: number | null = null;

    // Detect dark mode from document root
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");

    const defaultCellColor = isDark
      ? "rgba(255, 255, 255, 0.18)"
      : "rgba(15, 23, 42, 0.20)";

    const baseColor = cellColor || defaultCellColor;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const rect = canvas.getBoundingClientRect();
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Handle gap collapse animation during "expanding" or "fading"
      let currentGap = cellGap * dpr;
      if (stage === "expanding" || stage === "fading") {
        if (!expandStartTime) expandStartTime = timestamp;
        const expandElapsed = timestamp - expandStartTime;
        const progress = Math.min(1, expandElapsed / transitionDuration);
        currentGap = (cellGap * (1 - progress)) * dpr;
      }

      const totalGapW = (cols - 1) * currentGap;
      const totalGapH = (rows - 1) * currentGap;
      const cellW = Math.max(1, (w - totalGapW) / cols);
      const cellH = Math.max(1, (h - totalGapH) / rows);

      const sampled = sampledColorsRef.current;

      for (let r = 0; r < rows; r++) {
        const y = r * (cellH + currentGap);

        for (let c = 0; c < cols; c++) {
          const x = c * (cellW + currentGap);
          const index = r * cols + c;
          const seed = seeds[index];

          // Blinking calculation
          const duration = blinkSpeed * (0.8 + seed * 0.4);
          const cellTime = (elapsed + seed * blinkSpeed) % duration;
          const phase = Math.sin((cellTime / duration) * Math.PI * 2);

          let scale = 0.75 + 0.25 * ((phase + 1) / 2);
          let alpha = 0.18 + 0.77 * ((phase + 1) / 2);

          if (stage === "expanding" || stage === "fading") {
            scale = 1.0;
            alpha = 1.0;
          }

          const color = sampled ? sampled[index] : baseColor;
          ctx.fillStyle = color;
          ctx.globalAlpha = sampled ? 1.0 : alpha;

          // Compute cell draw dimensions around center point
          const cx = x + cellW / 2;
          const cy = y + cellH / 2;
          const drawW = cellW * scale;
          const drawH = cellH * scale;
          const drawX = cx - drawW / 2;
          const drawY = cy - drawH / 2;

          ctx.beginPath();
          if (cellShape === "circle") {
            const radius = Math.min(drawW, drawH) / 2;
            ctx.arc(cx, cy, Math.max(0.5, radius), 0, Math.PI * 2);
          } else if (cellShape === "rounded") {
            const rad = Math.min(drawW, drawH) * 0.25;
            if (ctx.roundRect) {
              ctx.roundRect(drawX, drawY, drawW, drawH, rad);
            } else {
              ctx.rect(drawX, drawY, drawW, drawH);
            }
          } else {
            // "square" with micro 1px corner radius
            const rad = 1 * dpr;
            if (ctx.roundRect) {
              ctx.roundRect(drawX, drawY, drawW, drawH, rad);
            } else {
              ctx.rect(drawX, drawY, drawW, drawH);
            }
          }
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animId);
    };
  }, [
    stage,
    cols,
    rows,
    cellGap,
    cellShape,
    cellColor,
    blinkSpeed,
    transitionDuration,
    seeds,
  ]);

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
      data-testid="image-loader"
      data-shape={cellShape}
      data-grid-cols={cols}
      data-grid-rows={rows}
    >
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

      {/* High-Performance Canvas Matrix Overlay (Single DOM Node!) */}
      {isOverlayVisible && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          key={animKey}
          className={cn(
            "pointer-events-none absolute inset-0 z-10 w-full h-full",
            "transition-opacity ease-out",
            stage === "fading" ? "opacity-0" : "opacity-100"
          )}
          style={{
            transitionDuration: `${fadeOutDuration}ms`,
          }}
        />
      )}
    </div>
  );
}

export default ImageLoader;
