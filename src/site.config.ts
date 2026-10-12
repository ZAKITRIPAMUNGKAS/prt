/**
 * ============================================================================
 * SITE CONFIGURATION
 * ============================================================================
 * This is the ONLY file you need to edit to customize the site for your own use.
 * All branding, personal info, social links, and site metadata are defined here.
 *
 * After editing this file, restart the dev server to see changes.
 * ============================================================================
 */

import type { ContactCardTitle } from "@/components/contact-card";

export const siteConfig = {
  /** Site name used in metadata, logo, and branding */
  name: "Tepe",

  /** Tagline shown alongside name (e.g. "Photo", "Photography") */
  tagline: "Studio",

  /** Your role/title shown in profile cards and footer */
  role: "Developer & Visual Maker",

  /** Short bio shown on the home page profile card */
  bio: "Saya Zaki — developer web lulusan Teknik Informatika UMS, juga fotografer, pilot FPV, dan pembuat motion. Saya membangun sistem yang jelas dan merekam cerita lewat gambar.",

  /** Avatar image path (place your avatar in /public/avatar.jpg) */
  avatar: "/avatar.jpg",

  /** Initials used as avatar fallback */
  initials: "ZT",

  /** Site metadata for SEO */
  metadata: {
    title: {
      template: "%s - Tepe",
      default: "Tepe — Zaki Tri Pamungkas",
    },
    description: "Portofolio Zaki Tri Pamungkas: web development, fotografi, FPV, dan motion.",
  },

  /** Social links shown in profile card and footer */
  socialLinks: [
    {
      title: "Instagram",
      href: "https://instagram.com/[USERNAME_INSTAGRAM]",
    },
    {
      title: "GitHub",
      href: "https://github.com/ZAKITRIPAMUNGKAS",
    },
    {
      title: "LinkedIn",
      href: "https://www.linkedin.com/in/[USERNAME_LINKEDIN]",
    },
    {
      title: "Contact me",
      href: "mailto:[EMAIL_KAMU]",
      /** If true, this link gets the primary button style */
      primary: true,
    },
  ] as { title: ContactCardTitle; href: string; primary?: boolean }[],

  /** Footer attribution */
  footer: {
    designCredit: {
      name: "Pawel Gola",
      href: "https://templates.gola.io/template/hanssen",
    },
    poweredBy: {
      name: "ECarry",
      href: "https://github.com/ecarry",
    },
  },

  /**
   * Mapbox custom style URLs (optional).
   * If not set, Mapbox default styles will be used.
   * Create your own at https://studio.mapbox.com/
   */
  mapbox: {
    lightStyle: "mapbox://styles/ecarry/cldmhu6tr000001n33ujbxf7j",
    darkStyle: "mapbox://styles/ecarry/clp8hcmd300km01qx78rt0xaw",
  },

  /**
   * Image loader configuration.
   * Set to "cloudflare" to use the Cloudflare custom image loader,
   * or "default" to use Next.js built-in image optimization.
   */
  imageLoader: "default" as "cloudflare" | "default",

  /**
   * Gear / equipment shown on the About page.
   * Each item has a brand and model name.
   */
  gear: [
    { brand: "SONY", model: "Alpha 6400" },
    { brand: "DJI", model: "Mini 4 Pro" },
    { brand: "BETAFPV", model: "Pavo 20 Pro (DJI O4)" },
    { brand: "iFlight", model: "Nazgul Evoque F5X" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
