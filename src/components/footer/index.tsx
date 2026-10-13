import FooterNav from "./footer-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/site.config";

const Footer = () => {
  return (
    <footer className="flex flex-col items-start p-6 sm:p-10 lg:p-14 gap-8 lg:gap-12 rounded-xl font-light relative flex-1 bg-black text-white dark:bg-card dark:text-foreground dark:border border-border">
      {/* Brand & Author */}
      <div className="flex items-center gap-4 w-full">
        <Avatar className="size-12 sm:size-14 border border-white/20 dark:border-border shrink-0">
          <AvatarImage src={siteConfig.avatar} alt={siteConfig.name} />
          <AvatarFallback>{siteConfig.initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-white dark:text-foreground">{siteConfig.name}</h2>
          <p className="text-xs sm:text-sm text-white/70 dark:text-muted-foreground">{siteConfig.role}</p>
        </div>
      </div>

      <div className="w-full h-px bg-white/15 dark:bg-border" />

      {/* Nav Links Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        <FooterNav
          title="Halaman"
          links={[
            { title: "Beranda", href: "/" },
            { title: "Perjalanan", href: "/travel" },
            { title: "Proyek", href: "/projects" },
            { title: "Jelajah", href: "/discover" },
            { title: "Blog", href: "/blog" },
            { title: "Tentang", href: "/about" },
          ]}
        />
        <FooterNav
          title="CMS"
          links={[{ title: "Dashboard", href: "/dashboard" }]}
        />
        <FooterNav
          title="Utility"
          links={[{ title: "Screensaver", href: "/screensaver" }]}
        />
      </div>

      <div className="w-full h-px bg-white/15 dark:bg-border" />

      {/* Copyright */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-white/60 dark:text-muted-foreground">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p>Surakarta, Indonesia</p>
      </div>
    </footer>
  );
};

export default Footer;
