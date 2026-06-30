import { css, type SerializedStyles } from '@emotion/react';
import type { CSSProperties, PropsWithChildren, ReactNode, ButtonHTMLAttributes } from 'react';
import { Svg, type SvgAsset } from '../../_internal/Svg';
import type { ElementOf } from '../../_internal/utils';
import { StyledButton } from './Button.style';

/** Helper to render an SvgAsset at the standard 16px size with `currentColor`. */
export const buttonSvg = (asset: SvgAsset) => <Svg asset={asset} color='currentColor' size={16} />;

export const buttonVariants = {
  /** `variant='bare'` is an outlined secondary button (dim fill + accent outline & text). */
  variants: ['solid', 'bare'],
  colors: ['dark-purple', 'red', 'warning', 'success', 'gray', 'black', 'blue'],
  sizes: ['sm', 'md']
} as const;

export type ButtonPropsBase = {
  variant?: ElementOf<(typeof buttonVariants)['variants']>;
  color?: ElementOf<(typeof buttonVariants)['colors']>;
  size?: ElementOf<(typeof buttonVariants)['sizes']>;

  disabled?: boolean;
  isSquareIconButton?: boolean;
  isCircleIconButton?: boolean;
  minWidth?: CSSProperties['minWidth'];

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  uiTestId?: string;
  styleOverrides?: SerializedStyles;
} & PropsWithChildren<unknown>;

export type ButtonProps = ButtonPropsBase & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, leftIcon, rightIcon, uiTestId, disabled, ...props }: ButtonProps) => {
  return (
    <StyledButton
      type='button'
      // `aria-disabled` (not the native attribute) keeps the button focusable and
      // lets `cursor: not-allowed` show — browsers suppress custom cursors on a
      // natively-disabled control. Activation is guarded in the onClick below.
      aria-disabled={disabled || undefined}
      {...props}
      {...(uiTestId ? { 'data-testid': uiTestId } : {})}
      onClick={
        props.onClick && !disabled
          ? e => {
              // Stops propagation so the button is safe inside clickable rows/cards.
              e.stopPropagation();
              e.preventDefault();
              props.onClick?.(e);
              return false;
            }
          : undefined
      }>
      {leftIcon}
      {children}
      {rightIcon}
    </StyledButton>
  );
};

export type IconButtonProps = Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon' | 'size'> & {
  icon: SvgAsset;
  size?: number | ButtonPropsBase['size'];
};

export const IconButton = ({ icon, size: sizeIn = 'md', ...props }: IconButtonProps) => {
  const size = typeof sizeIn === 'number' ? sizeIn : sizeIn === 'sm' ? 32 : 36;
  return (
    <Button
      {...props}
      size='sm'
      minWidth='auto'
      styleOverrides={css`
        padding: ${size / 4}px;
        width: ${size + 1}px;
        height: ${size + 1}px;
        ${props.styleOverrides}
      `}>
      <Svg asset={icon} size={size / 2} color='currentColor' />
    </Button>
  );
};
