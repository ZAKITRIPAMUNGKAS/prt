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

  it("renders a matrix grid with default properties in static markup", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ImageLoader, {
        gridSize: 6,
        gridRows: 6,
        cellGap: 4,
        cellShape: "square",
      })
    );

    expect(markup).toBeDefined();
    expect(markup).toContain("grid-template-columns:repeat(6, minmax(0, 1fr))");
    expect(markup).toContain("grid-template-rows:repeat(6, minmax(0, 1fr))");
  });

  it("renders with rounded and circle cell shapes", () => {
    const circleMarkup = renderToStaticMarkup(
      React.createElement(ImageLoader, {
        gridSize: 4,
        gridRows: 4,
        cellShape: "circle",
      })
    );
    expect(circleMarkup).toContain("rounded-full");

    const roundedMarkup = renderToStaticMarkup(
      React.createElement(ImageLoader, {
        gridSize: 4,
        gridRows: 4,
        cellShape: "rounded",
      })
    );
    expect(roundedMarkup).toContain("rounded-xs");
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
    // Ensure no <img> tag rendered when src is missing
    expect(markup).not.toContain("<img");
  });
});
