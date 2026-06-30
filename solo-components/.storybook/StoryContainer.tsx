import type { ReactNode } from 'react';
import { Spacer } from '../src/components/Layout/Spacer';

/**
 * Consistent padding wrapper applied to every story (dogfoods `Spacer`). Because
 * it only wraps the story's own DOM, portaled UI like antd `Drawer` stays
 * unpadded — e.g. the View-YAML story gets padding around its button, not the drawer.
 */
export const StoryContainer = ({ children }: { children: ReactNode }) => (
  <Spacer padding='24px'>{children}</Spacer>
);
