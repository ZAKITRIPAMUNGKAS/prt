// External dependencies
import { type Metadata } from "next";

import Image from "next/image";
import Footer from "@/components/footer";
import AboutCard from "../../../modules/home/ui/components/about-card";
import { HireMeCard } from "@/modules/about/ui/components/hire-me-card";
import { CollaborationCard } from "@/modules/about/ui/components/collaboration-card";
import TechMarquee from "@/components/tech-marquee";
import CameraCard from "../../../modules/home/ui/components/camera-card";
import ProfileCard from "../../../modules/home/ui/components/profile-card";
import CardContainer from "@/components/card-container";
import VectorCombined from "@/components/vector-combined";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "About",
  description: "About page",
};

import { PageEntrance, StaggerContainer, StaggerItem } from "@/components/page-entrance";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <PageEntrance
        delay={0.1}
        className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3"
      >
        <div className="w-full h-full relative rounded-xl overflow-hidden bg-muted">
          <Image
            src="/fotoku.png"
            alt="Zaki Tri Pamungkas"
            fill
            priority
            quality={75}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover rounded-xl"
            style={{ objectPosition: "center 20%" }}
          />
          <div className="absolute right-0 bottom-0 z-10">
            <VectorCombined title="About" position="bottom-right" />
          </div>
        </div>
      </PageEntrance>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <StaggerContainer
        staggerDelay={0.06}
        className="w-full lg:w-1/2 space-y-3 pb-3"
      >
        {/* PROFILE CARD  */}
        <StaggerItem>
          <ProfileCard />
        </StaggerItem>

        {/* HIRE ME CARD */}
        <StaggerItem>
          <HireMeCard />
        </StaggerItem>

        {/* COLLABORATION CARD */}
        <StaggerItem>
          <CollaborationCard />
        </StaggerItem>

        {/* ABOUT CARD  */}
        <StaggerItem>
          <AboutCard />
        </StaggerItem>

        {/* TECH CARD  */}
        <StaggerItem>
          <TechMarquee />
        </StaggerItem>

        {/* CAMERA CARD  */}
        <StaggerItem>
          <CameraCard />
        </StaggerItem>

        {siteConfig.gear.map((item) => (
          <StaggerItem key={`${item.brand}-${item.model}`}>
            <CardContainer>
              <div className="flex items-center justify-between p-6">
                <h1 className="text-lg">{item.brand}</h1>
                <p className="text-sm">{item.model}</p>
              </div>
            </CardContainer>
          </StaggerItem>
        ))}

        <StaggerItem>
          <Footer />
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
};

export default AboutPage;
