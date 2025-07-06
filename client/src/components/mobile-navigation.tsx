import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu,
  Home,
  TrendingUp,
  Trophy,
  Gamepad2,
  Terminal,
  Vote,
  X,
  Zap,
  ArrowUpDown,
  Users,
  Lock
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import Chonk9kLogo from "@/components/chonk9k-logo";

const navigationItems = [
  { path: '/home', label: 'Dashboard', icon: Home, description: 'Your Web3 loyalty hub' },
  { path: '/trading', label: 'Trading', icon: TrendingUp, description: 'Live $SLERF & $CHONK9K trading' },
  { path: '/staking', label: 'Staking', icon: Lock, description: 'Stake tokens and earn rewards' },
  { path: '/swap', label: 'Swap', icon: ArrowUpDown, description: 'Token swapping interface' },
  { path: '/community', label: 'Community', icon: Users, description: 'Trivia, achievements & leaderboard' },
  { path: '/slerf', label: '$SLERF Hub', icon: Zap, description: 'SLERF token trading hub' },
  { path: '/dao', label: 'DAO', icon: Vote, description: 'Governance and voting' },
  { path: '/playground', label: 'Playground', icon: Gamepad2, description: 'Token mascot interactions' },
  { path: '/terminal', label: 'Terminal', icon: Terminal, description: 'Hacker terminal interface' }
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const currentPage = navigationItems.find(item => item.path === location);

  return (
    <>
      {/* Mobile Navigation Trigger */}
      <div className="fixed top-4 left-4 z-50 sm:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-slate-800/90 backdrop-blur border-slate-600 hover:bg-slate-700/90"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-slate-900/95 backdrop-blur border-slate-700">
            <SheetHeader className="pb-6">
              <SheetTitle className="flex items-center space-x-3">
                <Chonk9kLogo size="sm" animated />
                <span className="text-white font-bold">Chonk9k Suite</span>
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-3">
              {navigationItems.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;

                return (
                  <Link key={item.path} href={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30' 
                          : 'hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="p-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-xs text-gray-400 mb-1">Current Page</div>
                <div className="text-sm text-white font-medium">
                  {currentPage?.label || 'Unknown'}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop/Tablet Breadcrumb */}
      <div className="hidden sm:block fixed top-4 left-4 z-50">
        <div className="flex items-center space-x-2 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-lg px-3 py-2">
          <Chonk9kLogo size="sm" animated />
          {currentPage && (
            <>
              <span className="text-gray-500">/</span>
              <span className="text-white font-medium">{currentPage.label}</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}