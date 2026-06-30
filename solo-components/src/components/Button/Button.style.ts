import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { soloColorTokens, resolveBareFg } from '../../_internal/palette';
import { UnstyledButton } from '../../_internal/unstyledButton';
import { dontForwardProps, type ElementOf } from '../../_internal/utils';
import { spacingPx } from '../../_internal/sizing';
import type { SoloMode } from '../../providers/SoloModeContext';
import { buttonVariants, type ButtonProps } from './Button';

type SizeType = ElementOf<(typeof buttonVariants)['sizes']>;

const sizeMap: Record<SizeType, { py: string; px: string; gap: string; height: string; fontSize: string }> = {
  sm: { py: '5px', px: '10px', gap: spacingPx.xs, height: '30px', fontSize: '13px' },
  md: { py: '8px', px: '14px', gap: spacingPx.sm, height: '36px', fontSize: '14px' }
};

export const StyledButton = styled(
  UnstyledButton,
  dontForwardProps(
    'uiTestId',
    'styleOverrides',
    'isSquareIconButton',
    'isCircleIconButton',
    'leftIcon',
    'rightIcon',
    'minWidth'
  )
)<ButtonProps>(props => {
  const { variant = 'solid', size, color = 'dark-purple', isSquareIconButton, isCircleIconButton } = props;
  const sizeData = sizeMap[size ?? 'md'];
  const c = soloColorTokens[color];
  // The active light/dark mode is published on the emotion theme by SoloContextProvider.
  const mode = (props.theme as { mode?: SoloMode }).mode ?? 'dark';
  const bareFg = resolveBareFg(c.bareFg, mode);
  const isIcon = isSquareIconButton || isCircleIconButton;

  return css`
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${sizeData.gap};
    height: ${sizeData.height};
    border: 1px solid transparent;
    border-radius: ${isCircleIconButton ? '999px' : '4px'};
    font: inherit;
    font-weight: 400;
    font-size: ${sizeData.fontSize};
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition:
      background-color 0.08s ease,
      border-color 0.08s ease,
      transform 0.08s ease;

    ${isIcon
      ? css`
          width: ${sizeData.height};
          padding: 0;
        `
      : css`
          min-width: ${props.minWidth ?? '96px'};
          padding: ${sizeData.py} ${sizeData.px};
        `}

    ${variant === 'bare'
      ? css`
          /* Outlined "secondary" button: dim fill with the accent as both outline
             and text, so the color/variant reads clearly (legible in both modes). */
          background-color: var(--color-bg-elevated, #1b1624);
          color: ${bareFg};
          border-color: ${bareFg};
          /* Hover/active tint the fill toward the button's own accent — active is a
             clearly deeper step than hover, plus a press shift. */
          &:not([aria-disabled='true']):hover {
            background-color: color-mix(in srgb, ${c.bg} 14%, var(--color-bg-elevated, #1b1624));
          }
          &:not([aria-disabled='true']):active {
            background-color: color-mix(in srgb, ${c.bg} 30%, var(--color-bg-elevated, #1b1624));
            transform: translateY(1px);
          }
        `
      : css`
          background-color: ${c.bg};
          color: ${c.fg};
          border-color: ${c.border ?? 'transparent'};
          /* Hover/active darken the fill (active darker than hover) in both modes. */
          &:not([aria-disabled='true']):hover {
            background-color: color-mix(in srgb, ${c.bg} 88%, #000);
          }
          &:not([aria-disabled='true']):active {
            background-color: color-mix(in srgb, ${c.bg} 76%, #000);
            transform: translateY(1px);
          }
        `}

    &:focus-visible {
      outline: 2px solid ${c.border ?? c.bg};
      outline-offset: 2px;
    }

    &[aria-disabled='true'] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* The only motion is the 1px press shift; color feedback stays. */
    @media (prefers-reduced-motion: reduce) {
      transition: none;
      &:active {
        transform: none;
      }
    }

    ${props.styleOverrides ? props.styleOverrides : ''}
  `;
});

// Alias so the namespace below can reference the original without shadowing.
const _StyledButton = StyledButton;

// Namespace form for consumers that prefer the grouped `SoloButtonStyles.X` API
// (e.g. when targeting these styled components as CSS selectors).
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SoloButtonStyles {
  export const StyledButton = _StyledButton;
}
