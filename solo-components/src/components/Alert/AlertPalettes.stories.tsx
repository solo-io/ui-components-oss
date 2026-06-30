import type { Meta, StoryObj } from '@storybook/react';
import { CircleCheck, Info, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import { Text } from '../Text';

const meta: Meta = {
  title: 'Common / Alert',
  parameters: { layout: 'fullscreen' }
};
export default meta;
type Story = StoryObj;

// region Helpers

type AlertType = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<AlertType, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: OctagonAlert
};

const SAMPLES: { type: AlertType; title: string; msg: string }[] = [
  { type: 'info', title: 'Info', msg: 'Your changes have been saved as a draft.' },
  { type: 'success', title: 'Success', msg: 'The deployment completed successfully.' },
  { type: 'warning', title: 'Warning', msg: 'This action may take a few minutes to finish.' },
  { type: 'danger', title: 'Danger', msg: 'This will permanently delete the resource.' }
];

interface PaletteStyle {
  bg: string;
  border: string;
  title: string;
  message: string;
  icon: string;
  shadow: string;
}

interface Palette {
  name: string;
  note: string;
  style: (type: AlertType) => PaletteStyle;
}

const mix = (a: string, pct: number, base: string) => `color-mix(in srgb, ${a} ${pct}%, ${base})`;

// --- Light palettes (rendered on white) ---------------------------------------

// Theme semantic solids, with a punchier red/yellow for light where the muted
// palette solids read brownish.
const LIGHT_ACCENT: Record<AlertType, string> = {
  info: '#8023c3',
  success: '#16a34a',
  warning: '#f7c52e',
  danger: '#ef3030'
};
const LIGHT_SHADOW = '0 1px 2px rgba(16, 24, 40, 0.05), 0 2px 5px rgba(16, 24, 40, 0.04)';
// Strongly deepen the icon so it reads with high contrast on a tinted fill.
const deepIcon = (a: string) => mix(a, 42, '#15151a');

const LIGHT_PALETTES: Palette[] = [
  {
    name: '1 · Clean',
    note: 'White fill, neutral-gray border. Color only in the icon. (most Tailscale-like)',
    style: t => {
      const a = LIGHT_ACCENT[t];
      return {
        bg: '#ffffff',
        border: '#e4e4e7',
        title: '#131316',
        message: '#3f3f46',
        // Warning's bright yellow is deepened (like palette 3) to stay legible on white.
        icon: t === 'warning' ? deepIcon(a) : a,
        shadow: LIGHT_SHADOW
      };
    }
  },
  {
    name: '2 · Tinted neutral',
    note: 'Faint neutral fill with a hint of the accent, accent-tinted border.',
    style: t => {
      const a = LIGHT_ACCENT[t];
      return {
        bg: mix(a, 6, '#f7f7f8'),
        border: mix(a, 28, '#d4d4d8'),
        title: mix(a, 22, '#131316'),
        message: '#3f3f46',
        icon: deepIcon(a),
        shadow: LIGHT_SHADOW
      };
    }
  },
  {
    name: '3 · Soft wash',
    note: 'Light accent wash on white, accent border, soft tinted content. (chosen)',
    style: t => {
      const a = LIGHT_ACCENT[t];
      return {
        bg: mix(a, 10, '#ffffff'),
        // Warning's pale-yellow border needs full strength to read (like option 5).
        border: t === 'warning' ? a : mix(a, 38, '#ffffff'),
        title: mix(a, 42, '#1a1a20'),
        message: mix(a, 30, '#52525b'),
        // Warning's bright yellow is deepened more (like palette 4) to stay legible.
        icon: t === 'warning' ? deepIcon(a) : mix(a, 84, '#20202a'),
        shadow: LIGHT_SHADOW
      };
    }
  },
  {
    name: '4 · Tinted',
    note: 'A medium accent tint — sits between the soft wash and the vivid fill.',
    style: t => {
      const a = LIGHT_ACCENT[t];
      return {
        bg: mix(a, 20, '#f6f7f8'),
        // Warning's pale-yellow border needs full strength to read (like option 5).
        border: t === 'warning' ? a : mix(a, 60, '#ffffff'),
        title: mix(a, 30, '#17171b'),
        message: mix(a, 22, '#3c3c44'),
        icon: t === 'warning' ? deepIcon(a) : mix(a, 60, '#1c1c22'),
        shadow: LIGHT_SHADOW
      };
    }
  },
  {
    name: '5 · Vivid tint',
    note: 'Saturated near-opaque tint, full-strength accent border.',
    style: t => {
      const a = LIGHT_ACCENT[t];
      return {
        bg: mix(a, 34, '#f4f4f5'),
        border: a,
        title: mix(a, 18, '#131316'),
        message: mix(a, 14, '#2a2a30'),
        icon: deepIcon(a),
        shadow: LIGHT_SHADOW
      };
    }
  },
  {
    name: '6 · Bold',
    note: 'Strong colored fill; the alert reads as the accent itself.',
    style: t => {
      const a = LIGHT_ACCENT[t];
      return {
        bg: mix(a, 55, '#ffffff'),
        border: mix(a, 72, '#ffffff'),
        title: mix(a, 16, '#0c0c0e'),
        message: mix(a, 12, '#1f1f24'),
        icon: deepIcon(a),
        shadow: LIGHT_SHADOW
      };
    }
  }
];

// --- Dark palettes (rendered on the dark page surface) ------------------------

// Neon accents for outline/icon; muted solids for the fill base.
const DARK_NEON: Record<AlertType, string> = {
  info: '#b57bff',
  success: '#2fe07f',
  warning: '#ffb238',
  danger: '#ff6a6a'
};
const DARK_SOLID: Record<AlertType, string> = {
  info: '#8023c3',
  success: '#15803d',
  warning: '#b45309',
  danger: '#a82f25'
};

const DARK_PALETTES: Palette[] = [
  {
    name: '1 · Subtle',
    note: 'Barely-tinted dark fill, quiet border, neon icon. Lowest-key.',
    style: t => {
      const n = DARK_NEON[t];
      const s = DARK_SOLID[t];
      return {
        bg: mix(s, 12, '#191920'),
        border: mix(n, 26, '#3f3f46'),
        title: '#fafafa',
        message: '#a1a1aa',
        icon: n,
        shadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
      };
    }
  },
  {
    name: '2 · Translucent (current)',
    note: 'Accent-tinted translucent fill, neon border, soft glow.',
    style: t => {
      const n = DARK_NEON[t];
      const s = DARK_SOLID[t];
      return {
        bg: mix(s, 28, '#1e1e22'),
        border: n,
        title: mix(s, 22, '#ffffff'),
        message: mix(s, 20, '#c8ccd4'),
        icon: n,
        shadow: `0 0 16px ${mix(n, 34, 'transparent')}, 0 2px 4px rgba(0, 0, 0, 0.32)`
      };
    }
  },
  {
    name: '3 · Neon glow',
    note: 'Brighter neon edge and a stronger outer glow.',
    style: t => {
      const n = DARK_NEON[t];
      const s = DARK_SOLID[t];
      return {
        bg: mix(s, 22, '#161619'),
        border: n,
        title: '#ffffff',
        message: '#d6dae2',
        icon: n,
        shadow: `0 0 22px ${mix(n, 55, 'transparent')}, 0 0 1px ${mix(n, 70, 'transparent')}`
      };
    }
  },
  {
    name: '4 · Solid tint',
    note: 'More opaque saturated fill, no glow — flatter and calmer.',
    style: t => {
      const n = DARK_NEON[t];
      const s = DARK_SOLID[t];
      return {
        bg: mix(s, 46, '#1b1b20'),
        border: mix(n, 70, s),
        title: '#ffffff',
        message: mix(s, 12, '#e6e8ee'),
        icon: n,
        shadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
      };
    }
  },
  {
    name: '5 · Filled bold',
    note: 'Strong colored fill with white text; the alert reads as the accent.',
    style: t => {
      const n = DARK_NEON[t];
      const s = DARK_SOLID[t];
      return {
        bg: mix(s, 80, '#101015'),
        border: mix(n, 50, s),
        title: '#ffffff',
        message: 'rgba(255, 255, 255, 0.86)',
        icon: '#ffffff',
        shadow: '0 4px 14px rgba(0, 0, 0, 0.45)'
      };
    }
  }
];

// region Component

function PreviewAlert({ type, title, msg, s }: { type: AlertType; title: string; msg: string; s: PaletteStyle }) {
  const Icon = ICONS[type];
  return (
    <div
      role='note'
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 8,
        border: `1px solid ${s.border}`,
        background: s.bg,
        boxShadow: s.shadow
      }}>
      <div style={{ flexShrink: 0, display: 'flex', marginTop: 1, color: s.icon }}>
        <Icon size={18} aria-hidden />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <Text size='14px' weight={600} color={s.title}>
          {title}
        </Text>
        <Text size='14px' color={s.message}>
          {msg}
        </Text>
      </div>
    </div>
  );
}

function PaletteComparison({
  palettes,
  surface,
  nameColor,
  noteColor
}: {
  palettes: Palette[];
  surface: string;
  nameColor: string;
  noteColor: string;
}) {
  return (
    <div style={{ background: surface, minHeight: '100vh', padding: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 1180 }}>
        {palettes.map(p => (
          <div key={p.name} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Text size='15px' weight={700} color={nameColor}>
                {p.name}
              </Text>
              <Text size='13px' color={noteColor}>
                {p.note}
              </Text>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {SAMPLES.map(sample => (
                <PreviewAlert key={sample.type} type={sample.type} title={sample.title} msg={sample.msg} s={p.style(sample.type)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// region Stories

/** Five candidate light-theme palettes for the Alert, cleanest to boldest. */
export const LightPaletteOptions: Story = {
  name: 'Light Palette Options',
  render: () => <PaletteComparison palettes={LIGHT_PALETTES} surface='#ffffff' nameColor='#18181b' noteColor='#71717a' />
};

/** Five candidate dark-theme palettes for the Alert, quietest to boldest. */
export const DarkPaletteOptions: Story = {
  name: 'Dark Palette Options',
  render: () => <PaletteComparison palettes={DARK_PALETTES} surface='#0d0e15' nameColor='#fafafa' noteColor='#8b8b93' />
};
