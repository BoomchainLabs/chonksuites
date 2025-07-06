export const generateReferralLink = (walletAddress: string): string => {
  return `https://chonk9k.com/ref/${walletAddress}`;
};

export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};

export const mockWalletConnection = {
  // Mock EVM wallet connection
  connectEVM: async (): Promise<{ address: string; chainId: number }> => {
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      address: "0x1234567890123456789012345678901234567890",
      chainId: 8453 // Base chain ID
    };
  },

  // Mock Solana wallet connection
  connectSolana: async (): Promise<{ address: string }> => {
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
    };
  }
};
