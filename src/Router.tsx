import { createBrowserRouter } from 'react-router-dom';

import ErrorComponent from './components/ErrorComponent';
import Root from './Root';
import About from './screens/About';
import Home from './screens/Home';
import NotFound from './screens/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />,
        errorElement: <ErrorComponent />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
