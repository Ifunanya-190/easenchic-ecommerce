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
  UGX: { symbol: 'USh', name: 'Shilling', rate: 4.5, code: 'UGX', country: 'Uganda', countryCode: 'UGX' },
  MAD: { symbol: 'DH', name: 'Dirham', rate: 0.012, code: 'MAD', country: 'Morocco', countryCode: 'MA' },
  TND: { symbol: 'DT', name: 'Dinar', rate: 0.0038, code: 'TND', country: 'Tunisia', countryCode: 'TN' },
  DZD: { symbol: 'DA', name: 'Dinar', rate: 0.16, code: 'DZD', country: 'Algeria', countryCode: 'DZ' },
  // Additional African currencies
  BWP: { symbol: 'P', name: 'Pula', rate: 0.016, code: 'BWP', country: 'Botswana', countryCode: 'BW' },
  ZMW: { symbol: 'ZK', name: 'Kwacha', rate: 0.032, code: 'ZMW', country: 'Zambia', countryCode: 'ZM' },
  ZWL: { symbol: 'Z$', name: 'Dollar', rate: 0.48, code: 'ZWL', country: 'Zimbabwe', countryCode: 'ZW' },
  MWK: { symbol: 'MK', name: 'Kwacha', rate: 1.25, code: 'MWK', country: 'Malawi', countryCode: 'MW' },
  MZN: { symbol: 'MT', name: 'Metical', rate: 0.076, code: 'MZN', country: 'Mozambique', countryCode: 'MZ' },
  NAD: { symbol: 'N$', name: 'Dollar', rate: 0.022, code: 'NAD', country: 'Namibia', countryCode: 'NA' },
  RWF: { symbol: 'RF', name: 'Franc', rate: 1.53, code: 'RWF', country: 'Rwanda', countryCode: 'RW' },
  // Asian currencies
  THB: { symbol: '฿', name: 'Baht', rate: 0.042, code: 'THB', country: 'Thailand', countryCode: 'TH' },
  MYR: { symbol: 'RM', name: 'Ringgit', rate: 0.0056, code: 'MYR', country: 'Malaysia', countryCode: 'MY' },
  SGD: { symbol: 'S$', name: 'Dollar', rate: 0.0016, code: 'SGD', country: 'Singapore', countryCode: 'SG' },
  IDR: { symbol: 'Rp', name: 'Rupiah', rate: 19, code: 'IDR', country: 'Indonesia', countryCode: 'ID' },
  PHP: { symbol: '₱', name: 'Peso', rate: 0.069, code: 'PHP', country: 'Philippines', countryCode: 'PH' },
  VND: { symbol: '₫', name: 'Dong', rate: 30, code: 'VND', country: 'Vietnam', countryCode: 'VN' },
  KRW: { symbol: '₩', name: 'Won', rate: 1.6, code: 'KRW', country: 'South Korea', countryCode: 'KR' },
  PKR: { symbol: '₨', name: 'Rupee', rate: 0.34, code: 'PKR', country: 'Pakistan', countryCode: 'PK' },
  BDT: { symbol: '৳', name: 'Taka', rate: 0.13, code: 'BDT', country: 'Bangladesh', countryCode: 'BD' },
  // South American currencies
  CLP: { symbol: '$', name: 'Peso', rate: 1.15, code: 'CLP', country: 'Chile', countryCode: 'CL' },
  COP: { symbol: '$', name: 'Peso', rate: 4.85, code: 'COP', country: 'Colombia', countryCode: 'CO' },
  PEN: { symbol: 'S/', name: 'Sol', rate: 0.0045, code: 'PEN', country: 'Peru', countryCode: 'PE' },
  // European currencies
  CHF: { symbol: 'Fr', name: 'Franc', rate: 0.0011, code: 'CHF', country: 'Switzerland', countryCode: 'CH' },
  NOK: { symbol: 'kr', name: 'Krone', rate: 0.013, code: 'NOK', country: 'Norway', countryCode: 'NO' },
  SEK: { symbol: 'kr', name: 'Krona', rate: 0.013, code: 'SEK', country: 'Sweden', countryCode: 'SE' },
  DKK: { symbol: 'kr', name: 'Krone', rate: 0.0082, code: 'DKK', country: 'Denmark', countryCode: 'DK' },
  PLN: { symbol: 'zł', name: 'Złoty', rate: 0.0047, code: 'PLN', country: 'Poland', countryCode: 'PL' },
  // Middle East
  KWD: { symbol: 'KD', name: 'Dinar', rate: 0.00037, code: 'KWD', country: 'Kuwait', countryCode: 'KW' },
  QAR: { symbol: 'QR', name: 'Riyal', rate: 0.0044, code: 'QAR', country: 'Qatar', countryCode: 'QA' },
  // Oceania
  NZD: { symbol: 'NZ$', name: 'Dollar', rate: 0.002, code: 'NZD', country: 'New Zealand', countryCode: 'NZ' },
};

// Map country codes to currency codes
export const countryCurrencyMap = {
  // Africa
  NG: 'NGN', GH: 'GHS', ZA: 'ZAR', KE: 'KES', EG: 'EGP', ET: 'ETB', TZ: 'TZS', UG: 'UGX',
  MA: 'MAD', TN: 'TND', DZD: 'DZ', AO: 'AOA', 
  CM: 'XAF', CG: 'XAF', GA: 'XAF', TD: 'XAF', CF: 'XAF', GQ: 'XAF', // Central African CFA
  CI: 'XOF', SN: 'XOF', BJ: 'XOF', BF: 'XOF', ML: 'XOF', NE: 'XOF', TG: 'XOF', // West African CFA
  BW: 'BWP', ZM: 'ZMW', ZW: 'ZWL', MW: 'MWK', MZ: 'MZN', NA: 'NAD', RW: 'RWF',
  LS: 'ZAR', // Lesotho uses South African Rand
  // Europe
  FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', PT: 'EUR', GR: 'EUR', FI: 'EUR',
  AT: 'EUR', IE: 'EUR', LU: 'EUR', SI: 'EUR', SK: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR', // Euro countries
  GB: 'GBP', CH: 'CHF', NO: 'NOK', SE: 'SEK', DK: 'DKK', PL: 'PLN',
  RU: 'USD', UA: 'USD', TR: 'USD', // Default to USD for these
  // Americas
  US: 'USD', CA: 'CAD', BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
  BB: 'USD', JM: 'USD', TT: 'USD', // Caribbean - USD
  // Asia
  CN: 'CNY', IN: 'INR', JP: 'JPY', SA: 'SAR', AE: 'AED',
  KW: 'KWD', QA: 'QAR', ID: 'IDR', MY: 'MYR', SG: 'SGD', TH: 'THB', VN: 'VND', PH: 'PHP', KR: 'KRW',
  PK: 'PKR', BD: 'BDT',
  // Oceania
  AU: 'AUD', NZ: 'NZD',
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
