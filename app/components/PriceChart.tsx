'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  symbol: string;
  priceHistory: {
    binance: number[];
    kucoin: number[];
    mexc: number[];
  };
}

export default function PriceChart({ symbol, priceHistory }: PriceChartProps) {
  if (
    !priceHistory ||
    !priceHistory.binance ||
    !priceHistory.kucoin ||
    !priceHistory.mexc
  ) {
    return <div>Loading chart data...</div>;
  }

  const maxLength = Math.max(
    priceHistory.binance.length,
    priceHistory.kucoin.length,
    priceHistory.mexc.length
  );

  const labels = Array.from({ length: maxLength }, (_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: 'Binance',
        data: priceHistory.binance,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Kucoin',
        data: priceHistory.kucoin,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'MEXC',
        data: priceHistory.mexc,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${symbol} Price History`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line options={options} data={data} />;
}
