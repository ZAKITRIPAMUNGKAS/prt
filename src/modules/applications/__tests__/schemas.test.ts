import { describe, expect, it } from "vitest";
import { applicationFormSchema } from "../schemas";

const baseApplication = {
  company: "Kompas Gramedia",
  position: "Software Engineer",
  platform: "Kalibrr",
  jobUrl: "https://www.kalibrr.com/c/kompas-gramedia/jobs/12345",
  status: "applied" as const,
  appliedAt: "2026-10-12",
  salaryMin: 7000000,
  salaryMax: 9000000,
  expectedSalary: 8500000,
  employmentType: "Full time",
  location: "Jakarta Barat",
  nextStep: "Interview HR",
  nextStepAt: "2026-10-20",
  notes: "Menunggu balasan via email",
};

describe("applicationFormSchema - Gaji Min/Max validation", () => {
  it("validates when salaryMax is greater than or equal to salaryMin", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      salaryMin: 7000000,
      salaryMax: 8000000,
    });
    expect(res.success).toBe(true);
  });

  it("validates when salaryMax equals salaryMin", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      salaryMin: 8000000,
      salaryMax: 8000000,
    });
    expect(res.success).toBe(true);
  });

  it("fails when salaryMax is less than salaryMin", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      salaryMin: 9000000,
      salaryMax: 8000000,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path.includes("salaryMax"));
      expect(issue?.message).toContain("Gaji maksimum harus lebih besar");
    }
  });

  it("validates when only salaryMin is provided", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      salaryMin: 7000000,
      salaryMax: null,
    });
    expect(res.success).toBe(true);
  });

  it("validates when only salaryMax is provided", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      salaryMin: null,
      salaryMax: 10000000,
    });
    expect(res.success).toBe(true);
  });

  it("fails when salary is negative", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      salaryMin: -500000,
    });
    expect(res.success).toBe(false);
  });
});

describe("applicationFormSchema - URL validation", () => {
  it("validates a valid https URL for jobUrl", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      jobUrl: "https://jobstreet.co.id/id/job/123456",
    });
    expect(res.success).toBe(true);
  });

  it("validates a valid http URL for jobUrl", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      jobUrl: "http://karir.bca.co.id/vacancies/789",
    });
    expect(res.success).toBe(true);
  });

  it("fails when jobUrl is not a valid URL", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      jobUrl: "not-a-valid-url",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path.includes("jobUrl"));
      expect(issue?.message).toContain("URL");
    }
  });

  it("allows null, undefined, or empty string for jobUrl", () => {
    const withNull = applicationFormSchema.safeParse({
      ...baseApplication,
      jobUrl: null,
    });
    expect(withNull.success).toBe(true);

    const withUndefined = applicationFormSchema.safeParse({
      ...baseApplication,
      jobUrl: undefined,
    });
    expect(withUndefined.success).toBe(true);

    const withEmpty = applicationFormSchema.safeParse({
      ...baseApplication,
      jobUrl: "",
    });
    expect(withEmpty.success).toBe(true);
  });
});

describe("applicationFormSchema - Tanggal masa depan validation", () => {
  it("validates a past date for appliedAt", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      appliedAt: "2026-10-02",
    });
    expect(res.success).toBe(true);
  });

  it("validates today's date for appliedAt", () => {
    const today = new Date().toISOString().slice(0, 10);
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      appliedAt: today,
    });
    expect(res.success).toBe(true);
  });

  it("fails when appliedAt is in the future", () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const futureDateStr = future.toISOString().slice(0, 10);

    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      appliedAt: futureDateStr,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path.includes("appliedAt"));
      expect(issue?.message).toContain("masa depan");
    }
  });

  it("allows null, undefined, or empty string for appliedAt (draft)", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      appliedAt: null,
      status: "draft",
    });
    expect(res.success).toBe(true);
  });
});

describe("applicationFormSchema - Status validation", () => {
  it("validates all supported application statuses", () => {
    const validStatuses = [
      "draft",
      "applied",
      "screening",
      "test",
      "interview",
      "offer",
      "accepted",
      "rejected",
      "withdrawn",
      "closed",
    ] as const;

    for (const status of validStatuses) {
      const res = applicationFormSchema.safeParse({
        ...baseApplication,
        status,
      });
      expect(res.success).toBe(true);
    }
  });

  it("fails when status is invalid", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      // @ts-expect-error Testing invalid runtime status
      status: "sedang_review",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path.includes("status"));
      expect(issue?.message).toContain("Status tidak valid");
    }
  });
});

describe("applicationFormSchema - Required fields", () => {
  it("fails when company is empty", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      company: "",
    });
    expect(res.success).toBe(false);
  });

  it("fails when platform is empty", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      platform: "   ",
    });
    expect(res.success).toBe(false);
  });

  it("allows position to be null or empty", () => {
    const res = applicationFormSchema.safeParse({
      ...baseApplication,
      position: null,
    });
    expect(res.success).toBe(true);
  });
});
