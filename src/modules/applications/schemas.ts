import { z } from "zod";
import { APPLICATION_STATUSES } from "./types";

export const optionalUrlSchema = z
  .string()
  .trim()
  .nullish()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL lowongan tidak valid" }
  )
  .transform((val) => (val && val.length > 0 ? val : null));

export const dateNotFutureSchema = z
  .string()
  .trim()
  .nullish()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      const parsed = new Date(`${val}T00:00:00`);
      if (isNaN(parsed.getTime())) return false;
      const now = new Date();
      const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
      return parsed <= endOfToday;
    },
    { message: "Tanggal lamar tidak boleh di masa depan" }
  )
  .transform((val) => (val && val.length > 0 ? val : null));

export const optionalDateStringSchema = z
  .string()
  .trim()
  .nullish()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      const parsed = new Date(`${val}T00:00:00`);
      return !isNaN(parsed.getTime());
    },
    { message: "Format tanggal tidak valid" }
  )
  .transform((val) => (val && val.length > 0 ? val : null));

export const applicationFormSchema = z
  .object({
    company: z.string().trim().min(1, { message: "Nama perusahaan wajib diisi" }),
    position: z
      .string()
      .trim()
      .nullish()
      .transform((val) => (val && val.length > 0 ? val : null)),
    platform: z.string().trim().min(1, { message: "Platform lowongan wajib diisi" }),
    jobUrl: optionalUrlSchema,
    status: z.enum(APPLICATION_STATUSES, {
      message: "Status tidak valid",
    }),
    appliedAt: dateNotFutureSchema,
    salaryMin: z
      .number()
      .int({ message: "Gaji minimum harus bilangan bulat" })
      .nonnegative({ message: "Gaji minimum tidak boleh negatif" })
      .nullish(),
    salaryMax: z
      .number()
      .int({ message: "Gaji maksimum harus bilangan bulat" })
      .nonnegative({ message: "Gaji maksimum tidak boleh negatif" })
      .nullish(),
    expectedSalary: z
      .number()
      .int({ message: "Ekspektasi gaji harus bilangan bulat" })
      .nonnegative({ message: "Ekspektasi gaji tidak boleh negatif" })
      .nullish(),
    employmentType: z
      .string()
      .trim()
      .nullish()
      .transform((val) => (val && val.length > 0 ? val : null)),
    location: z
      .string()
      .trim()
      .nullish()
      .transform((val) => (val && val.length > 0 ? val : null)),
    nextStep: z
      .string()
      .trim()
      .nullish()
      .transform((val) => (val && val.length > 0 ? val : null)),
    nextStepAt: optionalDateStringSchema,
    notes: z
      .string()
      .trim()
      .nullish()
      .transform((val) => (val && val.length > 0 ? val : null)),
  })
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: "Gaji maksimum harus lebih besar atau sama dengan gaji minimum",
      path: ["salaryMax"],
    }
  );

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

export const updateApplicationStatusSchema = z.object({
  id: z.string().uuid({ message: "ID tidak valid" }),
  status: z.enum(APPLICATION_STATUSES, {
    message: "Status tidak valid",
  }),
});

export const updateApplicationSchema = applicationFormSchema.and(
  z.object({
    id: z.string().uuid({ message: "ID tidak valid" }),
  })
);
