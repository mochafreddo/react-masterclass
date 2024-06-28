import ApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { fetchCoinHistory } from '../api';
import { isDarkAtom } from '../atoms';

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart() {
  const isDark = useRecoilValue(isDarkAtom);
  const { coinId } = useParams<{ coinId: string }>();
  const { isLoading, data } = useQuery<IHistorical[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId!),
    { refetchInterval: 10000 },
  );

  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              name: 'Price',
              data:
                data?.map((price) => ({
                  x: new Date(price.time_close),
                  y: [price.open, price.high, price.low, price.close],
                })) || [],
            },
          ]}
          options={{
            theme: { mode: 'dark' },
            chart: {
              height: 300,
              width: '100%',
              toolbar: { show: false },
              background: 'transparent',
            },
            grid: {
              show: true,
              borderColor: '#444',
              strokeDashArray: 5,
            },
            xaxis: {
              type: 'datetime',
              labels: {
                style: {
                  colors: '#888',
                },
              },
            },
            yaxis: {
              show: true,
              labels: {
                style: {
                  colors: '#888',
                },
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: '#26a69a',
                  downward: '#ef5350',
                },
                wick: {
                  useFillColor: true,
                },
              },
            },
            tooltip: {
              enabled: true,
              theme: 'dark',
              x: {
                format: 'dd MMM yyyy HH:mm',
              },
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            title: {
              text: `Price History of ${coinId}`,
              align: 'left',
              style: {
                fontSize: '18px',
                color: '#fff',
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
