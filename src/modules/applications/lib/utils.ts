import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export function formatRupiah(amount: number | null | undefined): string {
  if (amount == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRupiahShort(amount: number | null | undefined): string {
  if (amount == null) return "-";
  if (amount >= 1_000_000_000) {
    const val = (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `Rp ${val} M`;
  }
  if (amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `Rp ${val} jt`;
  }
  if (amount >= 1_000) {
    const val = (amount / 1_000).toFixed(0);
    return `Rp ${val} rb`;
  }
  return `Rp ${amount}`;
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Draft";
  const date = new Date(`${dateStr}T00:00:00`);
  if (isNaN(date.getTime())) return "Draft";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = today.getTime() - target.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays > 1 && diffDays < 30) return `${diffDays} hari lalu`;
  if (diffDays >= 30 && diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan lalu`;
  }
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    return `${years} tahun lalu`;
  }
  return "Hari ini";
}

export function formatFullDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  const date = new Date(`${dateStr}T00:00:00`);
  if (isNaN(date.getTime())) return "-";
  return format(date, "EEEE, d MMMM yyyy", { locale: idLocale });
}
