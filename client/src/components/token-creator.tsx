import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { 
  Coins, 
  Rocket, 
  Settings, 
  TrendingUp, 
  Shield,
  Zap,
  Lock,
  Star,
  Sparkles,
  Crown,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { z } from "zod";

interface TokenCreatorProps {
  userId: string;
}

// Professional token creation schema with advanced features
const tokenCreationSchema = z.object({
  name: z.string().min(3, "Token name must be at least 3 characters").max(50),
  symbol: z.string().min(2, "Symbol must be at least 2 characters").max(10).regex(/^[A-Z]+$/, "Symbol must be uppercase letters only"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  totalSupply: z.number().min(1000, "Minimum supply is 1,000 tokens").max(1000000000, "Maximum supply is 1B tokens"),
  decimals: z.number().min(6).max(18).default(9),
  imageUrl: z.string().url("Must be a valid image URL").optional(),
  // Advanced Web3 Features
  mintable: z.boolean().default(false),
  burnable: z.boolean().default(false),
  pausable: z.boolean().default(false),
  capped: z.boolean().default(true),
  // Utility Features
  stakingEnabled: z.boolean().default(false),
  governanceEnabled: z.boolean().default(false),
  deflationary: z.boolean().default(false),
  // Economic Model
  initialPrice: z.number().min(0.0001).max(1000).optional(),
  liquidityPool: z.boolean().default(false),
  antiWhale: z.boolean().default(false),
  // Advanced Settings
  transferTax: z.number().min(0).max(10).default(0), // Percentage
  burnRate: z.number().min(0).max(5).default(0), // Percentage per transaction
  reflectionRate: z.number().min(0).max(10).default(0), // Percentage to holders
});

type TokenCreationForm = z.infer<typeof tokenCreationSchema>;

export default function TokenCreator({ userId }: TokenCreatorProps) {
  const [selectedTab, setSelectedTab] = useState("basic");
  const [deploymentStep, setDeploymentStep] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TokenCreationForm>({
    resolver: zodResolver(tokenCreationSchema),
    defaultValues: {
      decimals: 9,
      mintable: false,
      burnable: false,
      pausable: false,
      capped: true,
      stakingEnabled: false,
      governanceEnabled: false,
      deflationary: false,
      liquidityPool: false,
      antiWhale: false,
      transferTax: 0,
      burnRate: 0,
      reflectionRate: 0,
    },
  });

  // Token creation mutation with professional deployment process
  const createToken = useMutation({
    mutationFn: async (data: TokenCreationForm) => {
      const response = await apiRequest('POST', '/api/tokens/create', {
        ...data,
        creatorId: userId,
        network: 'solana', // Default to Solana for SPL tokens
        contractType: 'SPL-TOKEN',
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/user'] });
      toast({
        title: "Token Created Successfully!",
        description: `${data.token.symbol} has been deployed to Solana mainnet.`,
      });
      setDeploymentStep(4);
    },
    onError: (error) => {
      toast({
        title: "Token Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: TokenCreationForm) => {
    setDeploymentStep(1);
    createToken.mutate(data);
  };

  const estimatedCost = () => {
    const baseCost = 0.1; // SOL for basic token
    let additionalCost = 0;
    
    const formData = form.getValues();
    if (formData.mintable) additionalCost += 0.02;
    if (formData.pausable) additionalCost += 0.015;
    if (formData.stakingEnabled) additionalCost += 0.05;
    if (formData.governanceEnabled) additionalCost += 0.08;
    if (formData.liquidityPool) additionalCost += 0.1;
    
    return baseCost + additionalCost;
  };

  const tokenComplexity = () => {
    const formData = form.getValues();
    const features = [
      formData.mintable,
      formData.burnable,
      formData.pausable,
      formData.stakingEnabled,
      formData.governanceEnabled,
      formData.deflationary,
      formData.liquidityPool,
      formData.antiWhale,
    ].filter(Boolean).length;

    if (features >= 6) return { level: "Enterprise", color: "text-purple-400", icon: Crown };
    if (features >= 4) return { level: "Professional", color: "text-blue-400", icon: Star };
    if (features >= 2) return { level: "Advanced", color: "text-green-400", icon: Zap };
    return { level: "Basic", color: "text-gray-400", icon: Coins };
  };

  const complexity = tokenComplexity();

  return (
    <Card className="glass-card border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Rocket className="w-6 h-6 mr-3 text-cyan-400" />
          Professional Token Creator
          <Badge className={`ml-3 ${complexity.color} border-current/20 bg-current/10`}>
            <complexity.icon className="w-3 h-3 mr-1" />
            {complexity.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                <TabsTrigger value="basic" className="data-[state=active]:bg-cyan-500/20">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-purple-500/20">
                  Web3 Features
                </TabsTrigger>
                <TabsTrigger value="economics" className="data-[state=active]:bg-green-500/20">
                  Economics
                </TabsTrigger>
                <TabsTrigger value="deploy" className="data-[state=active]:bg-yellow-500/20">
                  Deploy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="My Awesome Token" 
                            {...field}
                            className="bg-gray-800/50 border-gray-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Symbol</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MAT" 
                            {...field}
                            className="bg-gray-800/50 border-gray-600 uppercase"
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your token's purpose, utility, and vision..."
                          {...field}
                          className="bg-gray-800/50 border-gray-600 min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="totalSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Supply</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="1000000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="bg-gray-800/50 border-gray-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="decimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decimals</FormLabel>
                        <FormControl>
                          <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6">6 (Basic)</SelectItem>
                              <SelectItem value="9">9 (Standard)</SelectItem>
                              <SelectItem value="18">18 (ERC-20 Compatible)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://..."
                            {...field}
                            className="bg-gray-800/50 border-gray-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Core Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-400" />
                      Core Features
                    </h3>
                    
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="mintable"
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div>
                              <Label htmlFor="mintable">Mintable</Label>
                              <p className="text-sm text-gray-400">Allow creating new tokens</p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="burnable"
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div>
                              <Label htmlFor="burnable">Burnable</Label>
                              <p className="text-sm text-gray-400">Allow destroying tokens</p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pausable"
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div>
                              <Label htmlFor="pausable">Pausable</Label>
                              <p className="text-sm text-gray-400">Emergency pause transfers</p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  {/* Utility Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                      Utility Features
                    </h3>
                    
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="stakingEnabled"
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div>
                              <Label htmlFor="stakingEnabled">Staking</Label>
                              <p className="text-sm text-gray-400">Enable token staking rewards</p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="governanceEnabled"
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div>
                              <Label htmlFor="governanceEnabled">Governance</Label>
                              <p className="text-sm text-gray-400">Enable DAO voting rights</p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deflationary"
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div>
                              <Label htmlFor="deflationary">Deflationary</Label>
                              <p className="text-sm text-gray-400">Auto-burn on transactions</p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="economics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Economic Model
                    </h3>

                    <FormField
                      control={form.control}
                      name="initialPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Price (SOL)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.0001"
                              placeholder="0.0001"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-800/50 border-gray-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="liquidityPool"
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <Label htmlFor="liquidityPool">Liquidity Pool</Label>
                            <p className="text-sm text-gray-400">Create DEX trading pair</p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Target className="w-5 h-5 mr-2 text-yellow-400" />
                      Advanced Settings
                    </h3>

                    <FormField
                      control={form.control}
                      name="transferTax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transfer Tax (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-800/50 border-gray-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reflectionRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reflection Rate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-800/50 border-gray-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deploy" className="space-y-6">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Deployment Summary</h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-400">Token Name</p>
                          <p className="font-bold">{form.watch('name') || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Symbol</p>
                          <p className="font-bold">{form.watch('symbol') || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Supply</p>
                          <p className="font-bold">{(form.watch('totalSupply') || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Complexity</p>
                          <p className={`font-bold ${complexity.color}`}>{complexity.level}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Estimated Cost:</span>
                          <span className="text-xl font-bold text-green-400">{estimatedCost().toFixed(4)} SOL</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      type="submit"
                      disabled={createToken.isPending}
                      className="w-full btn-primary text-lg py-6"
                    >
                      <Rocket className="w-6 h-6 mr-3" />
                      {createToken.isPending ? 'Deploying Token...' : 'Deploy to Solana Mainnet'}
                    </Button>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}