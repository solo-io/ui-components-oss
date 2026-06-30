import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>
    );
    // The styled button uses pointer-events: none when disabled; userEvent honors it.
    await user.click(screen.getByRole('button', { name: 'Nope' })).catch(() => {});
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders left and right icons', () => {
    render(
      <Button leftIcon={<span data-testid='left' />} rightIcon={<span data-testid='right' />}>
        Label
      </Button>
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('exposes uiTestId as data-testid', () => {
    render(<Button uiTestId='my-button'>Tagged</Button>);
    expect(screen.getByTestId('my-button')).toBeInTheDocument();
  });
});
