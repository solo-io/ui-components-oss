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

// `darkAccent` is a neon-bright icon/outline for dark mode; light mode uses the
// saturated solid color (neon-on-white reads washed out).
const typeConfig: Record<AlertType, { color: SoloColorName; Icon: LucideIcon; darkAccent: string }> = {
  info: { color: 'blue', Icon: Info, darkAccent: '#44b0ff' },
  success: { color: 'success', Icon: CircleCheck, darkAccent: '#2fe07f' },
  warning: { color: 'warning', Icon: TriangleAlert, darkAccent: '#ffb238' },
  danger: { color: 'red', Icon: OctagonAlert, darkAccent: '#ff6a6a' }
};

export interface AlertProps {
  type?: AlertType;
  title?: ReactNode;
  children?: ReactNode;
  /** Adds a subtle gradient sheen radiating from the top-right. */
  gradient?: boolean;
  /** Shows an X button in the upper-right that hides the alert. */
  isDismissable?: boolean;
  /** Called when the alert is dismissed (after it hides itself). */
  onDismiss?: () => void;
}

/**
 * Inline alert with a Lucide icon. Neon accent — a bright outline + icon with a
 * matching glow (stronger in dark) — over a translucent, optionally gradient fill.
 * Pass `isDismissable` for an X button that closes it.
 */
export function Alert({ type = 'info', title, children, gradient = false, isDismissable = false, onDismiss }: AlertProps) {
  const { color, Icon, darkAccent } = typeConfig[type];
  const tokens = soloColorTokens[color];
  const mode = useSoloMode();
  const [dismissed, setDismissed] = useState(false);

  const accent = mode === 'dark' ? darkAccent : tokens.bg;

  // Translucent fill (the page shows through), with an optional top-right sheen.
  // Light gets a more saturated yet more transparent fill; dark stays as-is.
  const opacity = mode === 'dark' ? 72 : 48;
  const tint = (pct: number) =>
    `color-mix(in srgb, color-mix(in srgb, ${tokens.bg} ${pct}%, var(--color-bg-elevated, #1e1e22)) ${opacity}%, transparent)`;
  const corner = mode === 'dark' ? 58 : 80;
  const basePct = mode === 'dark' ? 20 : 44;
  const solidPct = mode === 'dark' ? 28 : 48;
  const background = gradient
    ? `radial-gradient(130% 130% at 100% 0%, ${tint(corner)} 0%, ${tint(basePct)} 65%)`
    : tint(solidPct);

  // Neon glow from the accent (stronger in dark) plus a small drop shadow.
  const glow = mode === 'dark' ? 34 : 16;
  const dropAlpha = mode === 'dark' ? 0.32 : 0.1;
  const shadow = `0 0 16px color-mix(in srgb, ${accent} ${glow}%, transparent), 0 2px 4px rgba(0, 0, 0, ${dropAlpha})`;

  // Text is tinted with the accent but stays very light on dark / dark on light.
  const titleColor =
    mode === 'dark'
      ? `color-mix(in srgb, ${tokens.bg} 22%, #ffffff)`
      : `color-mix(in srgb, ${tokens.bg} 32%, #18181b)`;
  const messageColor =
    mode === 'dark'
      ? `color-mix(in srgb, ${tokens.bg} 20%, #c8ccd4)`
      : `color-mix(in srgb, ${tokens.bg} 28%, #4b4b52)`;

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  // info/success are polite (status); warning/danger interrupt (alert).
  const role = type === 'warning' || type === 'danger' ? 'alert' : 'status';

  return (
    <Container role={role} background={background} frame={accent} shadow={shadow}>
      {/* Icon is decorative — the title/message already carry the meaning. */}
      <IconSlot accent={accent} aria-hidden='true'>
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
