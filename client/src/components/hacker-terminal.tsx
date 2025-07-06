import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Code, 
  Shield, 
  Lock, 
  Eye, 
  Zap, 
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Database,
  Activity,
  Target,
  AlertTriangle
} from 'lucide-react';
import TerminalTheme, { 
  TerminalCommand, 
  HackerStatusBar, 
  HackerButton, 
  TerminalCard 
} from './terminal-theme';
import MobileNavigation from './mobile-navigation';

const HackerTerminal: React.FC = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [networkData, setNetworkData] = useState({
    activeConnections: 1337,
    dataTransferred: 2.4,
    securityLevel: 99.8,
    uptime: 847392
  });

  const hackerCommands = [
    {
      command: "nmap -sS -O blockchain.network",
      output: (
        <div className="space-y-1">
          <div>Starting Nmap scan on blockchain.network...</div>
          <div className="text-green-500">PORT     STATE  SERVICE</div>
          <div>8545/tcp  open   ethereum-rpc</div>
          <div>30303/tcp open   ethereum-p2p</div>
          <div>443/tcp   open   https</div>
          <div className="text-yellow-400">Scan complete: 3 open ports detected</div>
        </div>
      )
    },
    {
      command: "web3-monitor --slerf --chonk9k",
      output: (
        <div className="space-y-1">
          <div className="text-cyan-400">🔍 Monitoring token contracts...</div>
          <div>$SLERF (Base): 0x233df63325933fa3f2dac8e695cd84bb2f91ab07</div>
          <div>$CHONK9K (Solana): [SCANNING...]</div>
          <div className="text-green-500">✓ Price feeds: ACTIVE</div>
          <div className="text-green-500">✓ Liquidity pools: MONITORED</div>
        </div>
      )
    },
    {
      command: "defi-exploit-scanner --target all",
      output: (
        <div className="space-y-1">
          <div className="text-red-400">⚠️  SCANNING FOR VULNERABILITIES...</div>
          <div>Flash loan attacks: 0 detected</div>
          <div>Reentrancy vulnerabilities: 0 found</div>
          <div>Price manipulation: MONITORING</div>
          <div className="text-green-500">✓ All systems secure</div>
        </div>
      )
    },
    {
      command: "mempool-sniffer --gas-tracker",
      output: (
        <div className="space-y-1">
          <div className="text-purple-400">⛽ Gas Tracker Active</div>
          <div>Current gas price: 23 gwei</div>
          <div>Pending transactions: 156,789</div>
          <div>MEV opportunities: 47 detected</div>
          <div className="text-yellow-400">📊 Frontrunning protection: ENABLED</div>
        </div>
      )
    }
  ];

  const systemStats = [
    { label: "CPU Usage", value: "23%", color: "text-green-400", icon: <Cpu className="w-4 h-4" /> },
    { label: "Memory", value: "1.2GB", color: "text-blue-400", icon: <HardDrive className="w-4 h-4" /> },
    { label: "Network", value: "87%", color: "text-purple-400", icon: <Wifi className="w-4 h-4" /> },
    { label: "Security", value: "99.8%", color: "text-green-500", icon: <Shield className="w-4 h-4" /> }
  ];

  const activeProcesses = [
    "web3-scanner.exe",
    "price-monitor.py", 
    "mempool-watcher.js",
    "defi-guardian.rs",
    "token-analyzer.go"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(prev => ({
        ...prev,
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 10) - 5,
        dataTransferred: prev.dataTransferred + Math.random() * 0.1,
        uptime: prev.uptime + 1
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newLine = `[${new Date().toLocaleTimeString()}] Network scan completed - ${Math.floor(Math.random() * 1000)} nodes discovered`;
      setTerminalLines(prev => [...prev, newLine].slice(-10));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 w-full font-mono">
      <MobileNavigation />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Matrix Rain Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 text-green-500/10 text-xs animate-pulse"
            style={{
              left: `${i * 6.67}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {[...Array(100)].map((_, j) => (
              <div key={j} className="block leading-3">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold mb-2 text-green-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ┌─[ BOOMCHAIN TERMINAL ]─┐
          </motion.h1>
          <motion.p 
            className="text-green-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            │ Advanced Web3 Command Center │
          </motion.p>
          <div className="text-green-500 text-sm mt-2">
            └──────────────────────────────┘
          </div>
        </div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <HackerStatusBar />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <TerminalTheme terminalTitle="root@boomchain-labs:~#" className="h-96">
              <div className="space-y-4">
                {hackerCommands.slice(0, currentCommand + 1).map((cmd, index) => (
                  <TerminalCommand
                    key={index}
                    command={cmd.command}
                    output={cmd.output}
                    isTyping={index === currentCommand}
                    delay={index * 2}
                  />
                ))}
              </div>
              
              {currentCommand < hackerCommands.length - 1 && (
                <div className="mt-4">
                  <HackerButton
                    onClick={() => setCurrentCommand(prev => Math.min(prev + 1, hackerCommands.length - 1))}
                    className="w-full"
                  >
                    <Terminal className="w-4 h-4" />
                    Execute Next Command
                  </HackerButton>
                </div>
              )}
            </TerminalTheme>
          </motion.div>

          {/* System Monitor */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <TerminalCard title="SYSTEM_MONITOR.exe">
              <div className="grid grid-cols-2 gap-4">
                {systemStats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className={stat.color}>{stat.icon}</span>
                    <div>
                      <div className="text-xs text-green-600">{stat.label}</div>
                      <div className={`font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TerminalCard>

            <TerminalCard title="ACTIVE_PROCESSES.log">
              <div className="space-y-2">
                {activeProcesses.map((process, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-green-400">{process}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600">RUNNING</span>
                    </div>
                  </div>
                ))}
              </div>
            </TerminalCard>

            <TerminalCard title="NETWORK_ANALYZER.py">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Active Connections:</span>
                  <span className="text-cyan-400">{networkData.activeConnections.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Transferred:</span>
                  <span className="text-blue-400">{networkData.dataTransferred.toFixed(2)} TB</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Level:</span>
                  <span className="text-green-500">{networkData.securityLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="text-purple-400">{Math.floor(networkData.uptime / 3600)}h {Math.floor((networkData.uptime % 3600) / 60)}m</span>
                </div>
              </div>
            </TerminalCard>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <HackerButton
            onClick={runScan}
            disabled={isScanning}
            variant="primary"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                SCANNING...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                NETWORK SCAN
              </>
            )}
          </HackerButton>

          <HackerButton
            onClick={() => window.location.href = '/trading'}
            variant="secondary"
          >
            <Activity className="w-4 h-4" />
            TRADING INTERFACE
          </HackerButton>

          <HackerButton
            onClick={() => window.location.href = '/dao'}
            variant="secondary"
          >
            <Shield className="w-4 h-4" />
            DAO GOVERNANCE
          </HackerButton>

          <HackerButton
            onClick={() => window.location.href = '/playground'}
            variant="primary"
          >
            <Code className="w-4 h-4" />
            TOKEN LAB
          </HackerButton>
        </motion.div>

        {/* Live Terminal Feed */}
        {terminalLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <TerminalCard title="LIVE_FEED.log">
              <div className="space-y-1 max-h-40 overflow-y-auto">
                <AnimatePresence>
                  {terminalLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-green-300 text-sm"
                    >
                      {line}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TerminalCard>
          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
};

export default HackerTerminal;