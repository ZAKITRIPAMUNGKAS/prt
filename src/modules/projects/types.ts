import { Project } from "@/db/schema";
import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type { Project };

export type ProjectsGetMany = inferRouterOutputs<AppRouter>["projects"]["getMany"];
export type ProjectGetBySlug = inferRouterOutputs<AppRouter>["projects"]["getBySlug"];
