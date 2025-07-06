export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" stroke="url(#gridGradient)" />
        </svg>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {/* Primary Orb */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
            animation: 'float-1 20s ease-in-out infinite',
            top: '10%',
            left: '20%',
          }}
        />
        
        {/* Secondary Orb */}
        <div 
          className="absolute w-48 h-48 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            animation: 'float-2 25s ease-in-out infinite',
            top: '60%',
            right: '15%',
          }}
        />

        {/* Tertiary Orb */}
        <div 
          className="absolute w-32 h-32 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            animation: 'float-3 15s ease-in-out infinite',
            bottom: '20%',
            left: '70%',
          }}
        />
      </div>

      {/* Data Stream Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/60 to-transparent animate-pulse" />
        </div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
            style={{ animation: 'data-flow 3s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* Particle System */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-500/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}