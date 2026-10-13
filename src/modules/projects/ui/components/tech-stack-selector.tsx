"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  POPULAR_TECHS,
  getTechIcon,
  TechItem,
} from "../../lib/tech-stack-catalog";

interface TechStackSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function TechStackSelector({
  value = [],
  onChange,
  disabled = false,
}: TechStackSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSelect = (techName: string) => {
    if (value.includes(techName)) {
      onChange(value.filter((item) => item !== techName));
    } else {
      onChange([...value, techName]);
    }
  };

  const handleRemove = (techName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((item) => item !== techName));
  };

  const handleAddCustom = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    if (!value.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...value, trimmed]);
    }
    setSearchValue("");
  };

  // Group popular techs by category
  const categories = React.useMemo(() => {
    const groups: Record<string, TechItem[]> = {};
    for (const item of POPULAR_TECHS) {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    }
    return groups;
  }, []);

  const hasExactMatch = POPULAR_TECHS.some(
    (t) => t.name.toLowerCase() === searchValue.trim().toLowerCase()
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Selected Tech Badges with Icons */}
      <div className="flex flex-wrap gap-2 min-h-9 p-2 rounded-lg border bg-background/50 items-center">
        {value.length === 0 ? (
          <span className="text-sm text-muted-foreground px-1">
            Belum ada tech stack yang dipilih. Klik tombol di bawah untuk memilih dari daftar atau ketik teknologi baru.
          </span>
        ) : (
          value.map((tech) => {
            const Icon = getTechIcon(tech);
            return (
              <Badge
                key={tech}
                variant="secondary"
                className="gap-1.5 pl-2 pr-1.5 py-1 text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                <Icon className="size-3.5 shrink-0" />
                <span>{tech}</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => handleRemove(tech, e)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                  <span className="sr-only">Hapus {tech}</span>
                </button>
              </Badge>
            );
          })
        )}
      </div>

      {/* Dropdown Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2 truncate">
              <Plus className="size-4 shrink-0 text-primary" />
              <span>Pilih atau cari tech stack (Next.js, Laravel, PostgreSQL, dll)...</span>
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Cari teknologi atau ketik nama baru..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList className="max-h-72">
              <CommandEmpty className="p-3 text-center text-sm">
                <p className="text-muted-foreground mb-2">Teknologi &quot;{searchValue}&quot; tidak ditemukan dalam daftar standar.</p>
                {searchValue.trim() && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddCustom}
                    className="gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    Tambah &quot;{searchValue.trim()}&quot; sebagai custom stack
                  </Button>
                )}
              </CommandEmpty>

              {searchValue.trim() && !hasExactMatch && (
                <CommandGroup heading="Kustom">
                  <CommandItem
                    value={searchValue}
                    onSelect={handleAddCustom}
                    className="gap-2 cursor-pointer font-medium text-primary"
                  >
                    <Plus className="size-4" />
                    <span>Tambahkan &quot;{searchValue.trim()}&quot;</span>
                  </CommandItem>
                </CommandGroup>
              )}

              {Object.entries(categories).map(([category, items]) => (
                <CommandGroup key={category} heading={category}>
                  {items.map((tech) => {
                    const isSelected = value.includes(tech.name);
                    const IconComponent = tech.icon;
                    return (
                      <CommandItem
                        key={tech.name}
                        value={tech.name}
                        onSelect={() => handleSelect(tech.name)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="size-4 shrink-0 text-foreground/80" />
                          <span>{tech.name}</span>
                        </div>
                        <Check
                          className={cn(
                            "size-4 text-primary transition-opacity",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
