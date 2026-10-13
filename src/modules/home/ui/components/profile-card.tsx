// External dependencies
import Link from "next/link";

// Internal dependencies - UI Components
import ContactCard from "../../../../components/contact-card";
import { PiArrowUpRight } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/site.config";
import GitHubActivity from "@/components/ui/github-activity";

const ProfileCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
      <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
        <div className="flex flex-col justify-between gap-6 p-6 lg:p-8 bg-muted rounded-xl font-light relative h-full">
          <Link
            href="/about"
            className="flex items-center justify-between group"
          >
            <div className="flex gap-4 items-center">
              {/* AVATAR  */}
              <Avatar className="size-[60px] shrink-0">
                <AvatarImage src={siteConfig.avatar} alt="Avatar" />
                <AvatarFallback>{siteConfig.initials}</AvatarFallback>
              </Avatar>

              {/* NAME  */}
              <div className="flex flex-col gap-0.5">
                <h1 className="text-lg font-medium group-hover:underline">
                  {siteConfig.name}
                </h1>
                <p className="text-sm text-text-muted">{siteConfig.role}</p>
              </div>
            </div>

            <div className="text-muted-foreground group-hover:text-foreground transition-colors p-2 rounded-lg group-hover:bg-muted-foreground/10">
              <PiArrowUpRight size={20} />
            </div>
          </Link>

          <div>
            <p className="text-text-muted text-[14px] leading-relaxed">
              {siteConfig.bio}
            </p>
          </div>

          <div className="w-full overflow-hidden pt-2">
            <GitHubActivity
              username="ZAKITRIPAMUNGKAS"
              variant="white"
              showMonths
            />
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col justify-between gap-3">
        {siteConfig.socialLinks.map((link) => (
          <ContactCard
            key={link.title}
            title={link.title}
            href={link.href}
            {...(link.primary && {
              className:
                "bg-primary text-white dark:text-black hover:bg-primary",
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
