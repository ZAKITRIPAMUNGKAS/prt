import Link from "next/link";
import { PiArrowDown } from "react-icons/pi";

export const LatestBlogCard = () => {
  return (
    <div className="p-4 lg:p-5 bg-muted rounded-xl w-full flex justify-between items-center">
      <div className="flex items-center gap-2">
        <p className="text-sm font-light">Blog Terbaru</p>
        <PiArrowDown size={14} />
      </div>

      <div>
        <Link href="/blog" className="relative text-sm font-light group">
          Lihat Semua
          <span className="absolute -bottom-[2px] left-0 w-full h-px bg-black dark:bg-white transition-all duration-300 transform ease-in-out group-hover:w-1/3" />
        </Link>
      </div>
    </div>
  );
};

export default LatestBlogCard;
