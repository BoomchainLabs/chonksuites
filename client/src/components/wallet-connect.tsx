import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Settings } from "lucide-react";
import { mockWalletConnection } from "@/lib/wallet-utils";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectProps {
  onConnect: (walletData: { address: string; chainType: string }) => void;
  isConnected: boolean;
  walletAddress?: string;
}

export default function WalletConnect({ onConnect, isConnected, walletAddress }: WalletConnectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (type: 'evm' | 'solana') => {
    setIsConnecting(true);
    try {
      let result;
      if (type === 'evm') {
        result = await mockWalletConnection.connectEVM();
        onConnect({ address: result.address, chainType: 'evm' });
      } else {
        result = await mockWalletConnection.connectSolana();
        onConnect({ address: result.address, chainType: 'solana' });
      }
      
      setIsOpen(false);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected ${type === 'evm' ? 'EVM' : 'Solana'} wallet`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="btn-primary animate-glow">
            <Wallet className="w-4 h-4 mr-2" />
            {isConnected ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}` : "Connect Wallet"}
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-xl">Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Card className="glass-card border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer" onClick={() => handleConnect('evm')}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <p className="font-medium">MetaMask</p>
                    <p className="text-sm text-gray-400">Connect to Base Chain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer" onClick={() => handleConnect('solana')}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <div>
                    <p className="font-medium">Phantom</p>
                    <p className="text-sm text-gray-400">Connect to Solana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <div>
                    <p className="font-medium">WalletConnect</p>
                    <p className="text-sm text-gray-400">Scan QR code</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {isConnecting && (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-400 mt-2">Connecting...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" size="sm" className="btn-secondary">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}
