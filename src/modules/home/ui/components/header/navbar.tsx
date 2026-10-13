import Logo from "./logo";
import FlipLink from "@/components/flip-link";
import { ThemeSwitch } from "@/components/theme-toggle";

const Navbar = () => {
  return (
    <nav>
      <div className="flex items-center gap-5 pb-3 px-4 relative">
        <Logo />
        <div className="hidden lg:flex gap-4">
          <FlipLink href="/travel">Perjalanan</FlipLink>
          <FlipLink href="/projects">Proyek</FlipLink>
          <FlipLink href="/discover">Jelajah</FlipLink>
          <FlipLink href="/blog">Blog</FlipLink>
          <FlipLink href="/about">Tentang</FlipLink>
        </div>
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;
