import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingBag, 
  Plus, 
  Eye, 
  TrendingUp, 
  Users, 
  Flame,
  Star,
  Diamond,
  Zap,
  Crown,
  Sparkles
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface NFTToken {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  ownerAddress: string;
  attributes: Array<{ trait_type: string; value: string; rarity?: number }>;
  isListed: boolean;
  collection: {
    name: string;
    floorPrice: number;
    volume24h: number;
  };
}

interface NFTMarketplaceProps {
  userId: string;
}

// Professional NFT collection using the provided contract address
const PROFESSIONAL_COLLECTION = {
  contractAddress: "HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa",
  name: "Elite Genesis Collection",
  symbol: "EGC",
  description: "Premium NFT collection featuring unique digital assets with utility in the Chonk9k ecosystem"
};

export default function NFTMarketplace({ userId }: NFTMarketplaceProps) {
  const [selectedTab, setSelectedTab] = useState("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [filterBy, setFilterBy] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch NFT marketplace data
  const { data: marketplaceData, isLoading } = useQuery({
    queryKey: ['/api/nft/marketplace'],
    staleTime: 30000, // Cache for 30 seconds
  });

  // Purchase NFT mutation
  const purchaseNFT = useMutation({
    mutationFn: async ({ nftId, price }: { nftId: string; price: number }) => {
      const response = await apiRequest('POST', '/api/nft/purchase', {
        nftId,
        buyerAddress: `user_${userId}`,
        maxPrice: price,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nft/marketplace'] });
      toast({
        title: "NFT Purchased!",
        description: "Your NFT has been successfully acquired.",
      });
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // List NFT mutation
  const listNFT = useMutation({
    mutationFn: async (listingData: any) => {
      const response = await apiRequest('POST', '/api/nft/list', listingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nft/marketplace'] });
      toast({
        title: "NFT Listed!",
        description: "Your NFT is now available for sale.",
      });
    }
  });

  // Mock professional NFT data with the collection
  const mockNFTs: NFTToken[] = [
    {
      id: "1",
      name: "Elite Genesis #001",
      description: "First edition premium NFT with exclusive staking rewards and governance rights.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      price: 2.5,
      currency: "SOL",
      ownerAddress: PROFESSIONAL_COLLECTION.contractAddress,
      attributes: [
        { trait_type: "Rarity", value: "Legendary", rarity: 95 },
        { trait_type: "Power", value: "Ultra", rarity: 88 },
        { trait_type: "Element", value: "Cosmic", rarity: 92 }
      ],
      isListed: true,
      collection: {
        name: PROFESSIONAL_COLLECTION.name,
        floorPrice: 1.8,
        volume24h: 156.7
      }
    },
    {
      id: "2", 
      name: "Elite Genesis #002",
      description: "Premium NFT with enhanced yield farming capabilities and exclusive access perks.",
      imageUrl: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?w=400",
      price: 3.2,
      currency: "SOL",
      ownerAddress: PROFESSIONAL_COLLECTION.contractAddress,
      attributes: [
        { trait_type: "Rarity", value: "Epic", rarity: 82 },
        { trait_type: "Power", value: "High", rarity: 75 },
        { trait_type: "Element", value: "Digital", rarity: 68 }
      ],
      isListed: true,
      collection: {
        name: PROFESSIONAL_COLLECTION.name,
        floorPrice: 1.8,
        volume24h: 156.7
      }
    },
    {
      id: "3",
      name: "Elite Genesis #003", 
      description: "Rare NFT featuring advanced DeFi integration and premium reward multipliers.",
      imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400",
      price: 1.9,
      currency: "SOL",
      ownerAddress: PROFESSIONAL_COLLECTION.contractAddress,
      attributes: [
        { trait_type: "Rarity", value: "Rare", rarity: 65 },
        { trait_type: "Power", value: "Medium", rarity: 55 },
        { trait_type: "Element", value: "Fire", rarity: 48 }
      ],
      isListed: true,
      collection: {
        name: PROFESSIONAL_COLLECTION.name,
        floorPrice: 1.8,
        volume24h: 156.7
      }
    }
  ];

  const nfts = marketplaceData?.nfts || mockNFTs;
  const stats = marketplaceData?.stats || {
    totalVolume: 2847.3,
    totalSales: 1249,
    activeListings: 89,
    uniqueOwners: 456
  };

  const getRarityColor = (rarity: number) => {
    if (rarity >= 90) return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    if (rarity >= 75) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (rarity >= 50) return "text-green-400 bg-green-500/10 border-green-500/20";
    return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  };

  const getRarityIcon = (rarity: number) => {
    if (rarity >= 90) return <Crown className="w-4 h-4" />;
    if (rarity >= 75) return <Diamond className="w-4 h-4" />;
    if (rarity >= 50) return <Star className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <Card className="glass-card border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <ShoppingBag className="w-6 h-6 mr-3 text-purple-400" />
          NFT Marketplace
          <Badge className="ml-3 bg-purple-500/10 text-purple-400 border-purple-500/20">
            Professional
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-500/20">
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="my-collection" className="data-[state=active]:bg-cyan-500/20">
              My Collection
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Market Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Volume</p>
                    <p className="text-xl font-bold text-purple-400">{stats.totalVolume} SOL</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Sales</p>
                    <p className="text-xl font-bold text-cyan-400">{stats.totalSales}</p>
                  </div>
                  <Flame className="w-8 h-8 text-cyan-400" />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-green-500/5 border border-green-500/20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Listings</p>
                    <p className="text-xl font-bold text-green-400">{stats.activeListings}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-400" />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Unique Owners</p>
                    <p className="text-xl font-bold text-yellow-400">{stats.uniqueOwners}</p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-400" />
                </div>
              </motion.div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-800/50 border-gray-600"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <motion.div
                  key={nft.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="glass-card border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img 
                        src={nft.imageUrl} 
                        alt={nft.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={`${getRarityColor(nft.attributes[0]?.rarity || 0)} flex items-center space-x-1`}>
                          {getRarityIcon(nft.attributes[0]?.rarity || 0)}
                          <span>{nft.attributes[0]?.value || 'Common'}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{nft.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{nft.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Price</span>
                          <span className="font-bold text-lg text-purple-400">
                            {nft.price} {nft.currency}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Floor</span>
                          <span className="text-green-400">{nft.collection.floorPrice} SOL</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {nft.attributes.slice(0, 2).map((attr, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {attr.trait_type}: {attr.value}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button
                          onClick={() => purchaseNFT.mutate({ nftId: nft.id, price: nft.price })}
                          disabled={purchaseNFT.isPending}
                          className="w-full btn-primary"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          {purchaseNFT.isPending ? 'Processing...' : 'Buy Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-collection" className="space-y-6">
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Your NFT Collection</h3>
              <p className="text-gray-400 mb-6">
                Connect your wallet to view and manage your NFT collection
              </p>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card border-gray-600/30">
                <CardHeader>
                  <CardTitle className="text-lg">Collection Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>24h Volume</span>
                      <span className="text-green-400">+23.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Floor Price</span>
                      <span className="text-green-400">+12.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Sale Price</span>
                      <span className="text-red-400">-5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Supply</span>
                      <span className="text-gray-400">10,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-gray-600/30">
                <CardHeader>
                  <CardTitle className="text-lg">Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Strong bullish trend in premium NFT segment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}