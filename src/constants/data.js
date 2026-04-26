import { Ruler, Weight, Thermometer, DollarSign, Binary } from 'lucide-react-native';

export const CATEGORIES = {
  DISTANCE: 'Distance',
  WEIGHT: 'Weight',
  TEMPERATURE: 'Temperature',
  CURRENCY: 'Currency',
  BASE: 'Base',
};

// Store the component reference (function/class), not the instantiated JSX element.
export const ICONS = {
  [CATEGORIES.DISTANCE]: Ruler,
  [CATEGORIES.WEIGHT]: Weight,
  [CATEGORIES.TEMPERATURE]: Thermometer,
  [CATEGORIES.CURRENCY]: DollarSign,
  [CATEGORIES.BASE]: Binary,
};

export const UNITS = {
  [CATEGORIES.DISTANCE]: [
    { id: 'mm', label: 'Millimetre (mm)', factor: 0.001 },
    { id: 'cm', label: 'Centimetre (cm)', factor: 0.01 },
    { id: 'in', label: 'Inch (in)', factor: 0.0254 },
    { id: 'yd', label: 'Yard (yd)', factor: 0.9144 },
    { id: 'ft', label: 'Foot (ft)', factor: 0.3048 },
    { id: 'm', label: 'Metre (m)', factor: 1 },
    { id: 'km', label: 'Kilometre (km)', factor: 1000 },
    { id: 'mi', label: 'Mile (mi)', factor: 1609.34 },
    { id: 'nmi', label: 'Nautical Mile (nmi)', factor: 1852 },
  ],
  [CATEGORIES.WEIGHT]: [
    { id: 'mg', label: 'Milligram (mg)', factor: 0.000001 },
    { id: 'carat', label: 'Carat (ct)', factor: 0.0002 },
    { id: 'g', label: 'Gram (g)', factor: 0.001 },
    { id: 'oz', label: 'Ounce (oz)', factor: 0.0283495 },
    { id: 'lb', label: 'Pound (lb)', factor: 0.453592 },
    { id: 'kg', label: 'Kilogram (kg)', factor: 1 },
    { id: 'st', label: 'Stone (st)', factor: 6.35029 },
    { id: 't', label: 'Tonne (t)', factor: 1000 },
  ],
  [CATEGORIES.TEMPERATURE]: [
    { id: 'k', label: 'Kelvin (K)' },
    { id: 'c', label: 'Celcius (°C)' },
    { id: 'f', label: 'Fahrenheit (°F)' },
  ],
  [CATEGORIES.CURRENCY]: [
    { id: 'USD', label: 'U.S. Dollar' },
    { id: 'INR', label: 'Indian Rupee' },
    { id: 'EUR', label: 'Euro' },
    { id: 'JPY', label: 'Japanese Yen' },
    { id: 'GBP', label: 'Sterling (Pound)' },
    { id: 'CNY', label: 'Chinese Yuan' },
    { id: 'AUD', label: 'Australian Dollar' },
    { id: 'CAD', label: 'Canadian Dollar' },
    { id: 'CHF', label: 'Swiss Franc' },
    { id: 'HKD', label: 'Hong Kong Dollar' },
    { id: 'SGD', label: 'Singapore Dollar' },
  ],
  [CATEGORIES.BASE]: [
    { id: 10, label: 'Base 10 (Decimal)' },
    { id: 2, label: 'Base 2 (Binary)' },
    { id: 16, label: 'Base 16 (Hexadecimal)' },
    { id: 8, label: 'Base 8 (Octal)' },
    // Include a few more bases for completeness
    ...Array.from({ length: 33 }, (_, i) => i + 4).filter(b => b !== 8 && b !== 10 && b !== 16).map(b => ({
      id: b,
      label: `Base ${b}`
    })).sort((a, b) => a.id - b.id)
  ],
};
