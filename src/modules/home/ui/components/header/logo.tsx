import Link from "next/link";
import WordRotate from "../word-rotate";
import { PiSparkleFill } from "react-icons/pi";
import { siteConfig } from "@/site.config";

const Logo = () => {
  return (
    <Link href="/" className="flex gap-2 items-center group">
      <PiSparkleFill
        size={17}
        className="transition-transform duration-300 ease-out group-hover:rotate-45 group-hover:scale-110 shrink-0"
      />
      <WordRotate
        label={siteConfig.logoBrands.primary}
        label2={siteConfig.logoBrands.secondary}
        style="font-medium lowercase tracking-tight"
      />
    </Link>
  );
};

export default Logo;
