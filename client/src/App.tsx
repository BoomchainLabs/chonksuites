import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import SimpleDashboard from "@/components/simple-dashboard";
import CleanTradingDashboard from "@/components/clean-trading-dashboard";
import SlerfTradingHub from "@/components/slerf-trading-hub";
import DAOGovernance from "@/components/dao-governance";

import SimplePlayground from "@/components/simple-playground";
import HackerTerminal from "@/components/hacker-terminal";
import AchievementsSimple from "@/components/achievements-simple";
import StakingPlatform from "@/components/staking-platform";
import GamifiedCommunity from "@/components/gamified-community";
import TokenSwapDApp from "@/components/token-swap-dapp";
import WorkingLanding from "@/pages/working-landing";
import ProfessionalLanding from "@/components/professional-landing";
import MonetizationDashboard from "@/components/monetization-dashboard";
import RealStakingPlatform from "@/components/real-staking-platform";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/terminal" component={HackerTerminal} />
      <Route path="/playground" component={SimplePlayground} />
      <Route path="/mascots" component={() => (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                Interactive Token Mascots
              </h1>
              <p className="text-gray-400">Meet your animated token companions that react to market changes</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400">Interactive mascots coming soon!</p>
            </div>
          </div>
        </div>
      )} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={ProfessionalLanding} />
      ) : (
        <>
          <Route path="/" component={SimpleDashboard} />
          <Route path="/home" component={SimpleDashboard} />
          <Route path="/trading" component={CleanTradingDashboard} />
          <Route path="/staking" component={RealStakingPlatform} />
          <Route path="/swap" component={TokenSwapDApp} />
          <Route path="/community" component={GamifiedCommunity} />
          <Route path="/slerf" component={SlerfTradingHub} />
          <Route path="/revenue" component={MonetizationDashboard} />
          <Route path="/dao" component={DAOGovernance} />
          <Route path="/achievements" component={AchievementsSimple} />
          <Route path="/playground" component={SimplePlayground} />
          <Route path="/terminal" component={HackerTerminal} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
