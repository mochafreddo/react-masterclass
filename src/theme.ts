import { DefaultTheme } from 'styled-components'

export const darkTheme: DefaultTheme = {
  bgColor: '#2f3640',
  textColor: 'white',
  accentColor: '#e84393',
  cardBgColor: 'rgba(255, 255, 255, 0.1)',
  isDark: true,
  categoryColors: {
    TO_DO: '#3498db',
    DOING: '#f39c12',
    DONE: '#2ecc71',
  },
}

export const lightTheme: DefaultTheme = {
  bgColor: '#f5f6fa',
  textColor: '#2f3640',
  accentColor: '#e84393',
  cardBgColor: 'white',
  isDark: false,
  categoryColors: {
    TO_DO: '#3498db',
    DOING: '#f39c12',
    DONE: '#2ecc71',
  },
}
