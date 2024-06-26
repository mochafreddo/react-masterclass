import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from './GlobalStyles';
import router from './Router';
import { darkTheme, lightTheme } from './theme';

function App() {
  const [isDark, setIsDark] = useState(false);

  // Toggle between dark and light themes
  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <button onClick={toggleDark}>Toggle Mode</button>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
