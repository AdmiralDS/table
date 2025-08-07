import { useEffect, useRef, useState } from 'react';
import type { Preview } from '@storybook/react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { DocsContainer } from '@storybook/addon-docs';
import { useGlobals, addons } from '@storybook/preview-api';
import { themes } from '@storybook/theming';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';

import { lightThemeClassName, darkThemeClassName, vars } from '@admiral-ds/web';

import {
  DARK_THEME,
  LIGHT_THEME,
  FontsVTBGroup,
  DropdownProvider,
  LightThemeCssVars,
  DarkThemeCssVars,
} from '@admiral-ds/react-ui';

const channel = addons.getChannel();

function useDarkMode() {
  const [isDark, setDark] = useState<boolean>(false);

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark);
    return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
  }, []);

  return isDark;
}

const GlobalStyles = createGlobalStyle`
    body {
      background-color: ${vars.color.Neutral_Neutral00};
    }
`;

// create a component that uses the dark mode hook
function ThemeWrapper(props: { CSSCustomProps: boolean; children: React.ReactNode }) {
  // this example uses hook but you can also use class component as well
  const isDark = useDarkMode();

  useEffect(() => {
    // document.body refers to body tag inside iframe#storybook-preview-iframe
    document.body.classList.add(...(isDark ? darkThemeClassName : lightThemeClassName).split(' '));
    document.body.classList.remove(...(isDark ? lightThemeClassName : darkThemeClassName).split(' '));
  }, [isDark]);

  const renderCssProps = () => (isDark ? <DarkThemeCssVars /> : <LightThemeCssVars />);

  // render your custom theme provider
  return (
    <ThemeProvider theme={isDark ? DARK_THEME : LIGHT_THEME}>
      {props.CSSCustomProps && renderCssProps()}
      {props.children}
    </ThemeProvider>
  );
}

const StoryContainer = styled.div`
  padding: 3em;
  background-color: ${vars.color.Neutral_Neutral00};
`;

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    options: {
      storySort: {
        includeName: true,
        locales: 'en-US',
        order: ['Admiral-2.1', ['Date Picker', 'Range Picker', 'Double Range Picker', 'Widgets']],
      },
    },
    actions: { disabled: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    docs: {
      container: (props: React.ComponentProps<typeof DocsContainer>) => {
        const theme = useDarkMode() ? themes.dark : themes.normal;
        return <DocsContainer {...props} theme={theme} />;
      },
    },
  },
  decorators: [
    (renderStory) => {
      const [{ CSSCustomProps }] = useGlobals();
      const refDropdown = useRef(null);
      return (
        <ThemeWrapper CSSCustomProps={CSSCustomProps as boolean}>
          <GlobalStyles />
          <DropdownProvider rootRef={refDropdown}>
            <StoryContainer>{renderStory()}</StoryContainer>
            <div ref={refDropdown} />
          </DropdownProvider>
        </ThemeWrapper>
      );
    },
    (Story) => (
      <>
        <FontsVTBGroup />
        <Story />
      </>
    ),
  ],
  globalTypes: {
    CSSCustomProps: {
      defaultValue: false,
      toolbar: {
        title: 'CSS Custom Props',
        items: [
          { value: true, title: 'Enable css custom props', icon: 'passed' },
          { value: false, title: 'Disable css custom props', icon: 'failed' },
        ],
      },
    },
  },
};

export default preview;
