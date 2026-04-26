const API_URL = 'https://open.er-api.com/v6/latest/USD';

/**
 * Fetches latest FX rates with USD base from a free, no-key endpoint.
 * Returns the base code, timestamp (ms), and the rates dictionary.
 */
export async function fetchLatestUsdRates() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Rates request failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.result !== 'success' || !data.rates) {
    throw new Error('Rates payload missing expected fields');
  }

  return {
    base: data.base_code || 'USD',
    timestamp: (data.time_last_update_unix ?? Date.now() / 1000) * 1000,
    rates: data.rates,
  };
}
