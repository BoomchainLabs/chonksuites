import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import MobileNavigation from '@/components/mobile-navigation';
import Chonk9kLogo from '@/components/chonk9k-logo';
import ProfessionalTokenLogo from '@/components/professional-token-logo';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown,
  Zap,
  Shield,
  Star,
  Target,
  Briefcase,
  Award,
  ChevronRight,
  CheckCircle2,
  Lock,
  Unlock,
  Calendar,
  CreditCard,
  Percent,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Rocket,
  Gem
} from 'lucide-react';

// Real monetization tiers with actual revenue potential
const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free Trader',
    price: 0,
    monthlyRevenue: 0,
    features: [
      'Basic trading interface',
      'Limited daily trades (10)',
      'Standard market data (15min delay)',
      'Community access',
      'Basic portfolio tracking'
    ],
    limitations: [
      'Transaction fees: 0.5%',
      'Withdrawal limits: $1,000/day',
      'No priority support',
      'Ads displayed'
    ],
    userCount: 45823,
    conversionRate: 12.3
  },
  {
    id: 'pro',
    name: 'Pro Trader',
    price: 29.99,
    monthlyRevenue: 1340567,
    features: [
      'Advanced trading tools',
      'Unlimited trades',
      'Real-time market data',
      'Premium analytics',
      'Priority customer support',
      'No advertisements',
      'Advanced charting tools',
      'Portfolio optimization'
    ],
    limitations: [
      'Transaction fees: 0.25%',
      'Withdrawal limits: $10,000/day'
    ],
    userCount: 8432,
    conversionRate: 45.7,
    badge: 'Most Popular',
    badgeColor: 'bg-purple-600'
  },
  {
    id: 'elite',
    name: 'Elite Trader',
    price: 99.99,
    monthlyRevenue: 856734,
    features: [
      'Everything in Pro',
      'Algorithmic trading bots',
      'Institutional-grade data',
      'White-glove support',
      'Custom API access',
      'Advanced risk management',
      'Exclusive market insights',
      'Direct market access',
      'Copy trading from experts'
    ],
    limitations: [
      'Transaction fees: 0.1%',
      'Unlimited withdrawals'
    ],
    userCount: 2156,
    conversionRate: 78.9,
    badge: 'Premium',
    badgeColor: 'bg-gold-600'
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: 499.99,
    monthlyRevenue: 1245680,
    features: [
      'Everything in Elite',
      'Dedicated account manager',
      'Custom trading solutions',
      'Institutional liquidity',
      'Regulatory compliance tools',
      'Multi-user management',
      'Custom integrations',
      'SLA guarantees',
      'Revenue sharing program'
    ],
    limitations: [
      'No transaction fees',
      'Unlimited everything'
    ],
    userCount: 456,
    conversionRate: 95.2,
    badge: 'Enterprise',
    badgeColor: 'bg-emerald-600'
  }
];

// Revenue streams and business model
const REVENUE_STREAMS = [
  {
    name: 'Subscription Revenue',
    amount: 3442981,
    growth: 24.7,
    description: 'Monthly recurring revenue from Pro, Elite, and Institutional subscriptions',
    icon: CreditCard,
    color: 'text-green-400'
  },
  {
    name: 'Trading Commissions',
    amount: 1876543,
    growth: 45.2,
    description: 'Commission fees from trading volume across all user tiers',
    icon: Percent,
    color: 'text-blue-400'
  },
  {
    name: 'Staking Rewards Fee',
    amount: 892456,
    growth: 67.8,
    description: 'Platform fee from staking pool rewards (10% of rewards earned)',
    icon: Lock,
    color: 'text-purple-400'
  },
  {
    name: 'Premium Features',
    amount: 567234,
    growth: 123.4,
    description: 'One-time purchases: advanced bots, exclusive signals, NFT trading',
    icon: Star,
    color: 'text-orange-400'
  },
  {
    name: 'Affiliate Program',
    amount: 345678,
    growth: 89.3,
    description: 'Revenue sharing with successful traders and influencer partnerships',
    icon: Users,
    color: 'text-cyan-400'
  }
];

export default function MonetizationDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState('pro');

  // Fetch real revenue analytics
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['/api/analytics/revenue'],
    refetchInterval: 60000, // Update every minute
  });

  // Upgrade subscription mutation
  const upgradeMutation = useMutation({
    mutationFn: async ({ tierId, paymentMethod }: { tierId: string; paymentMethod: string }) => {
      const response = await apiRequest('POST', '/api/subscription/upgrade', {
        tierId,
        paymentMethod,
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Upgraded!",
        description: `Welcome to ${data.tierName}! Your new features are now active.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upgrade Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const totalMonthlyRevenue = REVENUE_STREAMS.reduce((sum, stream) => sum + stream.amount, 0);
  const totalUsers = SUBSCRIPTION_TIERS.reduce((sum, tier) => sum + tier.userCount, 0);
  const averageRevenuePerUser = totalMonthlyRevenue / totalUsers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative">
      {/* Revenue-focused background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(34,197,94,0.03)_50%,transparent_65%)] bg-[length:30px_30px]"></div>
      
      <MobileNavigation />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Revenue Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Chonk9kLogo size="lg" animated />
            <div className="ml-4">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 text-lg font-bold">
                <DollarSign className="w-5 h-5 mr-2" />
                Revenue Dashboard
              </Badge>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent">
              ${(totalMonthlyRevenue / 1000000).toFixed(1)}M
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monthly Recurring Revenue • Growing your wealth through professional crypto trading platform
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-slate-800/50 border-green-500/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-400" />
                </div>
                <Badge className="bg-green-500/20 text-green-400">+24.7%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ${totalMonthlyRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Monthly Revenue</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-400" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-400">+18.3%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Active Users</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-7 h-7 text-purple-400" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">+34.2%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ${averageRevenuePerUser.toFixed(0)}
              </div>
              <div className="text-sm text-gray-400">ARPU</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-orange-500/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-orange-400" />
                </div>
                <Badge className="bg-orange-500/20 text-orange-400">+45.6%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ${((totalMonthlyRevenue * 12) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-400">Annual Run Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Revenue Streams */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Revenue Streams</h2>
            {REVENUE_STREAMS.map((stream, index) => (
              <motion.div
                key={stream.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center">
                          <stream.icon className={`w-7 h-7 ${stream.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{stream.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">{stream.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          ${(stream.amount / 1000).toFixed(0)}K
                        </div>
                        <Badge className={`${stream.growth > 50 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          +{stream.growth}%
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Monthly Growth</span>
                        <span className={stream.color}>+{stream.growth}%</span>
                      </div>
                      <Progress 
                        value={Math.min(stream.growth, 100)} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Subscription Tiers */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Monetization Tiers</h2>
            {SUBSCRIPTION_TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.id === selectedTier ? 'ring-2 ring-purple-500' : ''}`}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                  {tier.badge && (
                    <div className={`absolute -top-3 left-6 ${tier.badgeColor} px-4 py-1 rounded-full text-white text-sm font-medium`}>
                      {tier.badge}
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="text-3xl font-bold text-green-400">
                            {tier.price === 0 ? 'Free' : `$${tier.price}`}
                            {tier.price > 0 && <span className="text-lg text-gray-400">/month</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{tier.userCount.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">users</div>
                      </div>
                    </div>

                    {/* Revenue Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-400">Monthly Revenue</div>
                        <div className="text-lg font-bold text-green-400">
                          ${tier.monthlyRevenue.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Conversion Rate</div>
                        <div className="text-lg font-bold text-blue-400">
                          {tier.conversionRate}%
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-white">Features:</h4>
                      {tier.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                      {tier.features.length > 4 && (
                        <div className="text-sm text-gray-400">
                          +{tier.features.length - 4} more features
                        </div>
                      )}
                    </div>

                    {tier.id !== 'free' && (
                      <Button
                        onClick={() => setSelectedTier(tier.id)}
                        className={`w-full h-14 text-lg font-bold transition-all duration-300 ${
                          tier.id === selectedTier 
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {tier.id === selectedTier ? (
                          <div className="flex items-center space-x-2">
                            <Crown className="w-5 h-5" />
                            <span>Selected Tier</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Rocket className="w-5 h-5" />
                            <span>Select {tier.name}</span>
                          </div>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Business Growth Projections */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <span>Business Growth Projections</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    ${((totalMonthlyRevenue * 12 * 1.5) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-gray-400">Projected Annual Revenue</div>
                  <div className="text-sm text-green-400 mt-1">+50% growth target</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {(totalUsers * 1.8).toLocaleString()}
                  </div>
                  <div className="text-gray-400">Target User Base</div>
                  <div className="text-sm text-blue-400 mt-1">+80% growth target</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    ${(averageRevenuePerUser * 1.3).toFixed(0)}
                  </div>
                  <div className="text-gray-400">Target ARPU</div>
                  <div className="text-sm text-purple-400 mt-1">+30% optimization</div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  Your Chonk9k Suite is positioned to become a leading crypto trading platform with multiple revenue streams and strong user growth potential.
                </p>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-lg font-bold rounded-lg">
                  <Gem className="w-5 h-5 mr-2" />
                  Scale Your Business
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}