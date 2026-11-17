import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PiArrowLeft, PiHouse, PiFolderSimple } from "react-icons/pi";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-block">
          <span className="text-8xl md:text-9xl font-bold tracking-tighter text-muted-foreground/20 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              Not Found
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-text-muted leading-relaxed">
            Halaman, artikel, atau proyek yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/" className="gap-2">
              <PiHouse size={16} />
              <span>Beranda</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/projects" className="gap-2">
              <PiFolderSimple size={16} />
              <span>Lihat Proyek</span>
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t border-border/40">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-foreground transition-colors"
          >
            <PiArrowLeft size={14} />
            <span>Kembali ke portfolio utama Zaki Tri Pamungkas</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
