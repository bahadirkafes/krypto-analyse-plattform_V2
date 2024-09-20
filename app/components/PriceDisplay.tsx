'use client';

import React, { useState } from 'react';
import { useCryptoPrice } from '../hooks/useCryptoPrice';
import PriceChart from './PriceChart';

interface PriceDisplayProps {
  initialSymbol: string;
}

export default function PriceDisplay({ initialSymbol }: PriceDisplayProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const { prices, priceHistory, errors, loading, retry } =
    useCryptoPrice(symbol);

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
  };

  const renderPrice = (exchange: 'binance' | 'kucoin' | 'mexc') => {
    if (prices[exchange] !== null) {
      return `$${prices[exchange]?.toFixed(2)}`;
    }
    if (errors[exchange]) {
      return 'Error';
    }
    return 'Loading...';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4 w-full max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Crypto Price Tracker
      </h1>
      <div className="mb-4">
        <label
          htmlFor="symbol"
          className="block text-sm font-medium text-gray-700"
        >
          Cryptocurrency Symbol
        </label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={handleSymbolChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Enter symbol (e.g., BTCUSDT)"
        />
      </div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">{symbol} Prices</h2>
      {loading && <p className="text-gray-600">Loading prices...</p>}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-600 mb-4">
          {Object.entries(errors).map(
            ([exchange, error]) =>
              error && (
                <p key={exchange}>
                  Error ({exchange}): {error}
                </p>
              )
          )}
          <button
            onClick={retry}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      <div className="space-y-4 mb-6">
        {['binance', 'kucoin', 'mexc'].map((exchange) => (
          <div key={exchange} className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700 capitalize">
              {exchange}:
            </span>
            <span
              className={`text-lg font-bold ${
                prices[exchange as keyof typeof prices] !== null
                  ? 'text-green-600'
                  : errors[exchange as keyof typeof errors]
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`}
            >
              {renderPrice(exchange as 'binance' | 'kucoin' | 'mexc')}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8">
        {priceHistory &&
        priceHistory.binance &&
        priceHistory.kucoin &&
        priceHistory.mexc ? (
          <PriceChart symbol={symbol} priceHistory={priceHistory} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
}
