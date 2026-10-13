import { MarqueeCard } from "./marquee-card";
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiTrpc,
  SiReactquery,
  SiShadcnui,
  SiAdobelightroomclassic,
  SiVercel,
  SiCloudflare,
  SiDrizzle,
} from "react-icons/si";

const technologies = [
  {
    icon: SiReact,
    name: "React",
  },
  {
    icon: SiNextdotjs,
    name: "Next.js",
  },
  {
    icon: SiTailwindcss,
    name: "Tailwind CSS",
  },
  {
    icon: SiDrizzle,
    name: "Drizzle ORM",
  },
  {
    icon: SiTypescript,
    name: "TypeScript",
  },
  {
    icon: SiTrpc,
    name: "tRPC",
  },
  {
    icon: SiReactquery,
    name: "React Query",
  },
  {
    icon: SiShadcnui,
    name: "Shadcn UI",
  },
  {
    icon: SiVercel,
    name: "Vercel",
  },
  {
    icon: SiCloudflare,
    name: "Cloudflare",
  },
  {
    icon: SiAdobelightroomclassic,
    name: "Lightroom Classic",
  },
];

const TechMarquee = () => {
  return (
    <div className="bg-muted flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 lg:gap-12 p-5 sm:p-8 rounded-xl overflow-hidden">
      <h2 className="text-base sm:text-lg font-light shrink-0">Built with</h2>

      <div className="relative w-full flex-1 overflow-hidden">
        <MarqueeCard pauseOnHover className="[--duration:30s]">
          {technologies.map((tech) => (
            <div key={tech.name} className="flex items-center gap-4">
              <tech.icon className="size-8" />
              <span className="select-none">{tech.name}</span>
            </div>
          ))}
        </MarqueeCard>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-muted"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-muted"></div>
      </div>
    </div>
  );
};

export default TechMarquee;
