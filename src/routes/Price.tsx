import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { fetchCoinTickers } from '../api';

const Container = styled.div`
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 32px;
  color: ${(props) => props.theme.accentColor};
  text-align: center;
  margin-bottom: 20px;
`;

const PriceList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PriceItem = styled.li`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.textColor};
`;

function Price() {
  const { coinId } = useParams<{ coinId: string }>();
  const { isLoading, data } = useQuery(['tickers', coinId], () =>
    fetchCoinTickers(coinId!),
  );

  return (
    <Container>
      <Title>Price</Title>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <PriceList>
          <PriceItem>
            <span>Current Price:</span>
            <span>${data?.quotes.USD.price.toFixed(2)}</span>
          </PriceItem>
          <PriceItem>
            <span>Market Cap:</span>
            <span>${data?.quotes.USD.market_cap.toLocaleString()}</span>
          </PriceItem>
          <PriceItem>
            <span>24h Volume:</span>
            <span>${data?.quotes.USD.volume_24h.toLocaleString()}</span>
          </PriceItem>
          <PriceItem>
            <span>24h Change:</span>
            <span>{data?.quotes.USD.percent_change_24h}%</span>
          </PriceItem>
        </PriceList>
      )}
    </Container>
  );
}

export default Price;
