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
