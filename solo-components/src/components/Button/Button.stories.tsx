import type { Meta, StoryObj } from '@storybook/react';
import { Button, buttonVariants } from './Button';
import { Text } from '../Text';

const meta: Meta<typeof Button> = {
  title: 'Common / Button',
  component: Button,
  args: {
    children: 'Button',
    color: 'dark-purple',
    variant: 'solid',
    size: 'md'
  },
  argTypes: {
    color: { control: 'select', options: buttonVariants.colors },
    variant: { control: 'select', options: buttonVariants.variants },
    size: { control: 'select', options: buttonVariants.sizes },
    disabled: { control: 'boolean' }
  }
};
export default meta;

type Story = StoryObj<typeof Button>;

const Row = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Text size='12px' color='var(--color-text-secondary, #a1a1aa)'>
      {label}
    </Text>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{children}</div>
  </div>
);

// `blue` is de-emphasized — rarely used, so keep it out of the showcase.
const showcaseColors = buttonVariants.colors.filter(c => c !== 'blue');
const showcaseSizes = ['md', 'sm'] as const;

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {buttonVariants.variants.flatMap(variant =>
        showcaseSizes.map(size => (
          <Row key={`${variant}-${size}`} label={`${variant} variant (${size})`}>
            {showcaseColors.map(c => (
              <Button key={c} color={c} variant={variant} size={size}>
                {variant} {c} {size}
              </Button>
            ))}
          </Row>
        ))
      )}
      <Row label='Disabled'>
        <Button disabled color='dark-purple'>
          Next
        </Button>
        <Button disabled color='gray'>
          Back
        </Button>
      </Row>
    </div>
  )
};
