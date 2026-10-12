import Link from "next/link";
import WordRotate from "../word-rotate";
import { RiCameraLensFill } from "react-icons/ri";
import { siteConfig } from "@/site.config";

const Logo = () => {
  return (
    <Link href="/" className="flex gap-2 items-center group">
      <RiCameraLensFill
        size={18}
        className="transition-transform duration-300 group-hover:rotate-45"
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
