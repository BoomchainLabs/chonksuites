import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Production-ready components
import AuthenticDashboard from "@/components/authentic-dashboard";
import ProductionTradingDashboard from "@/components/production-trading-dashboard";
import DAOGovernance from "@/components/dao-governance";
import { 
  ProductionChallenges, 
  ProductionPlayground, 
  ProductionAchievements, 
  ProductionTerminal 
} from "@/components/production-ready-components";
import RealStakingPlatform from "@/components/real-staking-platform";
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
          <Route path="/" component={AuthenticDashboard} />
          <Route path="/trading" component={ProductionTradingDashboard} />
          <Route path="/staking" component={RealStakingPlatform} />
          <Route path="/slerf" component={ProductionTradingDashboard} />
          <Route path="/revenue" component={MonetizationDashboard} />
          <Route path="/dao" component={DAOGovernance} />
          <Route path="/achievements" component={ProductionAchievements} />
          <Route path="/challenges" component={ProductionChallenges} />
          <Route path="/playground" component={ProductionPlayground} />
          <Route path="/terminal" component={ProductionTerminal} />
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