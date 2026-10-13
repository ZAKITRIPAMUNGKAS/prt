"use client";

import * as React from "react";
import { BrandsLogo } from "@/components/brands-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

export interface BrandOption {
  name: string;
  label: string;
  brandKey: string;
}

export const POPULAR_CAMERA_BRANDS: BrandOption[] = [
  { name: "Google", label: "Google (Pixel)", brandKey: "google" },
  { name: "Google (G)", label: "Google (G Icon)", brandKey: "googleg" },
  { name: "Apple", label: "Apple (iPhone)", brandKey: "apple" },
  { name: "Sony", label: "Sony Alpha", brandKey: "sony" },
  { name: "Canon", label: "Canon EOS", brandKey: "canon" },
  { name: "Nikon", label: "Nikon", brandKey: "nikon" },
  { name: "Fujifilm", label: "Fujifilm", brandKey: "fujifilm" },
  { name: "Leica", label: "Leica", brandKey: "leica" },
  { name: "Hasselblad", label: "Hasselblad", brandKey: "hasselblad" },
  { name: "DJI", label: "DJI", brandKey: "dji" },
  { name: "Lumix", label: "Lumix / Panasonic", brandKey: "lumix" },
  { name: "Olympus", label: "Olympus / OM", brandKey: "olympus" },
  { name: "Pentax", label: "Pentax", brandKey: "pentax" },
  { name: "Ricoh", label: "Ricoh GR", brandKey: "ricoh" },
  { name: "Sigma", label: "Sigma", brandKey: "sigma" },
];

interface CameraBrandSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CameraBrandSelector({
  value = "",
  onChange,
  placeholder = "e.g., Google or Canon",
  className,
  disabled,
}: CameraBrandSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const isMatched = (brand: BrandOption) => {
    if (!value) return false;
    const v = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    const b = brand.brandKey.toLowerCase().replace(/[^a-z0-9]/g, "");
    return v === b || v.includes(b) || b.includes(v);
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Brand Icon preview on the left inside the input */}
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-5 pointer-events-none">
        <BrandsLogo
          brand={value || ""}
          className="max-h-4 max-w-full object-contain"
        />
      </div>

      {/* Main input */}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-11 pr-20"
      />

      {/* Clean dropdown trigger on the right inside the input */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="h-7 px-2 text-xs font-normal text-muted-foreground hover:text-foreground gap-1 rounded-sm"
              title="Pilih ikon brand kamera"
            >
              <span>Pilih</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="end">
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b pb-1.5 mb-1">
              Pilih Brand & Ikon Polaroid
            </div>
            <div className="grid grid-cols-1 gap-0.5 max-h-60 overflow-y-auto">
              {POPULAR_CAMERA_BRANDS.map((brand) => {
                const active = isMatched(brand);
                return (
                  <button
                    key={brand.brandKey}
                    type="button"
                    onClick={() => {
                      onChange(brand.name);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors hover:bg-accent text-left w-full",
                      active && "bg-accent/80 font-medium text-primary"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-5 bg-background border rounded px-1 flex items-center justify-center shrink-0">
                        <BrandsLogo
                          brand={brand.brandKey}
                          className="max-h-3.5 max-w-full object-contain"
                        />
                      </div>
                      <span className="truncate">{brand.label}</span>
                    </div>
                    {active && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="px-2 pt-2 text-[10px] text-muted-foreground border-t mt-1">
              Atau ketik langsung di kolom input untuk merk kustom.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
