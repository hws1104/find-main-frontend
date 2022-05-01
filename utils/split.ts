export function buildPercentToUse(count: number, index?: number): number {
  return count === 3 && index === 0
    ? Number((100 / count + 0.01).toFixed(2))
    : Number((100 / count).toFixed(2));
}
