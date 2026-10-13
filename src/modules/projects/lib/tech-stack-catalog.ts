import React from "react";
import { IconCode } from "@tabler/icons-react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiLaravel,
  SiPhp,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiGit,
  SiGithub,
  SiVercel,
  SiSupabase,
  SiFirebase,
  SiFlutter,
  SiDart,
  SiVuedotjs,
  SiGo,
  SiRust,
  SiCplusplus,
  SiGraphql,
  SiPrisma,
  SiDrizzle,
  SiNginx,
  SiAmazonwebservices,
  SiLinux,
  SiBun,
  SiVite,
  SiTrpc,
  SiNestjs,
  SiFastapi,
  SiExpress,
  SiDjango,
  SiFlask,
  SiSvelte,
  SiAngular,
  SiAstro,
  SiTurborepo,
  SiExpo,
  SiKotlin,
  SiSwift,
  SiHtml5,
  SiCss3,
  SiSass,
  SiFigma,
  SiInertia,
  SiLivewire,
  SiFilament,
  SiAlpinedotjs,
  SiBootstrap,
  SiKubernetes,
  SiCloudflare,
  SiRabbitmq,
  SiApachekafka,
  SiMapbox,
  SiGooglecloud,
  SiRadixui,
  SiShadcnui,
} from "react-icons/si";

export interface TechItem {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps & Cloud" | "Mobile" | "Tools & Other";
  icon: React.ComponentType<{ className?: string }>;
}

export const POPULAR_TECHS: TechItem[] = [
  // Frontend
  { name: "Next.js", category: "Frontend", icon: SiNextdotjs },
  { name: "React", category: "Frontend", icon: SiReact },
  { name: "Vue.js", category: "Frontend", icon: SiVuedotjs },
  { name: "Svelte", category: "Frontend", icon: SiSvelte },
  { name: "Angular", category: "Frontend", icon: SiAngular },
  { name: "Astro", category: "Frontend", icon: SiAstro },
  { name: "TypeScript", category: "Frontend", icon: SiTypescript },
  { name: "JavaScript", category: "Frontend", icon: SiJavascript },
  { name: "Tailwind CSS", category: "Frontend", icon: SiTailwindcss },
  { name: "Shadcn UI", category: "Frontend", icon: SiShadcnui },
  { name: "Radix UI", category: "Frontend", icon: SiRadixui },
  { name: "Bootstrap", category: "Frontend", icon: SiBootstrap },
  { name: "HTML5", category: "Frontend", icon: SiHtml5 },
  { name: "CSS3", category: "Frontend", icon: SiCss3 },
  { name: "Sass", category: "Frontend", icon: SiSass },
  { name: "Alpine.js", category: "Frontend", icon: SiAlpinedotjs },

  // Backend
  { name: "Laravel", category: "Backend", icon: SiLaravel },
  { name: "Livewire", category: "Backend", icon: SiLivewire },
  { name: "Inertia.js", category: "Backend", icon: SiInertia },
  { name: "Filament", category: "Backend", icon: SiFilament },
  { name: "PHP", category: "Backend", icon: SiPhp },
  { name: "Node.js", category: "Backend", icon: SiNodedotjs },
  { name: "Express", category: "Backend", icon: SiExpress },
  { name: "NestJS", category: "Backend", icon: SiNestjs },
  { name: "tRPC", category: "Backend", icon: SiTrpc },
  { name: "Python", category: "Backend", icon: SiPython },
  { name: "FastAPI", category: "Backend", icon: SiFastapi },
  { name: "Django", category: "Backend", icon: SiDjango },
  { name: "Flask", category: "Backend", icon: SiFlask },
  { name: "Go", category: "Backend", icon: SiGo },
  { name: "Rust", category: "Backend", icon: SiRust },
  { name: "C++", category: "Backend", icon: SiCplusplus },
  { name: "GraphQL", category: "Backend", icon: SiGraphql },

  // Database & ORM
  { name: "PostgreSQL", category: "Database", icon: SiPostgresql },
  { name: "MySQL", category: "Database", icon: SiMysql },
  { name: "MongoDB", category: "Database", icon: SiMongodb },
  { name: "Redis", category: "Database", icon: SiRedis },
  { name: "Drizzle ORM", category: "Database", icon: SiDrizzle },
  { name: "Prisma", category: "Database", icon: SiPrisma },
  { name: "Supabase", category: "Database", icon: SiSupabase },
  { name: "Firebase", category: "Database", icon: SiFirebase },

  // Mobile
  { name: "Flutter", category: "Mobile", icon: SiFlutter },
  { name: "Dart", category: "Mobile", icon: SiDart },
  { name: "React Native", category: "Mobile", icon: SiReact },
  { name: "Expo", category: "Mobile", icon: SiExpo },
  { name: "Kotlin", category: "Mobile", icon: SiKotlin },
  { name: "Swift", category: "Mobile", icon: SiSwift },

  // DevOps & Cloud
  { name: "Docker", category: "DevOps & Cloud", icon: SiDocker },
  { name: "Kubernetes", category: "DevOps & Cloud", icon: SiKubernetes },
  { name: "Vercel", category: "DevOps & Cloud", icon: SiVercel },
  { name: "AWS", category: "DevOps & Cloud", icon: SiAmazonwebservices },
  { name: "Google Cloud", category: "DevOps & Cloud", icon: SiGooglecloud },
  { name: "Cloudflare", category: "DevOps & Cloud", icon: SiCloudflare },
  { name: "Nginx", category: "DevOps & Cloud", icon: SiNginx },
  { name: "Linux", category: "DevOps & Cloud", icon: SiLinux },
  { name: "RabbitMQ", category: "DevOps & Cloud", icon: SiRabbitmq },
  { name: "Kafka", category: "DevOps & Cloud", icon: SiApachekafka },

  // Tools & Other
  { name: "Git", category: "Tools & Other", icon: SiGit },
  { name: "GitHub", category: "Tools & Other", icon: SiGithub },
  { name: "Bun", category: "Tools & Other", icon: SiBun },
  { name: "Vite", category: "Tools & Other", icon: SiVite },
  { name: "Turborepo", category: "Tools & Other", icon: SiTurborepo },
  { name: "Mapbox", category: "Tools & Other", icon: SiMapbox },
  { name: "Figma", category: "Tools & Other", icon: SiFigma },
];

const NORMALIZED_MAP = new Map<string, TechItem>();
for (const item of POPULAR_TECHS) {
  NORMALIZED_MAP.set(item.name.toLowerCase().replace(/[\s\.\-_]/g, ""), item);
}

/**
 * Returns the matching icon component for a tech stack name (case-insensitive & fuzzy matching)
 */
export function getTechIcon(name: string): React.ComponentType<{ className?: string }> {
  const key = name.toLowerCase().replace(/[\s\.\-_]/g, "");
  const direct = NORMALIZED_MAP.get(key);
  if (direct) return direct.icon;

  // Partial search
  for (const item of POPULAR_TECHS) {
    const itemKey = item.name.toLowerCase().replace(/[\s\.\-_]/g, "");
    if (key.includes(itemKey) || itemKey.includes(key)) {
      return item.icon;
    }
  }

  return IconCode;
}
