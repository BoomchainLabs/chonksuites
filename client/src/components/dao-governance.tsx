import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Vote, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  endTime: Date;
  category: 'governance' | 'treasury' | 'technical' | 'community';
  requiredStake: number;
}

interface VoteData {
  proposalId: string;
  vote: 'for' | 'against';
  votingPower: number;
  timestamp: Date;
}

interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  totalStaked: number;
  yourVotingPower: number;
  participationRate: number;
}

const DAOLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-white/20`}>
      {/* Elephant silhouette for governance */}
      <svg viewBox="0 0 24 24" className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10'} fill-white`}>
        <path d="M12 2C7.03 2 3 6.03 3 11c0 .85.12 1.67.33 2.45L2 15l1.5 1.5L5 15c1.25.85 2.75 1.43 4.39 1.68L8 20h8l-1.39-3.32C16.25 16.43 17.75 15.85 19 15l1.5 1.5L22 15l-1.33-1.55C20.88 12.67 21 11.85 21 11c0-4.97-4.03-9-9-9z"/>
      </svg>
    </div>
  );
};

const ProposalCard: React.FC<{ proposal: Proposal; onVote?: (proposalId: string, vote: 'for' | 'against') => void }> = ({ 
  proposal, 
  onVote 
}) => {
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | null>(null);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'passed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'governance': return 'bg-purple-500/20 text-purple-300';
      case 'treasury': return 'bg-green-500/20 text-green-300';
      case 'technical': return 'bg-blue-500/20 text-blue-300';
      case 'community': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const forPercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0;
  const againstPercentage = proposal.totalVotes > 0 ? (proposal.votesAgainst / proposal.totalVotes) * 100 : 0;
  const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-white text-lg">{proposal.title}</CardTitle>
                <Badge className={getStatusColor(proposal.status)}>
                  {proposal.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <Badge className={getCategoryColor(proposal.category)}>
                  {proposal.category.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-400">by {proposal.proposer}</span>
              </div>
            </div>
            <DAOLogo size="sm" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">{proposal.description}</p>
          
          {/* Voting Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Votes For</span>
              <span className="text-green-400 font-medium">{proposal.votesFor.toLocaleString()} ({forPercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${forPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Votes Against</span>
              <span className="text-red-400 font-medium">{proposal.votesAgainst.toLocaleString()} ({againstPercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${againstPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Quorum Progress</span>
              <span className="text-cyan-400 font-medium">{quorumPercentage.toFixed(1)}% ({proposal.totalVotes.toLocaleString()}/{proposal.quorum.toLocaleString()})</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(quorumPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Voting Actions */}
          {proposal.status === 'active' && (
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Time remaining</span>
                <span className="text-white">{Math.ceil((proposal.endTime.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days</span>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={() => {
                    setSelectedVote('for');
                    onVote?.(proposal.id, 'for');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Vote For
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedVote('against');
                    onVote?.(proposal.id, 'against');
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Vote Against
                </Button>
              </div>
              
              <div className="text-xs text-gray-400 text-center">
                Required stake: {proposal.requiredStake.toLocaleString()} tokens
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CreateProposal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'governance' | 'treasury' | 'technical' | 'community'>('governance');
  const queryClient = useQueryClient();

  const createProposalMutation = useMutation({
    mutationFn: async (proposalData: any) => {
      const response = await fetch('/api/dao/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      setTitle('');
      setDescription('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProposalMutation.mutate({
      title,
      description,
      category,
      requiredStake: 1000
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Create New Proposal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Proposal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter proposal title..."
              className="bg-slate-700 border-slate-600 text-white mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your proposal in detail..."
              className="bg-slate-700 border-slate-600 text-white mt-1 min-h-[100px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 mt-1"
            >
              <option value="governance">Governance</option>
              <option value="treasury">Treasury</option>
              <option value="technical">Technical</option>
              <option value="community">Community</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            disabled={createProposalMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {createProposalMutation.isPending ? 'Creating...' : 'Create Proposal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const GovernanceStats: React.FC<{ stats: GovernanceStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Your Voting Power</p>
              <p className="text-3xl font-bold text-white">{stats.yourVotingPower.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Vote className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="text-xs text-purple-300 mt-2">
            Based on staked tokens
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Active Proposals</p>
              <p className="text-3xl font-bold text-white">{stats.activeProposals}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="text-xs text-blue-300 mt-2">
            {stats.totalProposals} total proposals
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Participation Rate</p>
              <p className="text-3xl font-bold text-white">{stats.participationRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="text-xs text-green-300 mt-2">
            {stats.totalStaked.toLocaleString()} tokens staked
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function DAOGovernance() {
  const queryClient = useQueryClient();

  // Fetch proposals from API
  const { data: proposals = [], isLoading: proposalsLoading } = useQuery<Proposal[]>({
    queryKey: ['/api/dao/proposals'],
  });

  // Fetch user voting power
  const { data: userVotingPower = 0 } = useQuery<number>({
    queryKey: ['/api/dao/voting-power'],
  });

  const governanceStats: GovernanceStats = {
    totalProposals: 15,
    activeProposals: 3,
    passedProposals: 8,
    totalStaked: 2500000,
    yourVotingPower: 15000,
    participationRate: 67.3
  };

  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: string; vote: 'for' | 'against' }) => {
      const response = await fetch('/api/dao/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, vote })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    }
  });

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    voteMutation.mutate({ proposalId, vote });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <DAOLogo size="lg" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Boomchain Labs DAO
              </h1>
              <p className="text-gray-400">Decentralized governance for the future of Web3</p>
            </div>
          </div>
        </div>

        {/* Governance Stats */}
        <div className="mb-8">
          <GovernanceStats stats={governanceStats} />
        </div>

        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="proposals" className="data-[state=active]:bg-purple-600">
              <Vote className="w-4 h-4 mr-2" />
              Active Proposals
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">
              <Zap className="w-4 h-4 mr-2" />
              Create Proposal
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-green-600">
              <Clock className="w-4 h-4 mr-2" />
              Voting History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-6">
            <div className="grid gap-6">
              {proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onVote={handleVote}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="max-w-2xl">
              <CreateProposal />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-6">
              {proposals.filter(p => p.status !== 'active').map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}