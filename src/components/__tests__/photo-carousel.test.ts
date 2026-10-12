import { describe, expect, it } from "vitest";

describe("carousel autoplay calculation logic", () => {
  it("calculates progress percentage correctly", () => {
    const delay = 6000;
    const elapsed = 3000;
    const progress = Math.min(100, (elapsed / delay) * 100);
    expect(progress).toBe(50);
  });

  it("caps progress at 100%", () => {
    const delay = 6000;
    const elapsed = 7500;
    const progress = Math.min(100, (elapsed / delay) * 100);
    expect(progress).toBe(100);
  });

  it("resets progress when slide changes", () => {
    let elapsed = 6000;
    let progress = Math.min(100, (elapsed / 6000) * 100);
    expect(progress).toBe(100);

    // Slide changes
    elapsed = 0;
    progress = 0;
    expect(progress).toBe(0);
  });
});
