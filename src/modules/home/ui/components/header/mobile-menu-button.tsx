"use client";

import React, { useState } from "react";
import MobileMenu from "./mobile-menu";

const MobileMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-3 z-50 bg-background/85 dark:bg-background/80 backdrop-blur-md rounded-full border border-border/40 shadow-xs lg:hidden cursor-pointer select-none px-4 py-2 flex items-center justify-center transition-colors hover:bg-muted"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
        aria-label="Buka menu navigasi"
      >
        <span className="text-sm font-medium">Menu</span>
      </button>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MobileMenuButton;
