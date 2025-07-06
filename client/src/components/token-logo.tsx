import slerfLogo from "@assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg";
import chonkpumpLogo from "@assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg";

interface TokenLogoProps {
  tokenSymbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function TokenLogo({ tokenSymbol, size = "md", className = "" }: TokenLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const logoSrc = (tokenSymbol === "SLERF" || tokenSymbol === "LERF") ? slerfLogo : 
                  (tokenSymbol === "CHONKPUMP" || tokenSymbol === "CHONK9K") ? chonkpumpLogo : 
                  null;

  if (!logoSrc) {
    // Fallback to initial letter if no logo found
    const bgColor = (tokenSymbol === "SLERF" || tokenSymbol === "LERF") ? "bg-gradient-to-br from-green-400 to-blue-500" :
                    (tokenSymbol === "CHONKPUMP" || tokenSymbol === "CHONK9K") ? "bg-gradient-to-br from-orange-400 to-red-500" :
                    "bg-gradient-to-br from-purple-400 to-pink-500";
    
    return (
      <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm ${className}`}>
        <span>{tokenSymbol.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img 
      src={logoSrc} 
      alt={`${tokenSymbol} logo`}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-600 ${className}`}
    />
  );
}