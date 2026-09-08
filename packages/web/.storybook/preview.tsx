import { tokens } from '@lucidjs/core';
import type { Preview } from '@storybook/react-vite';
import { create } from 'storybook/theming';
import { DocsContainer } from './docs-container';
import { theme } from './theme';


const preview: Preview = {
  initialGlobals: {
    backgrounds: { value: 'dark', },
  },
  parameters: {
    docs: {
      container: DocsContainer,
      theme: create(theme),
    },
    backgrounds: {
      options: {
        dark: { name: 'Moonsong', value: tokens.colors.bgBase, },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      exclude: [
        'ref', 'as', 'style', 'className', 'children', 'data-testid', 'sx', 'variant',
        'a11y',
      ],
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Getting Started', 'Foundations', '*'],
      },
    },
  },
};

export default preview;
