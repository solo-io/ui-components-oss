import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { FunctionComponent, SVGProps } from 'react';
import { dontForwardProps } from './utils';

export type SvgAsset = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;

export type SvgSize = number | string;

type SvgContainerProps = {
  svgColor?: string;
  inline?: boolean;
  width?: SvgSize;
  height?: SvgSize;
};

const px = (v: SvgSize | undefined) =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

const SvgContainer = styled(
  'span',
  dontForwardProps('svgColor', 'inline', 'width', 'height')
)<SvgContainerProps>(
  ({ svgColor, inline, width, height }) => css`
    display: ${inline ? 'inline-flex' : 'flex'};
    align-items: center;
    justify-items: center;
    ${svgColor ? `color: ${svgColor};` : ''}

    svg {
      ${width !== undefined ? `width: ${px(width)};` : ''}
      ${height !== undefined ? `height: ${px(height)};` : ''}
      ${svgColor
        ? `&:not([fill]), &[fill]:not([fill='none'], [fill='transparent']) { fill: ${svgColor}; }
           *[fill]:not([fill='none'], [fill='transparent']) { fill: ${svgColor}; }
           *[stroke]:not([stroke='none'], [stroke='transparent']) { stroke: ${svgColor}; }`
        : ''}
    }
  `
);

export type SvgProps = {
  asset: SvgAsset;
  color?: string;
  width?: SvgSize;
  height?: SvgSize;
  /** Sets both width and height. */
  size?: SvgSize;
  inline?: boolean;
};

export const Svg = ({ asset: Asset, color, size, width = size, height = size, inline }: SvgProps) => {
  return (
    <SvgContainer svgColor={color} width={width} height={height} inline={inline}>
      <Asset />
    </SvgContainer>
  );
};
