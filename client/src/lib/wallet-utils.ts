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

export const realWalletConnection = {
  // Real EVM wallet connection using MetaMask or WalletConnect
  connectEVM: async (): Promise<{ address: string; chainId: number }> => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return {
          address: accounts[0],
          chainId: parseInt(chainId, 16)
        };
      } catch (error) {
        console.error('Error connecting to EVM wallet:', error);
        throw new Error('Failed to connect EVM wallet');
      }
    } else {
      throw new Error('MetaMask not detected');
    }
  },

  // Real Solana wallet connection using Phantom or Solflare
  connectSolana: async (): Promise<{ address: string }> => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        const response = await window.solana.connect();
        return {
          address: response.publicKey.toString()
        };
      } catch (error) {
        console.error('Error connecting to Solana wallet:', error);
        throw new Error('Failed to connect Solana wallet');
      }
    } else {
      throw new Error('Solana wallet not detected');
    }
  }
};
