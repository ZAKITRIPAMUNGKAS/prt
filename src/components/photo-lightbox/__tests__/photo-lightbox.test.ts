import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExifPanel } from "../exif-panel";
import type { LightboxPhoto } from "../types";

vi.unmock("react");

describe("PhotoLightbox - ExifPanel", () => {
  it("formats shutter speed with < 1s as '1/250 s' and displays focal length with 35mm equivalent", () => {
    const photo: LightboxPhoto = {
      id: "test-1",
      url: "photos/test.jpg",
      title: "Sunset in Tokyo",
      make: "Sony",
      model: "ILCE-7M4",
      lensModel: "FE 24-70mm F2.8 GM",
      focalLength: 35,
      focalLength35mm: 50,
      fNumber: 2.8,
      exposureTime: 0.004, // 1/250
      iso: 100,
      dateTimeOriginal: new Date("2024-05-10T14:30:00Z"),
      city: "Tokyo",
      country: "Japan",
    };

    const markup = renderToStaticMarkup(
      React.createElement(ExifPanel, { photo, isOpen: true })
    );

    // Should contain formatted shutter speed
    expect(markup).toContain("1/250 s");
    // Should contain focal length with 35mm equivalent
    expect(markup).toContain("35mm (50mm eq.)");
    // Should contain aperture
    expect(markup).toContain("f/2.8");
    // Should contain ISO
    expect(markup).toContain("ISO 100");
    // Should not contain N/A
    expect(markup).not.toContain("N/A");
  });

  it("omits empty fields entirely without displaying 'N/A'", () => {
    const photo: LightboxPhoto = {
      id: "test-2",
      url: "photos/simple.jpg",
      title: "Simple Flower",
      // No make, model, lens, exposure, etc.
    };

    const markup = renderToStaticMarkup(
      React.createElement(ExifPanel, { photo, isOpen: true })
    );

    // Because there is no EXIF, it should render nothing
    expect(markup).toBe("");
    expect(markup).not.toContain("N/A");
  });

  it("does not render panel contents when isOpen is false", () => {
    const photo: LightboxPhoto = {
      id: "test-3",
      url: "photos/landscape.jpg",
      title: "Mountains",
      make: "Fujifilm",
      model: "X-T5",
      fNumber: 4,
    };

    const markup = renderToStaticMarkup(
      React.createElement(ExifPanel, { photo, isOpen: false })
    );

    // When closed, inner details are not rendered
    expect(markup).not.toContain("Fujifilm");
  });
});
