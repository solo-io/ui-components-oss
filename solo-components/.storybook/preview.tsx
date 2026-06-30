import type { Preview } from '@storybook/react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { SoloContextProvider, defaultSoloTheme } from '../src/providers';
import { StoryContainer } from './StoryContainer';

// A toolbar toggle that drives the whole canvas + every component's theme.
export const globalTypes = {
  theme: {
    description: 'Color theme',
    defaultValue: 'dark',
    toolbar: {
      title: 'Theme',
      icon: 'paintbrush',
      items: [
        { value: 'dark', title: 'Dark' },
        { value: 'light', title: 'Light' }
      ],
      dynamicTitle: true
    }
  }
};

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } }
  },
  decorators: [
    // Every story runs inside the same provider consumers use; the toolbar's
    // theme drives the provider mode, the antd algorithm, and the canvas.
    (Story, context) => {
      const mode = context.globals.theme === 'light' ? 'light' : 'dark';
      const background = mode === 'light' ? '#ffffff' : defaultSoloTheme.colors.background;
      return (
        <ConfigProvider theme={{ algorithm: mode === 'light' ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm }}>
          <SoloContextProvider mode={mode}>
            <div style={{ minHeight: '100vh', background }}>
              <StoryContainer>
                <Story />
              </StoryContainer>
            </div>
          </SoloContextProvider>
        </ConfigProvider>
      );
    }
  ]
};

export default preview;
