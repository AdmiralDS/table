import 'styled-components';
import type { CSSProp } from 'styled-components';
import type { Theme } from '@admiral-ds/react-ui';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
  type ThemeFn = (outerTheme: DefaultTheme) => DefaultTheme;
  type ThemeArgument = DefaultTheme | ThemeFn;
  type Props = {
    children?: React.ReactNode;
    theme: ThemeArgument;
  };
  export function ThemeProvider(props: Props): JSX.Element | null;
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DOMAttributes<T> {
    css?: CSSProp;
  }
}
