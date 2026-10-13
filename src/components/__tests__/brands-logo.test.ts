import { describe, expect, it } from "vitest";

describe("Brand matching logic", () => {
  const brandConfigs: Record<string, { src: string }> = {
    sony: { src: "/Sony_logo.svg" },
    nikon: { src: "/Nikon_Logo.svg" },
    canon: { src: "/Canon_logo.svg" },
    fujifilm: { src: "/Fujifilm_logo.svg" },
    fuji: { src: "/Fujifilm_logo.svg" },
    apple: { src: "/Apple_logo.svg" },
    iphone: { src: "/Apple_logo.svg" },
    googleg: { src: "/Google_G_logo.svg" },
    google: { src: "/Google_logo.svg" },
    pixel: { src: "/Google_logo.svg" },
  };

  const matchBrand = (brand: string) => {
    if (!brand || !brand.trim()) return "/placeholder.svg";
    const normalizedBrand = brand.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const brandKeys = Object.keys(brandConfigs).sort((a, b) => b.length - a.length);
    const exactMatch = brandKeys.find(
      (key) => key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() === normalizedBrand
    );
    const matched =
      exactMatch ||
      brandKeys.find((brandKey) => {
        const cleanKey = brandKey.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return normalizedBrand.includes(cleanKey);
      });
    return matched ? brandConfigs[matched].src : "/placeholder.svg";
  };

  it("matches Google correctly", () => {
    expect(matchBrand("Google")).toBe("/Google_logo.svg");
    expect(matchBrand("google")).toBe("/Google_logo.svg");
  });

  it("matches Google Pixel correctly", () => {
    expect(matchBrand("Google Pixel")).toBe("/Google_logo.svg");
    expect(matchBrand("Pixel 8 Pro")).toBe("/Google_logo.svg");
  });

  it("matches Google G logo correctly", () => {
    expect(matchBrand("Google (G)")).toBe("/Google_G_logo.svg");
    expect(matchBrand("Google G")).toBe("/Google_G_logo.svg");
  });

  it("matches major camera brands correctly", () => {
    expect(matchBrand("Sony ILCE-7M4")).toBe("/Sony_logo.svg");
    expect(matchBrand("Canon EOS R5")).toBe("/Canon_logo.svg");
    expect(matchBrand("Apple iPhone 15 Pro")).toBe("/Apple_logo.svg");
    expect(matchBrand("Fujifilm X-T5")).toBe("/Fujifilm_logo.svg");
  });

  it("falls back to placeholder for unknown brands", () => {
    expect(matchBrand("")).toBe("/placeholder.svg");
    expect(matchBrand("UnknownMaker")).toBe("/placeholder.svg");
  });
});
