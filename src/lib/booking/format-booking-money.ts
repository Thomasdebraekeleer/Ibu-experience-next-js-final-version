export function formatBookingMoney(
  amount: number,
  currencyCode: string,
  localeTag: string
): string {
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatStayDayShort(ymd: string, localeTag: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat(localeTag, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
