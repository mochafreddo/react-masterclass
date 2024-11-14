import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getMovies } from '@/api';
import { makeImagePath } from '@/utils';

import type { MoviesResponse } from '@/types/api/movie';

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OFFSET = 6;

const variants = {
  row: {
    hidden: { x: window.outerWidth + 5 },
    visible: { x: 0 },
    exit: { x: -window.outerWidth - 5 },
  },
  box: {
    normal: { scale: 1 },
    hover: {
      scale: 1.3,
      y: -80,
      transition: {
        delay: 0.5,
        duration: 0.1,
        type: 'tween',
      },
    },
  },
  info: {
    hover: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.1,
        type: 'tween',
      },
    },
  },
};

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch('/movies/:movieId');
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { data, isLoading } = useQuery<MoviesResponse>({
    queryKey: ['movies', 'nowPlaying'],
    queryFn: getMovies,
  });

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const increaseIndex = () => {
    if (!data || leaving) return;
    toggleLeaving();
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / OFFSET) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loader>Loading...</Loader>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path ?? '')}>
        <Title>{data?.results[0].title}</Title>
        <Overview>{data?.results[0].overview}</Overview>
      </Banner>
      <Slider>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={variants.row}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(OFFSET * index, OFFSET * index + OFFSET)
              .map((movie) => (
                <Box
                  layoutId={movie.id.toString()}
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  variants={variants.box}
                  onClick={() => onBoxClicked(movie.id)}
                  transition={{ type: 'tween' }}
                  bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                >
                  <Info variants={variants.info}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <motion.div
            layoutId={bigMovieMatch.params.movieId}
            style={{
              position: 'absolute',
              width: '40vw',
              height: '80vh',
              backgroundColor: 'red',
              top: 50,
              left: 0,
              right: 0,
              margin: '0 auto',
            }}
          />
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Home;
