import FooterNav from "./footer-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/site.config";

const Footer = () => {
  return (
    <div className="flex flex-col items-center lg:items-start p-16 pb-12 gap-8 lg:gap-16 rounded-xl font-light relative flex-1 bg-primary text-white dark:text-black">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* AVATAR  */}
        <Avatar className="size-[60px]">
          <AvatarImage src={siteConfig.avatar} alt="avatar" sizes="60px" />
          <AvatarFallback>{siteConfig.initials}</AvatarFallback>
        </Avatar>

        {/* NAME  */}
        <div className="flex flex-col items-center lg:items-start gap-[2px]">
          <h1 className="text-2xl">{siteConfig.name}</h1>
          <p className="text-sm opacity-60">{siteConfig.role}</p>
        </div>
      </div>
      <div className="grid lg:w-full grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-14">
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

      {/* Copyright */}
      <div className="text-xs md:text-sm text-center md:text-left">
        <p className="opacity-60">
          © {new Date().getFullYear()} {siteConfig.name} — Zaki Tri Pamungkas. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
