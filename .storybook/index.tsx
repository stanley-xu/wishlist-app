import { view } from '@storybook/react-native';

const StorybookUI = view.getStorybookUI({
  // Enable React DevTools integration
  enableWebsockets: true,
});

export default StorybookUI;
