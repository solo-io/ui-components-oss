import type { Meta, StoryObj } from '@storybook/react';
import { Alert, type AlertType } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Common / Alert',
  component: Alert
};
export default meta;

type Story = StoryObj<typeof Alert>;

const samples: { type: AlertType; title: string; msg: string }[] = [
  { type: 'info', title: 'Info', msg: 'Your changes have been saved as a draft.' },
  { type: 'success', title: 'Success', msg: 'The deployment completed successfully.' },
  { type: 'warning', title: 'Warning', msg: 'This action may take a few minutes to finish.' },
  { type: 'danger', title: 'Danger', msg: 'This will permanently delete the resource.' }
];

const Stack = ({ gradient }: { gradient?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 460 }}>
    {samples.map(s => (
      <Alert key={s.type} type={s.type} title={s.title} gradient={gradient}>
        {s.msg}
      </Alert>
    ))}
  </div>
);

export const AllTypes: Story = {
  render: () => <Stack />
};

export const Gradient: Story = {
  render: () => <Stack gradient />
};

export const Dismissable: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 460 }}>
      <Alert type='info' title='Dismissable' isDismissable>
        Click the × in the corner to hide this alert.
      </Alert>
      <Alert type='success' title='With callback' isDismissable onDismiss={() => console.log('dismissed')}>
        Hides itself and fires <code>onDismiss</code>.
      </Alert>
    </div>
  )
};
