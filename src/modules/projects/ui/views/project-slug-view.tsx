"use client";

import BlurImage from "@/components/blur-image";
import Footer from "@/components/footer";
import VectorCombined from "@/components/vector-combined";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProjectCoverUrl, getProjectVideoUrl } from "../../lib/utils";
import { MarkdownContent } from "../components/markdown-content";
import { useRouter } from "next/navigation";
import { PiGithubLogo, PiGlobe, PiArrowLeft } from "react-icons/pi";
import { navigateWithViewTransition } from "@/lib/view-transition";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  slug: string;
}

export const ProjectSlugView = ({ slug }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getBySlug.queryOptions({ slug })
  );

  const coverUrl = getProjectCoverUrl(project.coverKey);
  const videoUrl = getProjectVideoUrl(project.previewVideoKey);
  const transitionName = `project-${project.slug}`;

  return (
    <div className="size-full">
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
        {/* LEFT CONTENT - Fixed on desktop */}
        <div className="w-full h-[50vh] md:h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
          <div
            className="w-full h-full relative rounded-xl overflow-hidden bg-muted"
            style={{ viewTransitionName: transitionName }}
          >
            {videoUrl ? (
              <video
                src={videoUrl}
                poster={coverUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover rounded-xl overflow-hidden bg-black"
              />
            ) : (
              <BlurImage
                src={coverUrl}
                alt={project.title}
                fill
                quality={80}
                blurhash=""
                sizes="75vw"
                className="object-cover rounded-xl overflow-hidden"
              />
            )}
            <div className="absolute right-0 bottom-0 pointer-events-none z-10">
              <VectorCombined
                title={project.year || "Project"}
                position="bottom-right"
              />
            </div>
          </div>
        </div>

        {/* Spacer for fixed left content */}
        <div className="hidden lg:block lg:w-1/2" />

        {/* RIGHT CONTENT - Scrollable */}
        <div className="w-full lg:w-1/2 space-y-3 pb-3">
          {/* BACK LINK */}
          <div className="px-2 pt-1">
            <Link
              href="/projects"
              onClick={(e) => {
                e.preventDefault();
                navigateWithViewTransition(() => router.push("/projects"));
              }}
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PiArrowLeft size={16} />
              <span>Semua Proyek</span>
            </Link>
          </div>

          {/* PROJECT HEADER CARD */}
          <div className="flex flex-col p-8 md:p-10 gap-6 bg-muted rounded-xl font-light">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight">
                {project.title}
              </h1>
              {project.featured && (
                <Badge variant="outline" className="text-xs">
                  Featured Project
                </Badge>
              )}
            </div>

            <p className="text-text-muted text-[15px] leading-relaxed">
              {project.summary}
            </p>

            {/* ACTION LINKS: Live URL & Repo */}
            {(project.liveUrl || project.repoUrl) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <PiGlobe size={18} />
                    <span>Lihat Demo</span>
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 hover:bg-background border rounded-lg text-sm font-medium transition-colors"
                  >
                    <PiGithubLogo size={18} />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* METADATA CARDS (ALA EXIF) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-muted rounded-xl flex flex-col justify-between gap-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">
                Peran
              </p>
              <p className="text-sm font-medium">{project.role || "-"}</p>
            </div>

            <div className="p-4 bg-muted rounded-xl flex flex-col justify-between gap-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">
                Tahun
              </p>
              <p className="text-sm font-medium">{project.year || "-"}</p>
            </div>

            <div className="p-4 bg-muted rounded-xl flex flex-col justify-between gap-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">
                Durasi
              </p>
              <p className="text-sm font-medium">{project.duration || "-"}</p>
            </div>

            <div className="p-4 bg-muted rounded-xl flex flex-col justify-between gap-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">
                Status
              </p>
              <p className="text-sm font-medium">Selesai</p>
            </div>
          </div>

          {/* TECH STACK CARD */}
          <div className="p-5 bg-muted rounded-xl flex flex-col gap-3">
            <p className="text-xs text-text-muted uppercase tracking-wider">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack?.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-background/60 border rounded-md text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CASE STUDY CONTENT CARD */}
          <div className="p-8 md:p-10 bg-muted rounded-xl flex flex-col gap-4">
            <div className="border-b pb-4 mb-2">
              <h2 className="text-xl font-medium tracking-tight">Studi Kasus</h2>
              <p className="text-xs text-text-muted mt-1">
                Latar belakang masalah, proses pengembangan, dan hasil proyek.
              </p>
            </div>

            <MarkdownContent content={project.body} />
          </div>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>
    </div>
  );
};
