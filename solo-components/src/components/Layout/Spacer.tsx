import type { SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import type { ComponentProps, CSSProperties } from 'react';
import { cssProp, dontForwardProps } from '../../_internal/utils';

// region Helpers

type SizeType = number | string;

// region Component

/**
 * Margin/padding/sizing primitive. Use a string for exact values
 * (e.g. `mx='5px'`). Directional props (`mr`, `mb`, …) override the axis
 * shorthands (`mx`, `my`).
 */
export type SpacerProps = {
  mx?: string;
  my?: string;
  mr?: string;
  ml?: string;
  mt?: string;
  mb?: string;
  margin?: string;
  px?: string;
  py?: string;
  pr?: string;
  pl?: string;
  pt?: string;
  pb?: string;
  padding?: string;
  display?: CSSProperties['display'];
  position?: CSSProperties['position'];
  minHeight?: SizeType;
  minWidth?: CSSProperties['minWidth'];
  height?: SizeType;
  width?: SizeType;
  maxHeight?: CSSProperties['maxHeight'];
  maxWidth?: CSSProperties['maxWidth'];
  flexGrow?: CSSProperties['flexGrow'];
  flexBasis?: CSSProperties['flexBasis'];
  flexShrink?: CSSProperties['flexShrink'];
  overflowY?: CSSProperties['overflowY'];
  overflowX?: CSSProperties['overflowX'];
  textOverflow?: CSSProperties['textOverflow'];
  overflow?: CSSProperties['overflow'];
  zIndex?: CSSProperties['zIndex'];
  stylingOverrides?: SerializedStyles;
  fadeIn?: boolean;
} & ComponentProps<'div'>;

export const Spacer = styled(
  'div',
  dontForwardProps(
    'mx',
    'my',
    'mr',
    'ml',
    'mt',
    'mb',
    'margin',
    'px',
    'py',
    'pr',
    'pl',
    'pt',
    'pb',
    'padding',
    'display',
    'position',
    'minHeight',
    'minWidth',
    'height',
    'width',
    'maxHeight',
    'maxWidth',
    'flexGrow',
    'flexBasis',
    'flexShrink',
    'overflowY',
    'overflowX',
    'textOverflow',
    'overflow',
    'zIndex',
    'stylingOverrides',
    'fadeIn'
  )
)<SpacerProps>(props => {
  const { mx, my, mr, ml, mt, mb, margin, px, py, pl, pr, pt, pb, padding } = props;
  const marginRight = mr ?? mx;
  const marginLeft = ml ?? mx;
  const marginTop = mt ?? my;
  const marginBottom = mb ?? my;
  const paddingRight = pr ?? px;
  const paddingLeft = pl ?? px;
  const paddingTop = pt ?? py;
  const paddingBottom = pb ?? py;
  return `
  ${cssProp('display', props.display)}
  ${cssProp('position', props.position)}
  ${cssProp('margin', margin)}
  ${cssProp('margin-right', marginRight)}
  ${cssProp('margin-left', marginLeft)}
  ${cssProp('margin-top', marginTop)}
  ${cssProp('margin-bottom', marginBottom)}
  ${cssProp('padding', padding)}
  ${cssProp('padding-right', paddingRight)}
  ${cssProp('padding-left', paddingLeft)}
  ${cssProp('padding-top', paddingTop)}
  ${cssProp('padding-bottom', paddingBottom)}
  ${cssProp('min-height', props.minHeight)}
  ${cssProp('min-width', props.minWidth)}
  ${cssProp('height', props.height)}
  ${cssProp('width', props.width)}
  ${cssProp('max-height', props.maxHeight)}
  ${cssProp('max-width', props.maxWidth)}
  ${cssProp('flex-grow', props.flexGrow)}
  ${cssProp('flex-shrink', props.flexShrink)}
  ${cssProp('flex-basis', props.flexBasis)}
  ${cssProp('overflow-y', props.overflowY)}
  ${cssProp('overflow-x', props.overflowX)}
  ${cssProp('overflow', props.overflow)}
  ${cssProp('text-overflow', props.textOverflow)}
  ${cssProp('z-index', props.zIndex)}

  animation: ${props.fadeIn ? `fadeIn 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards` : 'none'};
  ${props.fadeIn ? `@media (prefers-reduced-motion: reduce) { animation: none; opacity: 1; }` : ''}

  ${props.stylingOverrides?.styles ? props.stylingOverrides.styles : ''}
`;
});
