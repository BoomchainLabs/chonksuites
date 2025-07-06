import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import SimpleDashboard from "@/components/simple-dashboard";
import ProductionTradingDashboard from "@/components/production-trading-dashboard";
import SlerfTradingHub from "@/components/slerf-trading-hub";
import DAOGovernance from "@/components/dao-governance";
import MascotShowcase from "@/components/mascot-showcase";
import SimplePlayground from "@/components/simple-playground";
import HackerTerminal from "@/components/hacker-terminal";
import CommunityAchievements from "@/components/community-achievements";
import Landing from "@/pages/landing";
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
            <MascotShowcase
              slerfPrice={0.0234}
              slerfChange={15.67}
              chonkPrice={0.00156}
              chonkChange={-3.45}
            />
          </div>
        </div>
      )} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={SimpleDashboard} />
          <Route path="/home" component={SimpleDashboard} />
          <Route path="/trading" component={ProductionTradingDashboard} />
          <Route path="/slerf" component={SlerfTradingHub} />
          <Route path="/dao" component={DAOGovernance} />
          <Route path="/achievements" component={CommunityAchievements} />
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
