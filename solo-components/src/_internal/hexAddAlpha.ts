type HEX = `#${string}`;

export function hexAddAlpha(hex: HEX, alpha: number): HEX {
  if (alpha < 0 || alpha > 1) throw new Error(`Alpha must be between 0 and 1, got ${alpha}`);
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}` as HEX;
}
