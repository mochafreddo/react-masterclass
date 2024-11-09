import { useQuery } from '@tanstack/react-query';

import { getMovies } from '@/api';

import type { MoviesResponse } from '@/types/api/movie';

function Home() {
  const { data, isLoading } = useQuery<MoviesResponse>({
    queryKey: ['movies', 'nowPlaying'],
    queryFn: getMovies,
  });

  console.log(data, isLoading);
  return <div style={{ backgroundColor: 'whitesmoke', height: '200vh' }}>home</div>;
}

export default Home;
