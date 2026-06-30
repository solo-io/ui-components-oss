const spacing = {
  zero: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16
} as const;

type Spacing = typeof spacing;
type SpacingPx = { [K in keyof Spacing]: `${Spacing[K]}px` };

export const spacingPx = Object.fromEntries(
  Object.entries(spacing).map(([k, v]) => [k, `${v}px`])
) as SpacingPx;
