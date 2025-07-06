/**
 * Authentic Token Logos
 * Production-ready imports for SLERF and CHONKPUMP 9000 tokens
 */

// Authentic SLERF logo (Base Chain)
import slerfLogoPath from "@assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg";

// Authentic CHONKPUMP 9000 logo (Solana)
import chonkLogoPath from "@assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg";

export const AUTHENTIC_TOKEN_LOGOS = {
  SLERF: slerfLogoPath,
  CHONK9K: chonkLogoPath,
  'CHONKPUMP 9000': chonkLogoPath
};

export const getTokenLogo = (symbol: string): string => {
  return AUTHENTIC_TOKEN_LOGOS[symbol as keyof typeof AUTHENTIC_TOKEN_LOGOS] || slerfLogoPath;
};

export { slerfLogoPath, chonkLogoPath };