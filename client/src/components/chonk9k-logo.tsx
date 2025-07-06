import { useEffect, useState } from "react";

interface Chonk9kLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

export default function Chonk9kLogo({ size = "md", animated = true, className = "" }: Chonk9kLogoProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sizeMap = {
    sm: { width: 32, height: 32, fontSize: "text-xs" },
    md: { width: 48, height: 48, fontSize: "text-sm" },
    lg: { width: 64, height: 64, fontSize: "text-base" },
    xl: { width: 96, height: 96, fontSize: "text-lg" }
  };

  const { width, height } = sizeMap[size];

  useEffect(() => {
    if (animated) {
      setIsVisible(true);
    }
  }, [animated]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        className={`${animated ? 'animate-pulse' : ''}`}
        style={{
          filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))'
        }}
      >
        {/* Animated Background Rings */}
        {animated && (
          <>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradientRing1)"
              strokeWidth="1"
              opacity="0.3"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50;360 50 50"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="url(#gradientRing2)"
              strokeWidth="1"
              opacity="0.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360 50 50;0 50 50"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}

        {/* Main Logo Shape - Futuristic "C9" */}
        <g transform="translate(50,50)">
          {/* Letter C */}
          <path
            d="M -15 -20 A 20 20 0 0 1 -15 20 L -10 15 A 15 15 0 0 0 -10 -15 Z"
            fill="url(#gradientPrimary)"
            stroke="url(#gradientStroke)"
            strokeWidth="1"
          >
            {animated && (
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </path>
          
          {/* Number 9 */}
          <g transform="translate(5,0)">
            <circle
              cx="5"
              cy="-10"
              r="8"
              fill="none"
              stroke="url(#gradientPrimary)"
              strokeWidth="3"
            />
            <path
              d="M 13 -10 L 13 20"
              stroke="url(#gradientPrimary)"
              strokeWidth="3"
              strokeLinecap="round"
            >
              {animated && (
                <animate
                  attributeName="opacity"
                  values="0.7;1;0.7"
                  dur="2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          </g>

          {/* K Shape */}
          <g transform="translate(25,0)">
            <path
              d="M -5 -20 L -5 20 M -5 0 L 8 -20 M -5 0 L 8 20"
              stroke="url(#gradientSecondary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {animated && (
                <animate
                  attributeName="opacity"
                  values="0.7;1;0.7"
                  dur="2s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          </g>
        </g>

        {/* Floating Particles */}
        {animated && (
          <g>
            <circle cx="20" cy="25" r="1" fill="#22c55e" opacity="0.8">
              <animate
                attributeName="cy"
                values="25;15;25"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="80" cy="75" r="1.5" fill="#3b82f6" opacity="0.6">
              <animate
                attributeName="cy"
                values="75;65;75"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="75" cy="30" r="1" fill="#22c55e" opacity="0.7">
              <animate
                attributeName="cx"
                values="75;85;75"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="gradientSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="gradientRing1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="gradientRing2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Optional Text Label */}
      {size === "xl" && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">
            CHONK9K
          </span>
        </div>
      )}
    </div>
  );
}