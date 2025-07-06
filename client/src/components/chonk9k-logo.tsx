import { useEffect, useState } from "react";
import chonk9kLogo from "@assets/DFDB54CF-60F6-4C29-8DDF-B091610D6470_1751800023515.png";

interface Chonk9kLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

export default function Chonk9kLogo({ size = "md", animated = true, className = "" }: Chonk9kLogoProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 }
  };

  const { width, height } = sizeMap[size];

  useEffect(() => {
    if (animated) {
      setIsVisible(true);
    }
  }, [animated]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <img 
        src={chonk9kLogo}
        alt="Chonk9k Suite Logo"
        width={width}
        height={height}
        className={`
          transition-all duration-300 object-contain
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          ${animated ? 'hover:scale-110' : ''}
        `}
        style={{
          filter: animated ? 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.4)) drop-shadow(0 0 25px rgba(139, 92, 246, 0.2))' : undefined,
          animation: animated ? 'pulse 3s infinite' : undefined
        }}
      />
    </div>
  );
}