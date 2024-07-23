import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string
    bgColor: string
    accentColor: string
    cardBgColor: string
    isDark: boolean
    categoryColors: {
      TO_DO: string
      DOING: string
      DONE: string
    }
  }
}
