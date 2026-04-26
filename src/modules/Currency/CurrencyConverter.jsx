import React, { useState, useEffect, useCallback } from 'react';
import ConverterUI from '../../components/ConverterUI';
import { CATEGORIES, UNITS } from '../../constants/data';
import { performCurrencyConversion, DEFAULT_FOREX_RATES } from '../../utils/ConversionUtils';
import { fetchLatestUsdRates } from '../../api/ExchangeRates';

const CurrencyConverter = ({ activeCategory, theme }) => {
  const categoryUnits = UNITS[CATEGORIES.CURRENCY];
  const [amount, setAmount] = useState('100.00');
  const [fromUnit, setFromUnit] = useState(categoryUnits[0].id);
  const [toUnit, setToUnit] = useState(categoryUnits[1].id);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateNote, setRateNote] = useState('Loading live rates…');
  const [rates, setRates] = useState(DEFAULT_FOREX_RATES);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  const getUnitCode = useCallback(
    (id) => categoryUnits.find((u) => u.id === id)?.id || id,
    [categoryUnits],
  );

  const refreshRates = useCallback(async () => {
    setIsRefreshingRates(true);
    setRateNote('Refreshing live rates…');
    try {
      const { rates: latestRates, timestamp } = await fetchLatestUsdRates();
      setRates((current) => ({ ...current, ...latestRates }));
      setRateNote(`Rates updated ${new Date(timestamp).toLocaleString()} • Tap to refresh`);
    } catch (error) {
      console.warn('Currency rates refresh failed', error);
      setRateNote('Using fallback offline rates • Tap to try again');
    } finally {
      setIsRefreshingRates(false);
    }
  }, []);

  const runConversion = useCallback(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || fromUnit === toUnit) {
      setResult(amount || '---');
      return;
    }

    setIsLoading(true);
    try {
      const res = performCurrencyConversion(val, fromUnit, toUnit, rates);
      setResult(res);
    } catch (error) {
      console.error('Currency Conversion failed:', error);
      setResult('Conversion Failed');
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromUnit, toUnit, rates]);

  useEffect(() => {
    refreshRates();
  }, [refreshRates]);

  useEffect(() => {
    runConversion();
  }, [amount, fromUnit, toUnit, runConversion]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <ConverterUI
      category={activeCategory}
      amount={amount}
      setAmount={setAmount}
      fromUnit={fromUnit}
      setFromUnit={setFromUnit}
      toUnit={toUnit}
      setToUnit={setToUnit}
      result={result}
      isLoading={isLoading}
      swapUnits={swapUnits}
      categoryUnits={categoryUnits}
      getUnitCode={getUnitCode}
      inputType="number"
      isInputText={false}
      isCurrency
      rateNote={rateNote}
      onRateNotePress={isRefreshingRates ? undefined : refreshRates}
      theme={theme}
    />
  );
};

export default CurrencyConverter;
