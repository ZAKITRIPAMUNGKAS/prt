"use client";

import { useState, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ProfileCard from "@/modules/home/ui/components/profile-card";
import LatestTravelCard from "@/modules/home/ui/components/latest-travel-card";
import {
  CitiesView,
  CitiesViewLoadingStatus,
} from "@/modules/home/ui/views/cities-view";
import { LatestProjectsCard } from "@/modules/projects/ui/components/latest-projects-card";
import {
  ProjectsHomeView,
  ProjectsHomeLoadingStatus,
} from "@/modules/projects/ui/views/projects-home-view";
import { StatusNowCard } from "./status-now-card";
import { FpvShowreelCard } from "./fpv-showreel-card";
import Footer from "@/components/footer";

type TabMode = "all" | "tech" | "creative";

export const HomeSections = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("all");

  return (
    <div className="w-full mt-3 lg:mt-0 lg:w-1/2 space-y-3 pb-3">
      {/* PROFILE CARD */}
      <ProfileCard />

      {/* FILTER TABS */}
      <div className="flex items-center justify-between p-1.5 bg-muted rounded-xl w-full">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs font-normal"
                : "text-text-muted hover:text-foreground font-light"
            }`}
          >
            Semua
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tech")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
              activeTab === "tech"
                ? "bg-background text-foreground shadow-xs font-normal"
                : "text-text-muted hover:text-foreground font-light"
            }`}
          >
            <span>💻</span>
            <span>Engineering</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("creative")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
              activeTab === "creative"
                ? "bg-background text-foreground shadow-xs font-normal"
                : "text-text-muted hover:text-foreground font-light"
            }`}
          >
            <span>🛸</span>
            <span>Visual & FPV</span>
          </button>
        </div>

        <span className="hidden sm:inline-block pr-2 text-[11px] text-text-muted font-mono">
          {activeTab === "all" && "Portfolio Mode"}
          {activeTab === "tech" && "Recruiter / Dev View"}
          {activeTab === "creative" && "Client / Reel View"}
        </span>
      </div>

      {/* CONDITIONAL SECTIONS */}
      {/* 1. Status Now Card: Shown on 'all' and 'tech' */}
      {(activeTab === "all" || activeTab === "tech") && <StatusNowCard />}

      {/* 2. FPV Showreel Card: Shown on 'all' and 'creative' */}
      {(activeTab === "all" || activeTab === "creative") && <FpvShowreelCard />}

      {/* 3. Projects Section: Shown on 'all' and 'tech' */}
      {(activeTab === "all" || activeTab === "tech") && (
        <>
          <LatestProjectsCard />
          <Suspense fallback={<ProjectsHomeLoadingStatus />}>
            <ErrorBoundary fallback={<p>Gagal memuat proyek</p>}>
              <ProjectsHomeView />
            </ErrorBoundary>
          </Suspense>
        </>
      )}

      {/* 4. Travel & Photos Section: Shown on 'all' and 'creative' */}
      {(activeTab === "all" || activeTab === "creative") && (
        <>
          <LatestTravelCard />
          <Suspense fallback={<CitiesViewLoadingStatus />}>
            <ErrorBoundary fallback={<p>Gagal memuat foto kota</p>}>
              <CitiesView />
            </ErrorBoundary>
          </Suspense>
        </>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default HomeSections;
