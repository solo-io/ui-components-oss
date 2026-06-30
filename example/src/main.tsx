import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SoloContextProvider } from '@solo.io/ui-components-oss';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoloContextProvider>
      <App />
    </SoloContextProvider>
  </StrictMode>
);
