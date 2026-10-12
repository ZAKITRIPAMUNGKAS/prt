import "dotenv/config";
import { db } from "../src/db";
import { projects } from "../src/db/schema";
import { eq } from "drizzle-orm";

const projectsData = [
  {
    title: "ARQAM App",
    slug: "arqam-app",
    summary:
      "Sistem penilaian peserta Baitul Arqam menggunakan metode AHP–SAW untuk seleksi dan evaluasi yang objektif. Proyek skripsi Teknik Informatika UMS.",
    role: "[ISI]",
    stack: ["Laravel", "PHP", "MySQL", "AHP-SAW", "Tailwind CSS"],
    year: "[ISI]",
    duration: "[ISI]",
    coverKey: "projects/arqam-app.jpg",
    repoUrl: null,
    liveUrl: null,
    body: `### Masalah
[ISI]

### Proses
[ISI]

### Hasil
[ISI]`,
    featured: true,
    order: 1,
  },
  {
    title: "SmartAbsensi",
    slug: "smartabsensi",
    summary:
      "Presensi sekolah berbasis web modern: scanning QR code real-time, pengajuan izin/sakit online, dan rekap kehadiran otomatis.",
    role: "[ISI]",
    stack: ["Laravel", "Vue.js", "MySQL", "QR Code", "Tailwind CSS"],
    year: "[ISI]",
    duration: "[ISI]",
    coverKey: "projects/smartabsensi.jpg",
    repoUrl: null,
    liveUrl: null,
    body: `### Masalah
[ISI]

### Proses
[ISI]

### Hasil
[ISI]`,
    featured: false,
    order: 2,
  },
  {
    title: "MedicIME",
    slug: "medicime",
    summary:
      "Sistem manajemen EMS komprehensif untuk komunitas roleplay FiveM: fitur clock in/out shift, leaderboard keaktifan, dan statistik Wrapped tahunan.",
    role: "[ISI]",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    year: "[ISI]",
    duration: "[ISI]",
    coverKey: "projects/medicime.jpg",
    repoUrl: null,
    liveUrl: null,
    body: `### Masalah
[ISI]

### Proses
[ISI]

### Hasil
[ISI]`,
    featured: false,
    order: 3,
  },
];

async function main() {
  console.log("Seeding projects...");

  for (const item of projectsData) {
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, item.slug));

    if (existing.length > 0) {
      const [updated] = await db
        .update(projects)
        .set({
          ...item,
          updatedAt: new Date(),
        })
        .where(eq(projects.slug, item.slug))
        .returning();
      console.log(`Updated project: ${updated.title} (${updated.slug})`);
    } else {
      const [created] = await db.insert(projects).values(item).returning();
      console.log(`Created project: ${created.title} (${created.slug})`);
    }
  }

  console.log("Projects seeded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding projects:", err);
    process.exit(1);
  });
