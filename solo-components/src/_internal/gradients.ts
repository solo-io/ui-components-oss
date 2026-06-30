import { css } from '@emotion/react';
import type { CSSProperties } from 'react';

export type GradientBorderCutoutProps = {
  borderGradient: string;
  borderWidth?: CSSProperties['borderWidth'];
  borderRadius: CSSProperties['borderRadius'];
};

/**
 * Renders a gradient border as a masked cutout pseudo-element so it composites
 * cleanly over semi-transparent backgrounds without bleed-through.
 */
export function applyGradientBorderCutout({
  borderGradient,
  borderWidth = '1px',
  borderRadius
}: GradientBorderCutoutProps) {
  return css`
    position: relative;
    border-radius: ${borderRadius};
    &::after {
      content: '';
      pointer-events: none;
      position: absolute;
      inset: 0;
      border-radius: ${borderRadius};
      border: ${borderWidth} solid transparent;
      background: ${borderGradient.trim().replace(/;+$/, '')} border-box;
      mask:
        linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
      mask-composite: exclude;
    }
  `;
}
