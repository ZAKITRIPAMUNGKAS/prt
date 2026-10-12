import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, { message: "Judul wajib diisi" }),
  slug: z
    .string()
    .trim()
    .min(1, { message: "Slug wajib diisi" })
    .regex(/^[\p{L}\p{N}_-]+$/u, {
      message: "Gunakan huruf, angka, tanda hubung, atau garis bawah tanpa spasi",
    }),
  summary: z.string().trim().min(1, { message: "Ringkasan wajib diisi" }),
  role: z.string().trim().min(1, { message: "Peran wajib diisi" }),
  stack: z.array(z.string()),
  year: z.string().trim().min(1, { message: "Tahun wajib diisi" }),
  duration: z.string().trim().min(1, { message: "Durasi wajib diisi" }),
  coverKey: z.string().trim().min(1, { message: "Cover proyek wajib diisi" }),
  repoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  body: z.string().min(1, { message: "Isi studi kasus wajib diisi" }),
  featured: z.boolean(),
  order: z.number().int(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
