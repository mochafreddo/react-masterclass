import { RouterProvider } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from 'styled-components';

import { isDarkAtom } from './atoms';
import GlobalStyle from './GlobalStyles';
import router from './Router';
import { darkTheme, lightTheme } from './theme';

function App() {
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
