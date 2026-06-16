/** Compact like count — 3300 → 3.3k, 56 → 56 */
export function formatLikeCount(count: number): string {
  if (count < 1000) {
    return String(count);
  }

  if (count < 10_000) {
    const thousands = count / 1000;
    const rounded = Math.round(thousands * 10) / 10;
    return Number.isInteger(rounded)
      ? `${rounded}k`
      : `${rounded.toFixed(1)}k`;
  }

  if (count < 1_000_000) {
    const thousands = Math.round(count / 100) / 10;
    return Number.isInteger(thousands)
      ? `${thousands}k`
      : `${thousands.toFixed(1)}k`;
  }

  const millions = Math.round(count / 100_000) / 10;
  return `${millions}M`;
}
