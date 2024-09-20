import axios from 'axios';

const MEXC_API_URL = 'https://api.mexc.com/api/v3';

export async function getMEXCPrice(symbol: string): Promise<number> {
  try {
    const response = await axios.get(`${MEXC_API_URL}/ticker/price`, {
      params: { symbol },
      timeout: 5000, // Set a timeout of 5 seconds
    });
    const price = parseFloat(response.data.price);
    if (isNaN(price)) {
      throw new Error('Invalid price received from MEXC API');
    }
    return price;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'MEXC API error details:',
        error.response?.data || error.message
      );
      if (error.code === 'ECONNABORTED') {
        console.error('MEXC API request timed out');
      }
      throw new Error(`MEXC API error: ${error.message}`);
    }
    console.error('Unexpected error:', error);
    throw new Error('Unexpected error occurred while fetching MEXC price');
  }
}
