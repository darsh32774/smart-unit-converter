import React, { useState, useEffect, useCallback } from 'react';
import ConverterUI from '../../components/ConverterUI';
import { CATEGORIES, UNITS } from '../../constants/data';
import { performStandardConversion } from '../../utils/ConversionUtils';

const DistanceConverter = ({ activeCategory, theme }) => {
  const categoryUnits = UNITS[CATEGORIES.DISTANCE];
  const [amount, setAmount] = useState('100');
  const [fromUnit, setFromUnit] = useState(categoryUnits[0].id);
  const [toUnit, setToUnit] = useState(categoryUnits[1].id);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getUnitCode = useCallback(
    (id) => categoryUnits.find((u) => u.id === id)?.id || id,
    [categoryUnits],
  );

  const runConversion = useCallback(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || fromUnit === toUnit) {
      setResult(amount || '---');
      return;
    }

    setIsLoading(true);
    try {
      const res = performStandardConversion(val, fromUnit, toUnit, categoryUnits);
      setResult(res);
    } catch (error) {
      console.error('Distance Conversion failed:', error);
      setResult('Conversion Failed');
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromUnit, toUnit, categoryUnits]);

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
      inputType="numeric"
      isInputText={false}
      theme={theme}
    />
  );
};

export default DistanceConverter;
