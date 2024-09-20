import axios from 'axios';

const KUCOIN_API_URL = 'https://api.kucoin.com/api/v1';

export async function getKucoinPrice(symbol: string): Promise<number> {
  try {
    const response = await axios.get(
      `${KUCOIN_API_URL}/market/orderbook/level1`,
      {
        params: { symbol },
      }
    );
    return parseFloat(response.data.data.price);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Kucoin API error details:',
        error.response?.data || error.message
      );
      throw new Error(`Kucoin API error: ${error.message}`);
    }
    console.error('Unexpected error:', error);
    throw new Error('Unexpected error occurred while fetching Kucoin price');
  }
}
