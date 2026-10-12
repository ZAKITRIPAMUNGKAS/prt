"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PiPaperPlaneTilt, PiWhatsappLogo } from "react-icons/pi";

interface ProjectInquiryDialogProps {
  children?: React.ReactNode;
  defaultService?: "web" | "fpv" | "motion" | "photo";
}

const SERVICES = [
  { id: "web", label: "Web App & Sistem (gemala.dev)", emoji: "🌐" },
  { id: "fpv", label: "FPV Aerial Video (gemala.creative)", emoji: "🛸" },
  { id: "motion", label: "Remotion Motion Video", emoji: "🎬" },
  { id: "photo", label: "Fotografi & Dokumenter", emoji: "📷" },
] as const;

export const ProjectInquiryDialog = ({
  children,
  defaultService = "web",
}: ProjectInquiryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>(defaultService);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");

  const selectedServiceLabel =
    SERVICES.find((s) => s.id === selectedService)?.label ?? "Proyek";

  const buildMessage = () => {
    return [
      `Halo Zaki (Tepe), saya ingin konsultasi proyek:`,
      `• Layanan: ${selectedServiceLabel}`,
      name ? `• Nama/Perusahaan: ${name}` : null,
      contact ? `• Kontak Balik: ${contact}` : null,
      description ? `• Kebutuhan: ${description}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(
      `Inkuiri Proyek: ${selectedServiceLabel}${name ? ` - ${name}` : ""}`
    );
    const body = encodeURIComponent(buildMessage());
    window.open(
      `mailto:zakitripamungkas@gmail.com?subject=${subject}&body=${body}`,
      "_blank"
    );
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(buildMessage());
    // Direct link to WhatsApp web/mobile
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" className="w-full">
            Mulai Diskusi Proyek
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-6 bg-background border rounded-2xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-normal">
            Mulai Diskusi Proyek
          </DialogTitle>
          <DialogDescription className="text-sm font-light text-muted-foreground">
            Pilih layanan yang Anda butuhkan, ceritakan ringkas idenya, dan mari diskusikan solusinya.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* Pilih Layanan */}
          <div className="space-y-2">
            <Label className="text-xs text-text-muted font-light">
              Pilih Kategori Layanan
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICES.map((s) => {
                const isSelected = selectedService === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s.id)}
                    className={`text-left p-3 rounded-xl border text-xs font-light transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    <span>{s.emoji}</span>
                    <span className="line-clamp-1">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="inquiry-name" className="text-xs text-text-muted font-light">
                Nama / Perusahaan
              </Label>
              <Input
                id="inquiry-name"
                placeholder="Contoh: Budi (PT Maju Tech)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted/40 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inquiry-contact" className="text-xs text-text-muted font-light">
                Kontak Anda (WhatsApp / Email)
              </Label>
              <Input
                id="inquiry-contact"
                placeholder="email@example.com / 0812xxxx"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="bg-muted/40 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inquiry-desc" className="text-xs text-text-muted font-light">
                Ringkasan Kebutuhan & Ekspektasi
              </Label>
              <Textarea
                id="inquiry-desc"
                placeholder="Ceritakan fitur web yang diinginkan, konsep video FPV, atau timeline yang diharapkan..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-muted/40 text-sm resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSendWhatsApp}
              className="gap-2 rounded-xl text-xs font-light h-10 border-border"
            >
              <PiWhatsappLogo size={16} className="text-emerald-500" />
              Kirim WhatsApp
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={handleSendEmail}
              className="gap-2 rounded-xl text-xs font-light h-10"
            >
              <PiPaperPlaneTilt size={16} />
              Kirim Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
