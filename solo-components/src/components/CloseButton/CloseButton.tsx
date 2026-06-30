import type { SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { dontForwardProps } from '../../_internal/utils';

// region Styles

const StyledCloseButton = styled('button', dontForwardProps('styleOverrides'))<{ styleOverrides?: SerializedStyles }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: inherit;
  opacity: 0.8;
  transition:
    background-color 0.05s ease,
    opacity 0.05s ease;

  &:hover {
    opacity: 1;
    /* Subtle wash derived from the button's own color, so it works on any background. */
    background-color: color-mix(in srgb, currentColor 14%, transparent);
  }

  &:active {
    background-color: color-mix(in srgb, currentColor 24%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #6844ff);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  svg {
    display: block;
  }

  ${props => props.styleOverrides}
`;

// region Component

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** X icon size in px. */
  size?: number;
  /** Emotion styles appended to the button. */
  styleOverrides?: SerializedStyles;
}

/**
 * A minimal "×" icon button (Lucide `X`). Inherits its color from context
 * (override via `style`/`styleOverrides`); hover/active washes derive from that
 * color, so it sits cleanly on any surface — alerts, drawers, modals, etc.
 */
export function CloseButton({
  size = 18,
  styleOverrides,
  type = 'button',
  'aria-label': ariaLabel = 'Close',
  ...props
}: CloseButtonProps) {
  return (
    <StyledCloseButton type={type} aria-label={ariaLabel} styleOverrides={styleOverrides} {...props}>
      <X size={size} />
    </StyledCloseButton>
  );
}
