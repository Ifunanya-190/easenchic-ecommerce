import React from 'react';

// Simple flag component using country codes
const CountryFlag = ({ countryCode, size = 'md' }) => {
  // Don't render if no valid country code
  if (!countryCode || countryCode === 'XX' || countryCode === 'undefined') {
    return null;
  }

  const sizeClasses = {
    sm: 'w-5 h-4',
    md: 'w-8 h-6',
    lg: 'w-10 h-7'
  };

  // Map of country codes to flag colors/designs
  const flagStyles = {
    // Africa
    DZ: { bg: 'linear-gradient(to right, #006233 50%, white 50%)', border: true },
    AO: { bg: 'linear-gradient(to bottom, #CC092F 50%, #000000 50%)', border: true },
    BJ: { bg: 'linear-gradient(to bottom, #00853F 50%, #FCD116 50%)', border: true },
    BW: { bg: 'linear-gradient(to bottom, #75AADB 40%, white 40%, white 45%, #000000 45%, #000000 55%, white 55%, white 60%, #75AADB 60%)', border: true },
    BF: { bg: 'linear-gradient(to bottom, #EF2B2D 50%, #009E49 50%)', border: true },
    BI: { bg: 'linear-gradient(135deg, #CE1126 50%, #1EB53A 50%)', border: true },
    CM: { bg: 'linear-gradient(to right, #007A5E 33%, #CE1126 33%, #CE1126 66%, #FCD116 66%)', border: true },
    CV: { bg: 'linear-gradient(to bottom, #003893 55%, white 55%, white 62%, #CF2027 62%)', border: true },
    TD: { bg: 'linear-gradient(to right, #002664 33%, #FECB00 33%, #FECB00 66%, #C60C30 66%)', border: true },
    CG: { bg: 'linear-gradient(135deg, #009543 50%, #FBDE4A 50%)', border: true },
    DJ: { bg: 'linear-gradient(to bottom, #6AB2E7 50%, #12AD2B 50%)', border: true },
    EG: { bg: 'linear-gradient(to bottom, #C00 33%, white 33%, white 66%, #000 66%)', border: true },
    GQ: { bg: 'linear-gradient(to bottom, #3E9A00 33%, white 33%, white 66%, #E32118 66%)', border: true },
    ER: { bg: 'linear-gradient(to bottom, #12AD2B 50%, #E6273E 50%)', border: true },
    SZ: { bg: 'linear-gradient(to bottom, #3E5EB9 25%, #FDCE12 25%, #FDCE12 35%, #B10C0C 35%, #B10C0C 65%, #FDCE12 65%, #FDCE12 75%, #3E5EB9 75%)', border: true },
    ET: { bg: 'linear-gradient(to bottom, #078930 33%, #FCDD09 33%, #FCDD09 66%, #DA121A 66%)', border: true },
    GA: { bg: 'linear-gradient(to bottom, #009E60 33%, #FCD116 33%, #FCD116 66%, #3A75C4 66%)', border: true },
    GM: { bg: 'linear-gradient(to bottom, #CE1126 30%, white 30%, white 35%, #0C1C8C 35%, #0C1C8C 65%, white 65%, white 70%, #3A7728 70%)', border: true },
    GH: { bg: 'linear-gradient(to bottom, #EF3340 33%, #FCD116 33%, #FCD116 66%, #006B3D 66%)', star: true },
    GN: { bg: 'linear-gradient(to right, #CE1126 33%, #FCD116 33%, #FCD116 66%, #009460 66%)', border: true },
    CI: { bg: 'linear-gradient(to right, #F77F00 33%, white 33%, white 66%, #009E60 66%)', border: true },
    KE: { bg: 'linear-gradient(to bottom, #000000 27%, #BA0000 27%, #BA0000 73%, #006400 73%)', border: true },
    LS: { bg: 'linear-gradient(to bottom, #00209F 33%, white 33%, white 66%, #009543 66%)', border: true },
    LR: { bg: 'linear-gradient(to bottom, #BF0A30 10%, white 10%, white 20%, #BF0A30 20%, #BF0A30 30%, white 30%, white 40%, #BF0A30 40%, #BF0A30 50%, white 50%, white 60%, #BF0A30 60%)', border: true },
    LY: { bg: 'linear-gradient(to bottom, #E70013 25%, #000000 25%, #000000 75%, #239E46 75%)', border: true },
    MG: { bg: 'linear-gradient(to right, white 33%, #FC3D32 33%, #FC3D32 67%, #007E3A 67%)', border: true },
    MW: { bg: 'linear-gradient(to bottom, #000000 33%, #CE1126 33%, #CE1126 66%, #339E35 66%)', border: true },
    ML: { bg: 'linear-gradient(to right, #14B53A 33%, #FCD116 33%, #FCD116 66%, #CE1126 66%)', border: true },
    MR: { bg: 'linear-gradient(to bottom, #00732F 50%, #FFCC00 50%)', border: true },
    MU: { bg: 'linear-gradient(to bottom, #EA2839 25%, #1A206D 25%, #1A206D 50%, #FFD500 50%, #FFD500 75%, #00A04D 75%)', border: true },
    MA: { bg: '#C1272D', border: true },
    MZ: { bg: 'linear-gradient(to bottom, #009A44 33%, white 33%, white 42%, #000000 42%, #000000 58%, white 58%, white 67%, #FFCA00 67%)', border: true },
    NA: { bg: 'linear-gradient(135deg, #003580 45%, #009543 55%)', border: true },
    NE: { bg: 'linear-gradient(to bottom, #E05206 33%, white 33%, white 66%, #0DB02B 66%)', border: true },
    NG: { bg: 'linear-gradient(to right, #008751 33%, white 33%, white 66%, #008751 66%)', border: true },
    RW: { bg: 'linear-gradient(to bottom, #00A1DE 50%, #FAD201 50%, #FAD201 62%, #00A1DE 62%)', border: true },
    SN: { bg: 'linear-gradient(to right, #00853F 33%, #FDEF42 33%, #FDEF42 66%, #E31B23 66%)', border: true },
    SC: { bg: 'linear-gradient(135deg, #003F87 30%, #FCD856 30%, #FCD856 50%, #D62828 50%, #D62828 70%, white 70%)', border: true },
    SL: { bg: 'linear-gradient(to bottom, #1EB53A 33%, white 33%, white 66%, #0072C6 66%)', border: true },
    SO: { bg: 'linear-gradient(to bottom, #4189DD 50%, #4189DD 50%)', star: true },
    ZA: { bg: 'linear-gradient(to bottom, #E03C31 16%, white 16%, white 33%, #007749 33%, #007749 50%, #001489 50%, #001489 67%, #FFB81C 67%, #FFB81C 84%, #E03C31 84%)', border: true },
    SS: { bg: 'linear-gradient(to bottom, #000000 33%, white 33%, white 45%, #DA121A 45%, #DA121A 55%, white 55%, white 67%, #078930 67%)', border: true },
    SD: { bg: 'linear-gradient(to bottom, #D21034 33%, white 33%, white 66%, #000000 66%)', border: true },
    TZ: { bg: 'linear-gradient(135deg, #1EB53A 40%, #000000 40%, #000000 45%, #FCD116 45%, #FCD116 55%, #000000 55%, #000000 60%, #00A3DD 60%)', border: true },
    TG: { bg: 'linear-gradient(to bottom, #FFCE00 20%, #118600 20%, #118600 40%, #FFCE00 40%, #FFCE00 60%, #118600 60%, #118600 80%, #FFCE00 80%)', border: true },
    TN: { bg: '#E70013', border: true },
    UG: { bg: 'linear-gradient(to bottom, #000000 17%, #FCDC04 17%, #FCDC04 33%, #D90000 33%, #D90000 50%, #000000 50%, #000000 67%, #FCDC04 67%, #FCDC04 83%, #D90000 83%)', border: true },
    ZM: { bg: 'linear-gradient(to bottom, #198A00 67%, #000000 67%, #000000 78%, #EF7D00 78%, #EF7D00 89%, #DE2010 89%)', border: true },
    ZW: { bg: 'linear-gradient(to bottom, #319B42 14%, white 14%, white 29%, #FFD200 29%, #FFD200 43%, #000000 43%, #000000 57%, #FFD200 57%, #FFD200 71%, white 71%, white 86%, #319B42 86%)', border: true },
    
    // Americas
    AR: { bg: 'linear-gradient(to bottom, #74ACDF 33%, white 33%, white 66%, #74ACDF 66%)', border: true },
    BB: { bg: 'linear-gradient(to right, #00267F 33%, #FFC726 33%, #FFC726 66%, #00267F 66%)', border: true },
    BR: { bg: 'linear-gradient(135deg, #009B3A 50%, #FEDF00 50%)', border: true },
    CA: { bg: 'linear-gradient(to right, #FF0000 33%, white 33%, white 66%, #FF0000 66%)', maple: true },
    CL: { bg: 'linear-gradient(to bottom, white 50%, #D52B1E 50%)', border: true },
    CO: { bg: 'linear-gradient(to bottom, #FCD116 50%, #003893 50%, #003893 75%, #CE1126 75%)', border: true },
    JM: { bg: 'linear-gradient(135deg, #009B3A 45%, #FED100 45%, #FED100 55%, #000000 55%)', border: true },
    MX: { bg: 'linear-gradient(to right, #006847 33%, white 33%, white 66%, #CE1126 66%)', border: true },
    PE: { bg: 'linear-gradient(to right, #D91023 33%, white 33%, white 66%, #D91023 66%)', border: true },
    TT: { bg: 'linear-gradient(135deg, #CE1126 45%, #000000 45%, #000000 55%, white 55%)', border: true },
    US: { bg: 'linear-gradient(to bottom, #B22234 8%, white 8%, white 15%, #B22234 15%, #B22234 23%, white 23%, white 31%, #B22234 31%, #B22234 38%, white 38%, white 46%, #B22234 46%, #B22234 54%, white 54%, white 62%, #B22234 62%, #B22234 69%, white 69%, white 77%, #B22234 77%, #B22234 85%, white 85%, white 92%, #B22234 92%)', canton: true },
    
    // Europe
    AT: { bg: 'linear-gradient(to bottom, #ED2939 33%, white 33%, white 66%, #ED2939 66%)', border: true },
    BE: { bg: 'linear-gradient(to right, #000000 33%, #FDDA24 33%, #FDDA24 66%, #EF3340 66%)', border: true },
    CH: { bg: '#FF0000', border: true },
    DK: { bg: '#C60C30', border: true },
    FI: { bg: 'white', border: true },
    FR: { bg: 'linear-gradient(to right, #002395 33%, white 33%, white 66%, #ED2939 66%)', border: true },
    DE: { bg: 'linear-gradient(to bottom, #000000 33%, #DD0000 33%, #DD0000 66%, #FFCE00 66%)', border: true },
    GB: { bg: '#012169', cross: true },
    GR: { bg: 'linear-gradient(to bottom, #0D5EAF 11%, white 11%, white 22%, #0D5EAF 22%, #0D5EAF 33%, white 33%, white 44%, #0D5EAF 44%, #0D5EAF 56%, white 56%, white 67%, #0D5EAF 67%, #0D5EAF 78%, white 78%, white 89%, #0D5EAF 89%)', border: true },
    IT: { bg: 'linear-gradient(to right, #009246 33%, white 33%, white 66%, #CE2B37 66%)', border: true },
    NL: { bg: 'linear-gradient(to bottom, #C8102E 33%, white 33%, white 66%, #003DA5 66%)', border: true },
    NO: { bg: 'linear-gradient(to bottom, #BA0C2F 40%, white 40%, white 45%, #00205B 45%, #00205B 55%, white 55%, white 60%, #BA0C2F 60%)', border: true },
    PL: { bg: 'linear-gradient(to bottom, white 50%, #DC143C 50%)', border: true },
    PT: { bg: 'linear-gradient(to right, #006600 40%, #FF0000 40%)', border: true },
    RU: { bg: 'linear-gradient(to bottom, white 33%, #0039A6 33%, #0039A6 66%, #D52B1E 66%)', border: true },
    ES: { bg: 'linear-gradient(to bottom, #C60B1E 25%, #FFC400 25%, #FFC400 75%, #C60B1E 75%)', border: true },
    SE: { bg: 'linear-gradient(to bottom, #006AA7 40%, #FECC00 40%, #FECC00 50%, #006AA7 50%)', border: true },
    TR: { bg: '#E30A17', border: true },
    UA: { bg: 'linear-gradient(to bottom, #0057B7 50%, #FFD700 50%)', border: true },
    
    // Asia
    AE: { bg: 'linear-gradient(to bottom, #00732F 33%, white 33%, white 66%, #000000 66%)', border: true },
    CN: { bg: '#DE2910', star: true },
    ID: { bg: 'linear-gradient(to bottom, #FF0000 50%, white 50%)', border: true },
    IN: { bg: 'linear-gradient(to bottom, #FF9933 33%, white 33%, white 66%, #138808 66%)', border: true },
    JP: { bg: 'white', circle: true, border: true },
    KR: { bg: 'white', border: true },
    KW: { bg: 'linear-gradient(to bottom, #007A3D 33%, white 33%, white 66%, #CE1126 66%)', border: true },
    MY: { bg: 'linear-gradient(to bottom, #CC0001 7%, white 7%, white 14%, #CC0001 14%, #CC0001 21%, white 21%, white 29%, #CC0001 29%, #CC0001 36%, white 36%, white 43%, #CC0001 43%, #CC0001 50%, white 50%, white 57%, #CC0001 57%)', border: true },
    PH: { bg: 'linear-gradient(to bottom, #0038A8 50%, #CE1126 50%)', border: true },
    QA: { bg: 'linear-gradient(to right, white 30%, #8D1B3D 30%)', border: true },
    SA: { bg: '#006C35', border: true },
    SG: { bg: 'linear-gradient(to bottom, #ED2939 50%, white 50%)', border: true },
    TH: { bg: 'linear-gradient(to bottom, #A51931 17%, white 17%, white 33%, #2D2A4A 33%, #2D2A4A 67%, white 67%, white 83%, #A51931 83%)', border: true },
    VN: { bg: '#DA251D', star: true },
    
    // Oceania
    AU: { bg: '#00008B', stars: true },
    NZ: { bg: '#00247D', stars: true }
  };

  const flagStyle = flagStyles[countryCode] || {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-sm overflow-hidden relative inline-block ${flagStyle.border ? 'border border-gray-300' : ''}`}
      style={{ 
        background: flagStyle.bg,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      title={countryCode}
    >
      {flagStyle.star && countryCode === 'GH' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="black">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      )}
      {!flagStyle.star && !flagStyle.cross && !flagStyle.canton && !flagStyle.maple && (
        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white opacity-60">
          {countryCode}
        </span>
      )}
    </div>
  );
};

export default CountryFlag;
