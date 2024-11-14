import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Header />
      <Routes>
        <Route path="/movies/:movieId" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
