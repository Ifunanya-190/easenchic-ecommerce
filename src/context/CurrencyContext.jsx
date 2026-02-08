import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Currency conversion rates (base: NGN - Nigerian Naira)
export const currencyData = {
  NGN: { symbol: '₦', name: 'Naira', rate: 1, code: 'NGN', country: 'Nigeria', countryCode: 'NG' },
  GHS: { symbol: '₵', name: 'Cedi', rate: 0.055, code: 'GHS', country: 'Ghana', countryCode: 'GH' },
  USD: { symbol: '$', name: 'Dollar', rate: 0.0012, code: 'USD', country: 'United States', countryCode: 'US' },
  CAD: { symbol: 'C$', name: 'Dollar', rate: 0.0016, code: 'CAD', country: 'Canada', countryCode: 'CA' },
  GBP: { symbol: '£', name: 'Pound', rate: 0.00095, code: 'GBP', country: 'United Kingdom', countryCode: 'GB' },
  EUR: { symbol: '€', name: 'Euro', rate: 0.0011, code: 'EUR', country: 'Eurozone', countryCode: 'EU' },
  ZAR: { symbol: 'R', name: 'Rand', rate: 0.022, code: 'ZAR', country: 'South Africa', countryCode: 'ZA' },
  KES: { symbol: 'KSh', name: 'Shilling', rate: 0.15, code: 'KES', country: 'Kenya', countryCode: 'KE' },
  EGP: { symbol: 'E£', name: 'Pound', rate: 0.038, code: 'EGP', country: 'Egypt', countryCode: 'EG' },
  AUD: { symbol: 'A$', name: 'Dollar', rate: 0.0018, code: 'AUD', country: 'Australia', countryCode: 'AU' },
  BRL: { symbol: 'R$', name: 'Real', rate: 0.0061, code: 'BRL', country: 'Brazil', countryCode: 'BR' },
  MXN: { symbol: '$', name: 'Peso', rate: 0.021, code: 'MXN', country: 'Mexico', countryCode: 'MX' },
  ARS: { symbol: '$', name: 'Peso', rate: 1.2, code: 'ARS', country: 'Argentina', countryCode: 'AR' },
  CNY: { symbol: '¥', name: 'Yuan', rate: 0.0086, code: 'CNY', country: 'China', countryCode: 'CN' },
  INR: { symbol: '₹', name: 'Rupee', rate: 0.10, code: 'INR', country: 'India', countryCode: 'IN' },
  JPY: { symbol: '¥', name: 'Yen', rate: 0.18, code: 'JPY', country: 'Japan', countryCode: 'JP' },
  SAR: { symbol: 'SR', name: 'Riyal', rate: 0.0045, code: 'SAR', country: 'Saudi Arabia', countryCode: 'SA' },
  AED: { symbol: 'د.إ', name: 'Dirham', rate: 0.0044, code: 'AED', country: 'UAE', countryCode: 'AE' },
  AOA: { symbol: 'Kz', name: 'Kwanza', rate: 1.02, code: 'AOA', country: 'Angola', countryCode: 'AO' },
  XAF: { symbol: 'FCFA', name: 'Franc', rate: 0.72, code: 'XAF', country: 'Central Africa', countryCode: 'CM' },
  XOF: { symbol: 'CFA', name: 'Franc', rate: 0.72, code: 'XOF', country: 'West Africa', countryCode: 'CI' },
  ETB: { symbol: 'Br', name: 'Birr', rate: 0.068, code: 'ETB', country: 'Ethiopia', countryCode: 'ET' },
  TZS: { symbol: 'TSh', name: 'Shilling', rate: 2.8, code: 'TZS', country: 'Tanzania', countryCode: 'TZ' },
  UGX: { symbol: 'USh', name: 'Shilling', rate: 4.5, code: 'UGX', country: 'Uganda', countryCode: 'UG' },
  MAD: { symbol: 'DH', name: 'Dirham', rate: 0.012, code: 'MAD', country: 'Morocco', countryCode: 'MA' },
  TND: { symbol: 'DT', name: 'Dinar', rate: 0.0038, code: 'TND', country: 'Tunisia', countryCode: 'TN' },
  DZD: { symbol: 'DA', name: 'Dinar', rate: 0.16, code: 'DZD', country: 'Algeria', countryCode: 'DZ' },
};

// Map country codes to currency codes
export const countryCurrencyMap = {
  // Africa
  NG: 'NGN', GH: 'GHS', ZA: 'ZAR', KE: 'KES', EG: 'EGP', ET: 'ETB', TZ: 'TZS', UG: 'UGX',
  MA: 'MAD', TN: 'TND', DZ: 'DZD', AO: 'AOA', 
  CM: 'XAF', CG: 'XAF', GA: 'XAF', TD: 'XAF', CF: 'XAF', GQ: 'XAF', // Central African CFA
  CI: 'XOF', SN: 'XOF', BJ: 'XOF', BF: 'XOF', ML: 'XOF', NE: 'XOF', TG: 'XOF', // West African CFA
  BW: 'USD', LS: 'USD', MW: 'USD', MZ: 'USD', NA: 'USD', ZM: 'USD', ZW: 'USD', // Default to USD
  RW: 'USD', BI: 'USD', DJ: 'USD', ER: 'USD', SO: 'USD', SS: 'USD', SD: 'USD', // Default to USD
  GM: 'USD', GN: 'USD', LR: 'USD', SL: 'USD', MR: 'USD', CV: 'USD', // Default to USD
  SC: 'USD', MU: 'USD', MG: 'USD', // Default to USD
  // Europe
  FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', PT: 'EUR', GR: 'EUR', FI: 'EUR',
  AT: 'EUR', IE: 'EUR', // Euro countries
  GB: 'GBP', // UK
  CH: 'EUR', NO: 'EUR', SE: 'EUR', DK: 'EUR', PL: 'EUR', // Default to EUR
  RU: 'USD', UA: 'USD', TR: 'USD', // Default to USD
  // Americas
  US: 'USD', CA: 'CAD', BR: 'BRL', MX: 'MXN', AR: 'ARS',
  CL: 'USD', CO: 'USD', PE: 'USD', // Default to USD
  BB: 'USD', JM: 'USD', TT: 'USD', // Caribbean - USD
  // Asia
  CN: 'CNY', IN: 'INR', JP: 'JPY', SA: 'SAR', AE: 'AED',
  KW: 'USD', QA: 'USD', ID: 'USD', MY: 'USD', SG: 'USD', TH: 'USD', VN: 'USD', PH: 'USD', KR: 'USD',
  // Oceania
  AU: 'AUD', NZ: 'AUD',
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('easenchic_currency') || 'NGN';
  });

  useEffect(() => {
    localStorage.setItem('easenchic_currency', selectedCurrency);
  }, [selectedCurrency]);

  const convertPrice = (priceInNGN) => {
    const currency = currencyData[selectedCurrency];
    const convertedPrice = priceInNGN * currency.rate;
    return Math.round(convertedPrice);
  };

  const formatPrice = (priceInNGN) => {
    const currency = currencyData[selectedCurrency];
    const convertedPrice = convertPrice(priceInNGN);
    return `${currency.symbol}${convertedPrice.toLocaleString()}`;
  };

  const changeCurrencyByCountry = (countryCode) => {
    const currencyCode = countryCurrencyMap[countryCode] || 'USD';
    setSelectedCurrency(currencyCode);
  };

  const getCurrencyInfo = () => {
    return currencyData[selectedCurrency];
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        formatPrice,
        changeCurrencyByCountry,
        getCurrencyInfo,
        currencyData,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
