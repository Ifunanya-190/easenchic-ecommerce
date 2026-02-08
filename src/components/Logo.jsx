import React from 'react';
import logoImage from '../assets/no background fabulous chic.png';

const Logo = ({ className = "", size = "default" }) => {
  const sizes = {
    small: "h-6",
    default: "h-10",
    large: "h-16"
  };

  return (
    <img 
      src={logoImage} 
      alt="fabulous chic" 
      className={`${sizes[size]} ${className} object-contain`}
    />
  );
};

export default Logo;
