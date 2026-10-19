import "dotenv/config";
import { db } from "../src/db";
import { jobApplications } from "../src/db/schema";
import { ApplicationStatus } from "../src/modules/applications/types";

interface ApplicationSeedItem {
  idIndex: number;
  company: string;
  position: string | null;
  platform: string;
  appliedAt: string | null;
  status: ApplicationStatus;
  location?: string | null;
  employmentType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  expectedSalary?: number | null;
  notes?: string | null;
}

const newApplicationsList: ApplicationSeedItem[] = [
  {
    idIndex: 1,
    position: "Web Developer",
    company: "Techarea",
    location: "Semarang (on-site)",
    platform: "Situs perusahaan (Indeed)",
    appliedAt: "2026-10-19",
    status: "applied",
    employmentType: "On-site",
    notes: "Melamar via situs perusahaan (Indeed)",
  },
  {
    idIndex: 2,
    position: "Junior PHP Programmer",
    company: "Lintas Media Danawa",
    location: "Jakarta",
    platform: "Indeed",
    appliedAt: "2026-10-19",
    status: "applied",
    notes: "Melamar via Indeed",
  },
  {
    idIndex: 3,
    position: "Full Stack Engineer (AI Assisted)",
    company: "PT Atask Teknologi Internasional",
    location: "Remote",
    platform: "Indeed",
    appliedAt: "2026-10-19",
    status: "applied",
    employmentType: "Remote",
    notes: "Melamar via Indeed",
  },
  {
    idIndex: 4,
    position: "AI Integrated Full Stack Developer",
    company: "POSe (PCS Group)",
    location: "BSD, Tangerang",
    platform: "Kalibrr",
    appliedAt: "2026-10-12",
    status: "applied",
    notes: "Lowongan sudah ditutup di Kalibrr, kemungkinan sedang seleksi",
  },
  {
    idIndex: 5,
    position: "Software Engineer",
    company: "Kompas Gramedia",
    location: null,
    platform: "Kalibrr",
    appliedAt: "2026-10-12",
    status: "applied",
    notes: null,
  },
  {
    idIndex: 6,
    position: "Junior IT Specialist",
    company: "PT DNX Indonesia",
    location: "Jakarta Selatan",
    platform: "JobStreet",
    appliedAt: "2026-10-14",
    status: "applied",
    employmentType: "Kontrak",
    notes: "Kontrak, Jakarta Selatan; syarat 3 tahun pengalaman",
  },
  {
    idIndex: 7,
    position: "Full Stack Web Developer",
    company: "Jual Emas Indonesia",
    location: "Jakarta Selatan",
    platform: "JobStreet",
    appliedAt: "2026-10-14",
    status: "applied",
    salaryMin: 7000000,
    salaryMax: 8000000,
    expectedSalary: 8000000,
    employmentType: "Full time",
    notes: "Full time, Jakarta Selatan; ekspektasi gaji diisi Rp 8.000.000",
  },
  {
    idIndex: 8,
    position: "IT Engineer",
    company: "BCA",
    location: null,
    platform: "karir.bca.co.id",
    appliedAt: "2026-10-14",
    status: "applied",
    notes: "Melamar via karir.bca.co.id",
  },
  {
    idIndex: 9,
    position: null,
    company: "Pertamina Group",
    location: null,
    platform: "Pertamina Candidate",
    appliedAt: "2026-10-12",
    status: "applied",
    notes: "Melamar via Pertamina Candidate",
  },
  {
    idIndex: 10,
    position: "ODP Retail Banking",
    company: "BNI",
    location: null,
    platform: "Kalibrr",
    appliedAt: "2026-10-02",
    status: "withdrawn",
    notes: "Lamaran ditarik",
  },
  {
    idIndex: 11,
    position: "Full-Stack Engineer",
    company: "Azura Labs",
    location: "Semarang",
    platform: "Glints",
    appliedAt: "2026-10-19",
    status: "applied",
    salaryMin: 4000000,
    salaryMax: 6000000,
    notes: "Status: Baru (Belum dilihat)",
  },
  {
    idIndex: 12,
    position: "Full Stack Developer - Laravel Specialist",
    company: "PT Afdan Rojabi Indonesia",
    location: "Kota Yogyakarta",
    platform: "Glints",
    appliedAt: "2026-10-19",
    status: "applied",
    notes: "Status: Baru (Belum dilihat)",
  },
  {
    idIndex: 13,
    position: "Programmer",
    company: "SAFFix.id",
    location: "Probolinggo",
    platform: "Glints",
    appliedAt: "2026-10-19",
    status: "applied",
    notes: "Status: Baru (Belum dilihat)",
  },
  {
    idIndex: 14,
    position: "Full Stack Developer",
    company: "PT Eintio Academic & Technology",
    location: "Salatiga",
    platform: "Glints",
    appliedAt: "2026-10-19",
    status: "applied",
    notes: "Status: Baru (Belum dilihat)",
  },
];

async function main() {
  console.log("Replacing job applications with the updated applications list...");

  // Delete all existing applications to cleanly align with the new list
  await db.delete(jobApplications);

  for (const item of newApplicationsList) {
    const [created] = await db
      .insert(jobApplications)
      .values({
        company: item.company,
        position: item.position,
        platform: item.platform,
        location: item.location,
        appliedAt: item.appliedAt,
        status: item.status,
        employmentType: item.employmentType,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        expectedSalary: item.expectedSalary,
        notes: item.notes,
      })
      .returning();

    console.log(
      `[#${item.idIndex}] Created: ${created.company} - ${created.position ?? "Tanpa posisi"} (${created.status})`
    );
  }

  console.log(`All ${newApplicationsList.length} job applications seeded successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding applications:", err);
    process.exit(1);
  });
