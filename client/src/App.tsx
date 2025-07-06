import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Production-ready components
import StableDashboard from "@/components/stable-dashboard";
import SlerfTradingHub from "@/components/slerf-trading-hub";
import DAOGovernance from "@/components/dao-governance";
import SimplePlayground from "@/components/simple-playground";
import HackerTerminal from "@/components/hacker-terminal";
import AchievementsSimple from "@/components/achievements-simple";
import RealStakingPlatform from "@/components/real-staking-platform";
import SimpleChallenges from "@/components/simple-challenges";
import ProfessionalLanding from "@/components/professional-landing";
import MonetizationDashboard from "@/components/monetization-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={ProfessionalLanding} />
      ) : (
        <>
          <Route path="/" component={StableDashboard} />
          <Route path="/trading" component={SlerfTradingHub} />
          <Route path="/staking" component={RealStakingPlatform} />
          <Route path="/slerf" component={SlerfTradingHub} />
          <Route path="/revenue" component={MonetizationDashboard} />
          <Route path="/dao" component={DAOGovernance} />
          <Route path="/achievements" component={AchievementsSimple} />
          <Route path="/challenges" component={SimpleChallenges} />
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
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;