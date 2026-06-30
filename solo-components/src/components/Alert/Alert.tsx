import styled from '@emotion/styled';
import { CircleCheck, Info, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { soloColorTokens, type SoloColorName } from '../../_internal/palette';
import { dontForwardProps } from '../../_internal/utils';
import { useSoloMode } from '../../providers/SoloModeContext';
import { CloseButton } from '../CloseButton';
import { Text } from '../Text';

// region Styles

const Container = styled('div', dontForwardProps('background', 'frame', 'shadow'))<{
  background: string;
  frame: string;
  shadow: string;
}>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.frame};
  background: ${props => props.background};
  box-shadow: ${props => props.shadow};
`;

const IconSlot = styled('div', dontForwardProps('accent'))<{ accent: string }>`
  flex-shrink: 0;
  display: flex;
  margin-top: 1px;
  color: ${props => props.accent};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

// region Component

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

// `darkAccent` is a neon-bright icon/outline for dark mode. `lightAccent` lets a
// type swap its muted palette solid for a punchier hue in light mode (e.g. a
// truer red / yellow); it falls back to the solid when omitted.
const typeConfig: Record<AlertType, { color: SoloColorName; Icon: LucideIcon; darkAccent: string; lightAccent?: string }> = {
  // Brand purple, matching the Button's `dark-purple`.
  info: { color: 'dark-purple', Icon: Info, darkAccent: '#b57bff', lightAccent: '#8023c3' },
  success: { color: 'success', Icon: CircleCheck, darkAccent: '#2fe07f', lightAccent: '#16a34a' },
  warning: { color: 'warning', Icon: TriangleAlert, darkAccent: '#ffb238', lightAccent: '#f7c52e' },
  danger: { color: 'red', Icon: OctagonAlert, darkAccent: '#ff6a6a', lightAccent: '#ef3030' }
};

export interface AlertProps {
  type?: AlertType;
  title?: ReactNode;
  children?: ReactNode;
  /** Shows an X button in the upper-right that hides the alert. */
  isDismissable?: boolean;
  /** Called when the alert is dismissed (after it hides itself). */
  onDismiss?: () => void;
}

/**
 * Inline alert with a Lucide icon. Dark uses a neon accent — a bright outline +
 * icon with a glow — over a translucent fill; light uses a soft accent wash on
 * near-white. Pass `isDismissable` for an X button that closes it.
 */
export function Alert({ type = 'info', title, children, isDismissable = false, onDismiss }: AlertProps) {
  const { color, Icon, darkAccent, lightAccent } = typeConfig[type];
  const tokens = soloColorTokens[color];
  const mode = useSoloMode();
  const [dismissed, setDismissed] = useState(false);

  // Light mode can swap the muted solid for a punchier hue; dark keeps its neon.
  const lightBase = lightAccent ?? tokens.bg;
  const accent = mode === 'dark' ? darkAccent : lightBase;
  // Base color the fill + text tints are composed from.
  const tintBase = mode === 'dark' ? tokens.bg : lightBase;
  // Colored icon in light (keeps the hue, grounded for contrast); dark keeps the
  // neon accent. Warning's bright yellow is deepened more so it stays legible.
  const iconColor =
    mode === 'dark'
      ? accent
      : type === 'warning'
        ? `color-mix(in srgb, ${lightBase} 42%, #15151a)`
        : `color-mix(in srgb, ${lightBase} 60%, #1c1c22)`;
  // Light uses an accent-on-white border; dark keeps the neon edge. Warning's
  // pale-yellow border needs full strength to stay visible.
  const borderColor =
    mode === 'dark'
      ? accent
      : type === 'warning'
        ? lightBase
        : `color-mix(in srgb, ${lightBase} 60%, #ffffff)`;

  // Dark: a translucent accent-tinted fill so the page shows through. Light: a
  // medium accent tint on near-white.
  const opacity = mode === 'dark' ? 72 : 100;
  const fillPct = mode === 'dark' ? 28 : 20;
  const background = `color-mix(in srgb, color-mix(in srgb, ${tintBase} ${fillPct}%, var(--color-bg-elevated, #1e1e22)) ${opacity}%, transparent)`;

  // Dark: a neon glow from the accent plus a small drop shadow. Light: a soft,
  // slightly accent-tinted card shadow so the alert reads as an elevated surface
  // instead of a flat tinted rectangle.
  const shadow =
    mode === 'dark'
      ? `0 0 16px color-mix(in srgb, ${accent} 34%, transparent), 0 2px 4px rgba(0, 0, 0, 0.32)`
      : `0 1px 2px rgba(16, 24, 40, 0.05), 0 2px 5px rgba(16, 24, 40, 0.04)`;

  // Text is tinted with the accent — light on dark, and a soft accent-tinted dark
  // on light (tinted rather than near-black, to suit the airy wash).
  const titleColor =
    mode === 'dark'
      ? `color-mix(in srgb, ${tintBase} 22%, #ffffff)`
      : `color-mix(in srgb, ${tintBase} 30%, #17171b)`;
  const messageColor =
    mode === 'dark'
      ? `color-mix(in srgb, ${tintBase} 20%, #c8ccd4)`
      : `color-mix(in srgb, ${tintBase} 22%, #3c3c44)`;

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  // info/success are polite (status); warning/danger interrupt (alert).
  const role = type === 'warning' || type === 'danger' ? 'alert' : 'status';

  return (
    <Container role={role} background={background} frame={borderColor} shadow={shadow}>
      {/* Icon is decorative — the title/message already carry the meaning. */}
      <IconSlot accent={iconColor} aria-hidden='true'>
        <Icon />
      </IconSlot>
      <Body>
        {title ? (
          <Text size='14px' weight={600} color={titleColor}>
            {title}
          </Text>
        ) : null}
        {children ? (
          <Text size='14px' color={messageColor}>
            {children}
          </Text>
        ) : null}
      </Body>
      {isDismissable ? (
        <CloseButton
          aria-label='Dismiss'
          size={16}
          onClick={handleDismiss}
          style={{ color: messageColor, flexShrink: 0, marginTop: 1 }}
        />
      ) : null}
    </Container>
  );
}
