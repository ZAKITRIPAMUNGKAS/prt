import "dotenv/config";
import { db } from "../src/db";
import { jobApplications } from "../src/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { ApplicationStatus } from "../src/modules/applications/types";

interface ApplicationSeedItem {
  company: string;
  position: string | null;
  platform: string;
  appliedAt: string | null;
  status: ApplicationStatus;
  salaryMin?: number | null;
  salaryMax?: number | null;
  expectedSalary?: number | null;
  employmentType?: string | null;
  location?: string | null;
  nextStep?: string | null;
  nextStepAt?: string | null;
  jobUrl?: string | null;
  notes?: string | null;
}

const applicationsData: ApplicationSeedItem[] = [
  {
    company: "Kompas Gramedia",
    position: "Software Engineer",
    platform: "Kalibrr",
    appliedAt: "2026-10-12",
    status: "applied",
    notes: null,
  },
  {
    company: "POSe (PCS Group)",
    position: "AI Integrated Full Stack Developer",
    platform: "Kalibrr",
    appliedAt: "2026-10-12",
    status: "applied",
    notes: "Lowongan sudah ditutup di Kalibrr, kemungkinan sedang seleksi",
  },
  {
    company: "Bank Negara Indonesia",
    position: "Officer Development Program (ODP) Retail Banking",
    platform: "Kalibrr",
    appliedAt: "2026-10-02",
    status: "applied",
    notes: null,
  },
  {
    company: "BCA",
    position: "IT Engineer",
    platform: "karir.bca.co.id",
    appliedAt: null,
    status: "draft",
    notes: "Formulir belum selesai",
  },
  {
    company: "Pertamina Group",
    position: null,
    platform: "Pertamina Candidate",
    appliedAt: null,
    status: "draft",
    notes: "Formulir belum selesai",
  },
  {
    company: "PT DNX Indonesia",
    position: "Junior IT Specialist",
    platform: "JobStreet",
    appliedAt: "2026-10-14",
    status: "applied",
    employmentType: "Kontrak",
    location: "Jakarta Selatan",
    notes: "Kontrak, Jakarta Selatan; syarat 3 tahun pengalaman",
  },
  {
    company: "Jual Emas Indonesia",
    position: "Full Stack Web Developer",
    platform: "JobStreet",
    appliedAt: "2026-10-14",
    status: "applied",
    salaryMin: 7000000,
    salaryMax: 8000000,
    expectedSalary: 8000000,
    employmentType: "Full time",
    location: "Jakarta Selatan",
    notes: "Full time, Jakarta Selatan; ekspektasi gaji diisi Rp 8.000.000",
  },
];

async function main() {
  console.log("Seeding job applications...");

  for (const item of applicationsData) {
    const condition = item.position
      ? and(
          eq(jobApplications.company, item.company),
          eq(jobApplications.position, item.position)
        )
      : and(
          eq(jobApplications.company, item.company),
          isNull(jobApplications.position)
        );

    const existing = await db
      .select()
      .from(jobApplications)
      .where(condition);

    if (existing.length > 0) {
      const [updated] = await db
        .update(jobApplications)
        .set({
          ...item,
          updatedAt: new Date(),
        })
        .where(eq(jobApplications.id, existing[0].id))
        .returning();
      console.log(
        `Updated application: ${updated.company} - ${updated.position ?? "Tanpa posisi"}`
      );
    } else {
      const [created] = await db
        .insert(jobApplications)
        .values({
          ...item,
          position: item.position ?? null,
        })
        .returning();
      console.log(
        `Created application: ${created.company} - ${created.position ?? "Tanpa posisi"}`
      );
    }
  }

  console.log("Job applications seeded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding applications:", err);
    process.exit(1);
  });
