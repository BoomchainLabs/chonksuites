import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import SimpleDashboard from "@/components/simple-dashboard";
import ProfessionalTrading from "@/components/professional-trading";
import SlerfTradingHub from "@/components/slerf-trading-hub";
import DAOGovernance from "@/components/dao-governance";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={SimpleDashboard} />
          <Route path="/home" component={SimpleDashboard} />
          <Route path="/trading" component={ProfessionalTrading} />
          <Route path="/slerf" component={SlerfTradingHub} />
          <Route path="/dao" component={DAOGovernance} />
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
