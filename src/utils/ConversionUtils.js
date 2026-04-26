/**
 * Standard linear conversion (Distance/Weight).
 * Converts amount from fromUnit to base unit (factor) then to toUnit.
 */
export const performStandardConversion = (amount, fromUnit, toUnit, units) => {
  const fromFactor = units.find((u) => u.id === fromUnit)?.factor;
  const toFactor = units.find((u) => u.id === toUnit)?.factor;

  if (!fromFactor || !toFactor) return '---';

  const baseValue = amount * fromFactor;
  const res = baseValue / toFactor;
  return parseFloat(res.toFixed(6)).toString();
};

/**
 * Temperature conversion helpers.
 */
export const performTemperatureConversion = (amount, fromUnit, toUnit) => {
  let val = amount;
  if (fromUnit === toUnit) return val.toString();

  let celsius;
  if (fromUnit === 'c') celsius = val;
  else if (fromUnit === 'f') celsius = (val - 32) * (5 / 9);
  else if (fromUnit === 'k') celsius = val - 273.15;
  else return '---';

  let res;
  if (toUnit === 'c') res = celsius;
  else if (toUnit === 'f') res = celsius * (9 / 5) + 32;
  else if (toUnit === 'k') res = celsius + 273.15;
  else return '---';

  return parseFloat(res.toFixed(4)).toString();
};

export const DEFAULT_FOREX_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 146.11,
  AUD: 1.5,
  CAD: 1.37,
  CHF: 0.87,
  CNY: 7.23,
  HKD: 7.81,
  SGD: 1.34,
  INR: 83.2,
};

/**
 * Offline currency conversion using a USD reference table.
 */
export const performCurrencyConversion = (
  amount,
  fromCurrency,
  toCurrency,
  rateTable = DEFAULT_FOREX_RATES,
) => {
  const fromRate = rateTable[fromCurrency];
  const toRate = rateTable[toCurrency];
  if (!fromRate || !toRate) return '---';

  const amountInUsd = amount / fromRate;
  const converted = amountInUsd * toRate;
  return converted.toFixed(2);
};

/**
 * Simple base conversion for bases between 2 and 36.
 */
export const convertNumberBase = (value, fromBase, toBase) => {
  if (fromBase === toBase) return value;
  const sanitized = value?.trim();
  if (!sanitized) return '0';

  const parsed = parseInt(sanitized, Number(fromBase));
  if (Number.isNaN(parsed)) return 'Invalid Input';

  return parsed.toString(Number(toBase)).toUpperCase();
};
