import { useState } from 'react';
import { Button, buttonVariants } from '@solo-io/ui-components-oss';

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <header>
        <h1 style={{ margin: 0 }}>solo-components example</h1>
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Live preview of the <code>Button</code> component imported from the workspace.
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16, opacity: 0.8 }}>Click counter</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button color='dark-purple' onClick={() => setCount(c => c + 1)}>
            Clicked {count} times
          </Button>
          <Button color='gray' variant='bare' onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16, opacity: 0.8 }}>All colors</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {buttonVariants.colors.map(c => (
            <Button key={c} color={c}>
              {c}
            </Button>
          ))}
        </div>
      </section>
    </main>
  );
};
