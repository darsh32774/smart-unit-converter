import React, { useState, useEffect, useCallback } from 'react';
import ConverterUI from '../../components/ConverterUI';
import { CATEGORIES } from '../../constants/data';
import { performTemperatureConversion } from '../../utils/ConversionUtils';

// Component that handles the UI and logic for Temperature conversion
const TemperatureConverter = ({ activeCategory, units, theme }) => {
  const categoryUnits = units;
  const [amount, setAmount] = useState('25');
  const [fromUnit, setFromUnit] = useState(categoryUnits[1].id); // Default to Celsius
  const [toUnit, setToUnit] = useState(categoryUnits[2].id);   // Default to Fahrenheit
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getUnitCode = useCallback((id) => {
    return categoryUnits.find(u => u.id === id)?.id || id;
  }, [categoryUnits]);

  // Main Conversion Logic for Temperature (uses standard utility)
  const runConversion = useCallback(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || fromUnit === toUnit) {
        setResult(amount || '---');
        return;
    }

    setIsLoading(true);
    let res = '---';
    try {
      res = performTemperatureConversion(val, fromUnit, toUnit);
    } catch (e) {
      console.error("Temperature Conversion failed:", e);
      res = "Conversion Failed";
    }
    setResult(res);
    setIsLoading(false);
  }, [amount, fromUnit, toUnit]);

  useEffect(() => {
    runConversion();
  }, [amount, fromUnit, toUnit, runConversion]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
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
      inputType={'number'}
      isInputText={false}
      theme={theme}
    />
  );
};

export default TemperatureConverter;
