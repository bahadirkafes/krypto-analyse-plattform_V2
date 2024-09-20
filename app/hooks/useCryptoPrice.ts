'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBinancePrice } from '../api/binance';
import { getKucoinPrice } from '../api/kucoin_V1';
import { getMEXCPrice } from '../api/mexc';

interface PriceData {
  binance: number | null;
  kucoin: number | null;
  mexc: number | null;
}

interface PriceHistory {
  binance: number[];
  kucoin: number[];
  mexc: number[];
}

export function useCryptoPrice(symbol: string) {
  const [prices, setPrices] = useState<PriceData>({
    binance: null,
    kucoin: null,
    mexc: null,
  });
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({
    binance: [],
    kucoin: [],
    mexc: [],
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PriceData, string>>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPrice = async (
    exchange: keyof PriceData,
    fetchFunction: (symbol: string) => Promise<number>
  ) => {
    try {
      const price = await fetchFunction(symbol);
      setPrices((prev) => ({ ...prev, [exchange]: price }));
      setPriceHistory((prev) => ({
        ...prev,
        [exchange]: [...prev[exchange], price].slice(-50), // Keep last 50 price points
      }));
      setErrors((prev) => ({ ...prev, [exchange]: undefined }));
    } catch (error) {
      console.error(`Error fetching ${exchange} price:`, error);
      setErrors((prev) => ({
        ...prev,
        [exchange]: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchPrice('binance', getBinancePrice),
      fetchPrice('kucoin', getKucoinPrice),
      fetchPrice('mexc', getMEXCPrice),
    ]);
    setLoading(false);
  }, [symbol]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const retry = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { prices, priceHistory, errors, loading, retry };
}
