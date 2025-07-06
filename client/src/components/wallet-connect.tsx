import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  Coins
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface WalletConnectProps {
  onConnect?: () => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [selectedChain, setSelectedChain] = useState<"solana" | "base">("solana");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectWallet = useMutation({
    mutationFn: async ({ address, chainType }: { address: string; chainType: string }) => {
      const response = await apiRequest('POST', '/api/connect-wallet', {
        walletAddress: address,
        chainType,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Wallet Connected!",
        description: "Your wallet has been successfully connected to the platform.",
      });
      onConnect?.();
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleConnect = async () => {
    if (!walletAddress) {
      toast({
        title: "Address Required",
        description: "Please enter a valid wallet address.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      await connectWallet.mutateAsync({
        address: walletAddress,
        chainType: selectedChain,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectPhantom = async () => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      try {
        const solana = (window as any).solana;
        if (solana.isPhantom) {
          const response = await solana.connect();
          setWalletAddress(response.publicKey.toString());
          setSelectedChain("solana");
          toast({
            title: "Phantom Connected",
            description: "Phantom wallet connected successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Phantom wallet.",
          variant: "destructive",
        });
      }
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const connectMetaMask = async () => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
      try {
        const ethereum = (window as any).ethereum;
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setSelectedChain("base");
          toast({
            title: "MetaMask Connected",
            description: "MetaMask wallet connected successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to MetaMask wallet.",
          variant: "destructive",
        });
      }
    } else {
      window.open("https://metamask.io/", "_blank");
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard.",
    });
  };

  return (
    <Card className="glass-card border-purple-500/30 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Wallet className="w-6 h-6 mr-3 text-purple-400" />
          Connect Your Wallet
          <Badge className="ml-3 bg-green-500/10 text-green-400 border-green-500/20">
            Secure
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedChain} onValueChange={(value) => setSelectedChain(value as "solana" | "base")}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="solana" className="data-[state=active]:bg-purple-500/20">
              Solana Network
            </TabsTrigger>
            <TabsTrigger value="base" className="data-[state=active]:bg-blue-500/20">
              Base Network
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solana" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  onClick={connectPhantom}
                  className="w-full h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 flex items-center justify-center space-x-3"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">P</span>
                  </div>
                  <span className="font-semibold">Connect Phantom</span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  variant="outline"
                  className="w-full h-16 border-purple-500/30 hover:bg-purple-500/10 flex items-center justify-center space-x-3"
                  onClick={() => window.open("https://solflare.com/", "_blank")}
                >
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span>Get Solflare</span>
                </Button>
              </motion.div>
            </div>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Coins className="w-5 h-5 mr-2 text-purple-400" />
                Solana Features
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Stake CHONK9K tokens with up to 35% APY</li>
                <li>• Access exclusive Solana NFT collections</li>
                <li>• Create custom SPL tokens with advanced features</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="base" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  onClick={connectMetaMask}
                  className="w-full h-16 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 flex items-center justify-center space-x-3"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xs">MM</span>
                  </div>
                  <span className="font-semibold">Connect MetaMask</span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  variant="outline"
                  className="w-full h-16 border-blue-500/30 hover:bg-blue-500/10 flex items-center justify-center space-x-3"
                  onClick={() => window.open("https://www.coinbase.com/wallet", "_blank")}
                >
                  <Shield className="w-6 h-6 text-blue-400" />
                  <span>Get Coinbase Wallet</span>
                </Button>
              </motion.div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Coins className="w-5 h-5 mr-2 text-blue-400" />
                Base Features
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Stake SLERF tokens with professional rewards</li>
                <li>• Access Layer 2 scaling benefits</li>
                <li>• Low-cost transactions and fast confirmations</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Manual Address Input */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-sm text-gray-400">or enter manually</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder={selectedChain === "solana" ? "Enter Solana wallet address..." : "Enter Base wallet address..."}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-gray-800/50 border-gray-600"
            />
            
            {walletAddress && (
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <span className="text-sm font-mono text-gray-300 truncate mr-3">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Badge variant="outline" className={`${
                    selectedChain === "solana" ? "text-purple-400 border-purple-500/30" : "text-blue-400 border-blue-500/30"
                  }`}>
                    {selectedChain === "solana" ? "Solana" : "Base"}
                  </Badge>
                </div>
              </div>
            )}

            <Button
              onClick={handleConnect}
              disabled={!walletAddress || isConnecting || connectWallet.isPending}
              className="w-full btn-primary"
            >
              {isConnecting || connectWallet.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-400 mb-1">Security Notice</h3>
              <p className="text-sm text-gray-400">
                Your wallet connection is secure and encrypted. We never store your private keys or seed phrases.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}