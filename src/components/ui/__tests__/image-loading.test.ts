import { describe, it, expect, vi } from "vitest";

vi.unmock("react");

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ImageLoader } from "../image-loading";

describe("ImageLoader", () => {
  it("exports ImageLoader component correctly", () => {
    expect(ImageLoader).toBeDefined();
    expect(typeof ImageLoader).toBe("function");
  });

  it("renders a canvas-based matrix overlay in static markup", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ImageLoader, {
        gridSize: 16,
        gridRows: 16,
        cellGap: 3,
        cellShape: "square",
      })
    );

    expect(markup).toBeDefined();
    expect(markup).toContain("<canvas");
    expect(markup).toContain('data-grid-cols="16"');
    expect(markup).toContain('data-grid-rows="16"');
    expect(markup).toContain('data-shape="square"');
  });

  it("renders with rounded and circle cell shapes", () => {
    const circleMarkup = renderToStaticMarkup(
      React.createElement(ImageLoader, {
        gridSize: 4,
        gridRows: 4,
        cellShape: "circle",
      })
    );
    expect(circleMarkup).toContain('data-shape="circle"');

    const roundedMarkup = renderToStaticMarkup(
      React.createElement(ImageLoader, {
        gridSize: 4,
        gridRows: 4,
        cellShape: "rounded",
      })
    );
    expect(roundedMarkup).toContain('data-shape="rounded"');
  });

  it("supports standalone skeleton mode when src is null or undefined", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ImageLoader, {
        aspectRatio: 0.75,
        className: "rounded-xl",
      })
    );

    expect(markup).toContain("rounded-xl");
    expect(markup).toContain("aspect-ratio:0.75");
    expect(markup).toContain("<canvas");
    // Ensure no <img> tag rendered when src is missing
    expect(markup).not.toContain("<img");
  });
});
