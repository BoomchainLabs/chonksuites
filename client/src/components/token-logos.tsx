import React from 'react';
import { motion } from 'framer-motion';

import slerfLogo from '@assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg';
import chonkLogo from '@assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg';

// Real token logo URLs
export const TOKEN_LOGOS = {
  SLERF: slerfLogo,
  CHONK9K: chonkLogo,
  BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
};

interface TokenLogoProps {
  symbol: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const TokenLogo: React.FC<TokenLogoProps> = ({ 
  symbol, 
  size = 'md', 
  animated = false, 
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const logoUrl = TOKEN_LOGOS[symbol as keyof typeof TOKEN_LOGOS];
  const fallbackUrl = `https://via.placeholder.com/40/6366f1/ffffff?text=${symbol}`;

  const LogoComponent = animated ? motion.img : 'img';
  const animationProps = animated ? {
    whileHover: { scale: 1.1 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {};

  return (
    <LogoComponent
      src={logoUrl}
      alt={`${symbol} logo`}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallbackUrl;
      }}
      {...animationProps}
    />
  );
};

interface SlerfLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  showText?: boolean;
}

export const SlerfLogo: React.FC<SlerfLogoProps> = ({ 
  size = 'md', 
  animated = false, 
  className = '',
  showText = false
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const LogoWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    animate: { 
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(139, 92, 246, 0.4)',
        '0 0 0 8px rgba(139, 92, 246, 0)',
        '0 0 0 0 rgba(139, 92, 246, 0)'
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  } : {};

  return (
    <LogoWrapper 
      className={`flex items-center space-x-2 ${className}`}
      {...animationProps}
    >
      <div className={`${sizeClasses[size]} relative`}>
        <img
          src={TOKEN_LOGOS.SLERF}
          alt="SLERF Token"
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-purple-400/30`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40/8b5cf6/ffffff?text=SLERF';
          }}
        />
      </div>
      {showText && (
        <span className={`font-bold text-purple-400 ${textSizeClasses[size]}`}>
          SLERF
        </span>
      )}
    </LogoWrapper>
  );
};

interface ChonkLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  showText?: boolean;
}

export const ChonkLogo: React.FC<ChonkLogoProps> = ({ 
  size = 'md', 
  animated = false, 
  className = '',
  showText = false
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const LogoWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    animate: { 
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(6, 182, 212, 0.4)',
        '0 0 0 8px rgba(6, 182, 212, 0)',
        '0 0 0 0 rgba(6, 182, 212, 0)'
      ]
    },
    transition: { duration: 2.5, repeat: Infinity }
  } : {};

  return (
    <LogoWrapper 
      className={`flex items-center space-x-2 ${className}`}
      {...animationProps}
    >
      <div className={`${sizeClasses[size]} relative`}>
        <img
          src={TOKEN_LOGOS.CHONK9K}
          alt="CHONKPUMP 9000"
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-cyan-400/30`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40/06b6d4/ffffff?text=C9K';
          }}
        />
      </div>
      {showText && (
        <span className={`font-bold text-cyan-400 ${textSizeClasses[size]}`}>
          CHONK9K
        </span>
      )}
    </LogoWrapper>
  );
};

export default TokenLogo;