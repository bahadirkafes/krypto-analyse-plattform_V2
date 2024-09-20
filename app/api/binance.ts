import axios from 'axios';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

export async function getBinancePrice(
  symbol: string,
  signal?: AbortSignal
): Promise<number> {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/ticker/price`, {
      params: { symbol },
      signal,
    });
    return parseFloat(response.data.price);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching Binance price:', error.message);
      throw new Error(`Binance API error: ${error.message}`);
    }
    throw error;
  }
}
