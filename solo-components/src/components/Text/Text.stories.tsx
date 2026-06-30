import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Common / Text',
  component: Text,
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    size: '16px'
  }
};
export default meta;

type Story = StoryObj<typeof Text>;

// Default color follows the theme, so it flips with the light/dark toolbar.
export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {['12px', '14px', '16px', '20px', '24px', '30px'].map(s => (
        <Text key={s} size={s}>
          {s} — The quick brown fox
        </Text>
      ))}
    </div>
  )
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[300, 400, 500, 600, 700].map(w => (
        <Text key={w} weight={w} size='18px'>
          {w} — The quick brown fox
        </Text>
      ))}
    </div>
  )
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text size='18px'>Default — follows the theme&apos;s text color</Text>
      <Text size='18px' color='var(--color-text-secondary, #a1a1aa)'>
        Secondary — themed via CSS variable
      </Text>
      <Text size='18px' color='var(--color-primary, #6844ff)'>
        Primary accent
      </Text>
    </div>
  )
};

export const Truncate: Story = {
  render: () => (
    <Text truncate maxWidth='260px' size='16px'>
      This is a very long single line of text that should be truncated with an ellipsis.
    </Text>
  )
};
