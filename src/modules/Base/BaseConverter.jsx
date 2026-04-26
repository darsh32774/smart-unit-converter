import React, { useState, useEffect, useCallback } from 'react';
import ConverterUI from '../../components/ConverterUI';
import { CATEGORIES, UNITS } from '../../constants/data';
import { convertNumberBase } from '../../utils/ConversionUtils';

const BaseConverter = ({ activeCategory, theme }) => {
  const categoryUnits = UNITS[CATEGORIES.BASE];
  const [amount, setAmount] = useState('1010');
  const [fromUnit, setFromUnit] = useState(categoryUnits[0].id);
  const [toUnit, setToUnit] = useState(categoryUnits[1].id);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getUnitCode = useCallback(
    (id) => categoryUnits.find((u) => u.id === id)?.id || id,
    [categoryUnits],
  );

  const runConversion = useCallback(() => {
    const source = amount?.trim();
    if (!source) {
      setResult('0');
      return;
    }

    if (fromUnit === toUnit) {
      setResult(source);
      return;
    }

    setIsLoading(true);
    try {
      const converted = convertNumberBase(source, fromUnit, toUnit);
      setResult(converted);
    } catch (error) {
      console.error('Base Conversion failed:', error);
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
      inputType="default"
      isInputText
      theme={theme}
    />
  );
};

export default BaseConverter;
