import MobileMenuButton from "./mobile-menu-button";
import Navbar from "./navbar";

const Header = () => {
  return (
    <>
      <header
        className="fixed left-3 z-50 bg-background/85 dark:bg-background/80 backdrop-blur-md rounded-full border border-border/40 shadow-xs"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <Navbar />
      </header>

      <MobileMenuButton />
    </>
  );
};

export default Header;
