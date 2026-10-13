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
import { Check, ChevronDown, Sparkles } from "lucide-react";

export interface BrandOption {
  name: string;
  label: string;
  brandKey: string;
}

export const POPULAR_CAMERA_BRANDS: BrandOption[] = [
  { name: "Google", label: "Google (Pixel)", brandKey: "google" },
  { name: "Google (G)", label: "Google (G icon)", brandKey: "googleg" },
  { name: "Apple", label: "Apple (iPhone)", brandKey: "apple" },
  { name: "Sony", label: "Sony Alpha", brandKey: "sony" },
  { name: "Canon", label: "Canon EOS", brandKey: "canon" },
  { name: "Nikon", label: "Nikon Z / D", brandKey: "nikon" },
  { name: "Fujifilm", label: "Fujifilm X / GFX", brandKey: "fujifilm" },
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
    return v.includes(b) || b.includes(v);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-20"
          />
          {/* Live badge preview */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-muted/60 dark:bg-muted/40 rounded border border-border pointer-events-none">
            <span className="text-[9px] font-medium text-muted-foreground uppercase">
              Icon
            </span>
            <div className="h-4 w-9 flex items-center justify-center">
              <BrandsLogo
                brand={value || ""}
                className="max-h-3.5 max-w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Dropdown to pick brand */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="shrink-0 gap-1.5 px-3 text-xs"
              title="Pilih brand & icon polaroid"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Pilih Icon</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="end">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Pilih Icon Kamera untuk Polaroid
            </div>
            <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto pt-1">
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
                      "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors hover:bg-accent text-left",
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
                    {active && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Quick selection chips for top brands */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
          Cepat:
        </span>
        {["Google", "Apple", "Sony", "Canon", "Nikon", "Fujifilm", "Leica"].map(
          (name) => {
            const isSelected =
              value.toLowerCase().replace(/[^a-z0-9]/g, "") ===
              name.toLowerCase().replace(/[^a-z0-9]/g, "");
            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange(name)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] transition-all shrink-0",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-medium"
                    : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border-border"
                )}
              >
                <span>{name}</span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
