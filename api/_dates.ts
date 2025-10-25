export function ymd(d: Date) {
  return d.toISOString().slice(0,10);
}
export function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00");
  d.setUTCDate(d.getUTCDate() + days);
  return ymd(d);
}
