import React, { useState } from 'react';

interface ProfessionalTokenLogoProps {
  symbol: string;
  logo?: string;
  fallbackLogo?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6', 
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const realTokenLogos = {
  'SLERF': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/0x233df63325933fa3f2dac8e695cd84bb2f91ab07/logo.png',
  'CHONK9K': 'https://arweave.net/YrKeC_8puZ8V7dOCQEt0rG6QcEgFQ5nXrr8F0kWWzAY',
  'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  'SOL': 'https://cryptologos.cc/logos/solana-sol-logo.png',
  'BASE': 'https://cryptologos.cc/logos/base-base-logo.png',
  'USDC': 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  'USDT': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
};

const fallbackLogos = {
  'SLERF': '🌊',
  'CHONK9K': '🚀', 
  'ETH': 'Ξ',
  'SOL': '◎',
  'BASE': '🔷',
  'USDC': '💵',
  'USDT': '💰',
  'BTC': '₿'
};

export default function ProfessionalTokenLogo({ 
  symbol, 
  logo, 
  fallbackLogo, 
  size = 'md', 
  className = '' 
}: ProfessionalTokenLogoProps) {
  const [imageError, setImageError] = useState(false);
  
  const logoUrl = logo || realTokenLogos[symbol as keyof typeof realTokenLogos];
  const fallback = fallbackLogo || fallbackLogos[symbol as keyof typeof fallbackLogos] || '●';
  
  if (!logoUrl || imageError) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-xs`}>
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${symbol} logo`}
      className={`${sizeClasses[size]} ${className} rounded-full object-cover border border-gray-300/20`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}