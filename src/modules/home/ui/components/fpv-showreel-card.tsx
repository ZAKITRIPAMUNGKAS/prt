"use client";

import { useState } from "react";
import Image from "next/image";
import VectorCombined from "@/components/vector-combined";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PiPlay, PiArrowsOutSimple, PiEye, PiEyeSlash } from "react-icons/pi";

export const FpvShowreelCard = () => {
  const [showOsd, setShowOsd] = useState(true);

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger asChild>
          <div className="block w-full relative rounded-xl overflow-hidden group cursor-pointer border border-border/40 select-none">
            <AspectRatio ratio={16 / 9} className="w-full relative">
              {/* High-res cinematic aerial wallpaper / visual */}
              <Image
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&q=80"
                alt="FPV Aerial Cinematography"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dark subtle vignette for FPV feeling */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

              {/* FPV OSD (On-Screen Display) telemetry overlay */}
              {showOsd && (
                <div className="absolute inset-0 p-4 font-mono text-[11px] text-white/80 pointer-events-none flex flex-col justify-between">
                  {/* Top row */}
                  <div className="flex justify-between items-center tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                      <span>REC [ 4K 60FPS ]</span>
                    </div>
                    <span>BAT 15.4V (4S) • 78%</span>
                  </div>

                  {/* Center Crosshair */}
                  <div className="self-center flex flex-col items-center gap-1 opacity-70">
                    <div className="w-6 h-px bg-white/60" />
                    <div className="h-4 w-px bg-white/60" />
                  </div>

                  {/* Bottom row */}
                  <div className="flex justify-between items-end tracking-wider">
                    <div className="flex flex-col gap-0.5">
                      <span>ALT: 48M • SPD: 72KM/H</span>
                      <span className="text-[10px] text-white/60">
                        O4 HD • 50Mbps • 16ms
                      </span>
                    </div>
                    <div className="text-right text-[10px] text-white/60 mb-6 mr-1">
                      <span>RIG: BETAFPV / NAZGUL</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hover Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-12 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground group-hover:scale-110 group-hover:bg-background transition-all shadow-lg">
                  <PiPlay size={20} className="ml-0.5" />
                </div>
              </div>

              {/* Controls bar on top right */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOsd(!showOsd);
                  }}
                  className="size-7 rounded-lg bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                  title={showOsd ? "Sembunyikan OSD" : "Tampilkan OSD"}
                >
                  {showOsd ? <PiEyeSlash size={14} /> : <PiEye size={14} />}
                </button>
                <div className="size-7 rounded-lg bg-black/60 backdrop-blur-sm text-white flex items-center justify-center">
                  <PiArrowsOutSimple size={14} />
                </div>
              </div>

              {/* Bottom Right Label using standard VectorCombined */}
              <div className="absolute right-0 bottom-0 pointer-events-none">
                <VectorCombined
                  title="FPV Aerial Reel"
                  position="bottom-right"
                />
              </div>
            </AspectRatio>
          </div>
        </DialogTrigger>

        {/* Modal Showcase */}
        <DialogContent className="max-w-4xl p-4 bg-background border rounded-2xl">
          <DialogTitle className="text-lg font-light flex items-center justify-between pb-2">
            <span>Showreel FPV & Aerial Cinematography</span>
            <span className="text-xs text-muted-foreground font-mono">
              Pilot: Tepe (Zaki Tri Pamungkas)
            </span>
          </DialogTitle>
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-black flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&q=80"
                alt="FPV Video Showcase"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center text-white">
                <p className="font-mono text-sm mb-2 text-emerald-400">
                  READY FOR PRODUCTION
                </p>
                <h3 className="text-2xl font-light mb-3">
                  Cinematic FPV, Fly-Through & Commercial Motion
                </h3>
                <p className="text-sm text-white/80 max-w-lg font-light leading-relaxed">
                  Menyediakan jasa pengambilan gambar udara jarak dekat (indoor cinewhoop) menggunakan BETAFPV Pavo 20 Pro dan penerbangan outdoor bertenaga tinggi dengan iFlight Nazgul Evoque F5X.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-light">
              <div className="p-3 bg-muted/60 rounded-xl">
                <p className="text-text-muted mb-1">Indoor Cinewhoop</p>
                <p className="font-medium">BETAFPV Pavo 20 Pro</p>
              </div>
              <div className="p-3 bg-muted/60 rounded-xl">
                <p className="text-text-muted mb-1">Outdoor 5-inch</p>
                <p className="font-medium">Nazgul Evoque F5X</p>
              </div>
              <div className="p-3 bg-muted/60 rounded-xl">
                <p className="text-text-muted mb-1">Stabilized Drone</p>
                <p className="font-medium">DJI Mini 4 Pro</p>
              </div>
              <div className="p-3 bg-muted/60 rounded-xl">
                <p className="text-text-muted mb-1">Transmission System</p>
                <p className="font-medium">DJI O4 HD Digital</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
