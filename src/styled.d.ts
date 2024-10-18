import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor: string;
    boardColor: string;
    cardColor: string;
    boardTitleBg: string;
    boardTitleColor: string;
    accentColor: string;
    accentColorHover: string;
    dragOverColor: string;
    dragFromColor: string;
  }
}
