"use client";

import { useRouter } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import VectorTopLeftAnimation from "@/modules/home/ui/components/vector-top-left-animation";
import { getProjectCoverUrl } from "../../lib/utils";
import type { Project } from "@/db/schema";

interface Props {
  project: Project;
}

export const ProjectCard = ({ project }: Props) => {
  const router = useRouter();
  const coverUrl = getProjectCoverUrl(project.coverKey);

  return (
    <div
      className="w-full relative group cursor-pointer"
      onClick={() => router.push(`/projects/${project.slug}`)}
    >
      <AspectRatio
        ratio={0.75 / 1}
        className="overflow-hidden rounded-lg relative bg-muted"
      >
        <BlurImage
          src={coverUrl}
          alt={project.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 33vw"
          quality={70}
          className="object-cover lg:group-hover:blur-xs lg:transition-[filter] lg:duration-300 lg:ease-out"
          blurhash=""
        />
      </AspectRatio>

      <div className="absolute top-0 left-0 z-20">
        <VectorTopLeftAnimation title={project.title} />
      </div>
    </div>
  );
};

export default ProjectCard;
