import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Cpu, HardDrive, Wifi, Lock, Eye, Zap } from 'lucide-react';

interface TerminalThemeProps {
  children?: React.ReactNode;
  showHeader?: boolean;
  terminalTitle?: string;
  className?: string;
}

const TerminalTheme: React.FC<TerminalThemeProps> = ({ 
  children, 
  showHeader = true, 
  terminalTitle = "boomchain@web3:~$",
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(23);
  const [networkActivity, setNetworkActivity] = useState(87);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCpuUsage(Math.floor(Math.random() * 40) + 15);
      setNetworkActivity(Math.floor(Math.random() * 30) + 70);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`bg-black border-2 border-green-500/50 rounded-lg overflow-hidden font-mono shadow-2xl shadow-green-500/20 ${className}`}>
      {showHeader && (
        <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-b border-green-500/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-bold">{terminalTitle}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-xs">
              <div className="flex items-center space-x-1 text-green-400">
                <Cpu className="w-3 h-3" />
                <span>CPU: {cpuUsage}%</span>
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <Wifi className="w-3 h-3" />
                <span>NET: {networkActivity}%</span>
              </div>
              <div className="text-green-500 text-xs">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-black text-green-400 p-4 min-h-[200px] relative overflow-hidden">
        {/* Matrix-style background effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="matrix-rain"></div>
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export const TerminalCommand: React.FC<{ 
  command: string; 
  output?: React.ReactNode; 
  isTyping?: boolean;
  delay?: number;
}> = ({ command, output, isTyping = false, delay = 0 }) => {
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (isTyping) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < command.length) {
          setDisplayedCommand(command.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          setTimeout(() => setShowOutput(true), 500);
        }
      }, 50);
      
      return () => clearInterval(timer);
    } else {
      setDisplayedCommand(command);
      setShowOutput(true);
    }
  }, [command, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="mb-4"
    >
      <div className="flex items-center space-x-2">
        <span className="text-green-500">$</span>
        <span className="text-green-400 font-mono">
          {displayedCommand}
          {isTyping && <span className="animate-pulse">_</span>}
        </span>
      </div>
      
      <AnimatePresence>
        {showOutput && output && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 pl-4 text-green-300"
          >
            {output}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const HackerStatusBar: React.FC = () => {
  const [status, setStatus] = useState<string>('CONNECTED');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      const statuses = ['CONNECTED', 'SCANNING', 'MINING', 'TRADING', 'SECURE'];
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black border border-green-500/30 rounded-lg p-3 font-mono">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400">STATUS: {status}</span>
        </div>
        <div className="flex items-center space-x-2">
          <HardDrive className="w-3 h-3 text-green-400" />
          <span className="text-green-400">UPTIME: {Math.floor(uptime / 60)}m {uptime % 60}s</span>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="w-3 h-3 text-green-400" />
          <span className="text-green-400">ENCRYPTED</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-3 h-3 text-green-400" />
          <span className="text-green-400">MONITORING</span>
        </div>
      </div>
    </div>
  );
};

export const MatrixRain: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-green-500/20 text-xs font-mono animate-pulse"
          style={{
            left: `${i * 5}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        >
          {[...Array(50)].map((_, j) => (
            <div key={j} className="block">
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const HackerButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-green-900/50 border-green-500 text-green-400 hover:bg-green-800/50 hover:text-green-300',
    secondary: 'bg-blue-900/50 border-blue-500 text-blue-400 hover:bg-blue-800/50 hover:text-blue-300',
    danger: 'bg-red-900/50 border-red-500 text-red-400 hover:bg-red-800/50 hover:text-red-300'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        border-2 px-6 py-3 font-mono font-bold rounded-lg transition-all duration-300
        shadow-lg relative overflow-hidden group
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>
    </motion.button>
  );
};

export const TerminalCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-black border border-green-500/30 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-green-900/20 border-b border-green-500/30 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-mono font-bold text-sm">{title}</span>
        </div>
      </div>
      <div className="p-4 text-green-300 font-mono">
        {children}
      </div>
    </div>
  );
};

export default TerminalTheme;