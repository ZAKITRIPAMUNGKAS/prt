import { describe, expect, it } from "vitest";
import { projectFormSchema } from "../schemas";
import { getProjectVideoUrl, generateProjectSlug } from "../lib/utils";

const baseProject = {
  title: "ARQAM App",
  slug: "arqam-app",
  summary: "Sistem penilaian AHP-SAW",
  role: "Lead Developer",
  stack: ["Laravel", "PHP"],
  year: "2026",
  duration: "3 bulan",
  coverKey: "projects/arqam-app.jpg",
  body: "### Masalah\nDeskripsi masalah",
  featured: true,
  order: 1,
};

describe("projectFormSchema validation", () => {
  it("validates project data without video key", () => {
    const res = projectFormSchema.safeParse(baseProject);
    expect(res.success).toBe(true);
  });

  it("validates project data with nullable or optional previewVideoKey", () => {
    const withNull = projectFormSchema.safeParse({
      ...baseProject,
      previewVideoKey: null,
    });
    expect(withNull.success).toBe(true);

    const withKey = projectFormSchema.safeParse({
      ...baseProject,
      previewVideoKey: "projects/demo.mp4",
    });
    expect(withKey.success).toBe(true);
    if (withKey.success) {
      expect(withKey.data.previewVideoKey).toBe("projects/demo.mp4");
    }
  });

  it("generates and parses slugs correctly", () => {
    const slug = generateProjectSlug("Smart Absensi & Presensi");
    expect(slug).toBe("smart-absensi-presensi");
  });
});

describe("getProjectVideoUrl", () => {
  it("returns null for empty videoKey", () => {
    expect(getProjectVideoUrl(null)).toBeNull();
    expect(getProjectVideoUrl("")).toBeNull();
    expect(getProjectVideoUrl(undefined)).toBeNull();
  });

  it("returns direct URLs as-is", () => {
    expect(getProjectVideoUrl("https://example.com/video.mp4")).toBe(
      "https://example.com/video.mp4"
    );
    expect(getProjectVideoUrl("/video.mp4")).toBe("/video.mp4");
  });
});
