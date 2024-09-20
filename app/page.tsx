import React from 'react';
import dynamic from 'next/dynamic';

const PriceDisplay = dynamic(() => import('./components/PriceDisplay'), {
  ssr: false,
  loading: () => <p>Loading price data...</p>,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Crypto Price Tracker
      </h1>
      <PriceDisplay symbol="BTCUSDT" />
    </main>
  );
}
