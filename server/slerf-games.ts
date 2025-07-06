import { storage } from "./storage";

// SLERF-themed trivia questions database
export const slerfTriviaQuestions = [
  {
    id: 1,
    question: "What blockchain network is SLERF token primarily built on?",
    options: ["Ethereum", "Base", "Polygon", "Arbitrum"],
    correctAnswer: 1,
    category: "blockchain",
    difficulty: "easy" as const,
    reward: 15
  },
  {
    id: 2,
    question: "SLERF is an ERC-20 token. What does ERC-20 represent?",
    options: ["Ethereum Request for Comments 20", "Ethereum Rewards Contract 20", "Ethereum Registry Code 20", "Ethereum Real Currency 20"],
    correctAnswer: 0,
    category: "technology",
    difficulty: "medium" as const,
    reward: 25
  },
  {
    id: 3,
    question: "What is the primary utility of SLERF tokens in the Boomchainlab ecosystem?",
    options: ["Governance voting", "Loyalty rewards and gamification", "Transaction fees", "Staking rewards"],
    correctAnswer: 1,
    category: "ecosystem",
    difficulty: "easy" as const,
    reward: 20
  },
  {
    id: 4,
    question: "Base network is a Layer 2 solution. What does this mean?",
    options: ["It's built on top of Ethereum", "It's faster than Ethereum", "It has lower fees", "All of the above"],
    correctAnswer: 3,
    category: "technology",
    difficulty: "medium" as const,
    reward: 30
  },
  {
    id: 5,
    question: "In Web3, what does 'DeFi' stand for?",
    options: ["Decentralized Finance", "Digital Finance", "Distributed Finance", "Delayed Finance"],
    correctAnswer: 0,
    category: "defi",
    difficulty: "easy" as const,
    reward: 15
  },
  {
    id: 6,
    question: "What is the maximum supply of SLERF tokens?",
    options: ["1 million", "10 million", "100 million", "1 billion"],
    correctAnswer: 2,
    category: "tokenomics",
    difficulty: "hard" as const,
    reward: 50
  },
  {
    id: 7,
    question: "Which consensus mechanism does Ethereum (and by extension Base) use?",
    options: ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"],
    correctAnswer: 1,
    category: "technology",
    difficulty: "medium" as const,
    reward: 25
  },
  {
    id: 8,
    question: "What does 'HODL' mean in crypto culture?",
    options: ["Hold On for Dear Life", "Hold Original Digital Ledger", "Holding Over Dynamic Losses", "It's just a misspelling of 'hold'"],
    correctAnswer: 3,
    category: "culture",
    difficulty: "easy" as const,
    reward: 10
  },
  {
    id: 9,
    question: "In the context of SLERF tokenomics, what is 'burning'?",
    options: ["Selling tokens quickly", "Permanently removing tokens from circulation", "Transferring tokens to cold storage", "Converting tokens to other cryptocurrencies"],
    correctAnswer: 1,
    category: "tokenomics",
    difficulty: "medium" as const,
    reward: 35
  },
  {
    id: 10,
    question: "What makes Base network special compared to Ethereum mainnet?",
    options: ["Lower gas fees", "Faster transactions", "Built by Coinbase", "All of the above"],
    correctAnswer: 3,
    category: "technology",
    difficulty: "hard" as const,
    reward: 45
  }
];

// Get random trivia question for daily challenge
export function getDailyTriviaQuestion(userId: number): typeof slerfTriviaQuestions[0] {
  // Use user ID and date to ensure same question per day per user
  const today = new Date().toDateString();
  const seed = userId + today.length;
  const questionIndex = seed % slerfTriviaQuestions.length;
  return slerfTriviaQuestions[questionIndex];
}

// Check if user completed trivia today
export async function checkTriviaCompletedToday(userId: number): Promise<boolean> {
  const today = new Date().toDateString();
  const activities = await storage.getUserActivities(userId, 50);
  return activities.some(activity => 
    activity.type === 'trivia_completed' && 
    new Date(activity.createdAt).toDateString() === today
  );
}

// Mining game logic
export class SlerfMiningGame {
  private activeSessions = new Map<string, {
    userId: number;
    startTime: Date;
    endTime: Date;
    clicks: number;
  }>();

  private userCooldowns = new Map<number, Date>();

  startMiningSession(userId: number): { sessionId: string; duration: number } {
    // Check cooldown
    const cooldown = this.userCooldowns.get(userId);
    if (cooldown && cooldown > new Date()) {
      throw new Error("Mining equipment still cooling down");
    }

    const sessionId = `mining_${userId}_${Date.now()}`;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30000); // 30 seconds

    this.activeSessions.set(sessionId, {
      userId,
      startTime,
      endTime,
      clicks: 0
    });

    return { sessionId, duration: 30 };
  }

  completeMiningSession(sessionId: string, clickCount: number): { reward: number } {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error("Invalid mining session");
    }

    // Calculate reward based on clicks (0.1 SLERF per click, minimum 1)
    const baseReward = Math.max(1, Math.floor(clickCount * 0.1));
    const timeBonus = session.endTime > new Date() ? 1.2 : 1; // 20% bonus for completing early
    const finalReward = Math.floor(baseReward * timeBonus);

    // Set cooldown (5 minutes)
    this.userCooldowns.set(session.userId, new Date(Date.now() + 300000));

    // Clean up session
    this.activeSessions.delete(sessionId);

    return { reward: finalReward };
  }

  getUserMiningStatus(userId: number) {
    const activeSession = Array.from(this.activeSessions.values())
      .find(session => session.userId === userId);
    
    const cooldown = this.userCooldowns.get(userId);
    const onCooldown = cooldown && cooldown > new Date();

    return {
      activeSession: activeSession ? {
        id: Array.from(this.activeSessions.keys()).find(key => 
          this.activeSessions.get(key) === activeSession
        ),
        startTime: activeSession.startTime,
        duration: 30,
        isActive: activeSession.endTime > new Date()
      } : null,
      onCooldown,
      cooldownRemaining: onCooldown ? Math.floor((cooldown!.getTime() - Date.now()) / 1000) : 0,
      totalMined: 0 // This would come from database in real implementation
    };
  }
}

// Price prediction game logic
export class SlerfPredictionGame {
  private currentRound: {
    id: string;
    startPrice: number;
    currentPrice: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
  } | null = null;

  private userPredictions = new Map<string, {
    userId: number;
    roundId: string;
    direction: 'up' | 'down';
    amount: number;
    startPrice: number;
  }>();

  constructor() {
    this.startNewRound();
    // Start new round every 5 minutes
    setInterval(() => this.startNewRound(), 300000);
  }

  private startNewRound() {
    const basePrice = 0.002300; // Mock SLERF price
    const volatility = 0.05; // 5% max change
    const priceChange = (Math.random() - 0.5) * volatility;
    const startPrice = basePrice * (1 + priceChange);

    this.currentRound = {
      id: `round_${Date.now()}`,
      startPrice,
      currentPrice: startPrice,
      startTime: new Date(),
      endTime: new Date(Date.now() + 300000), // 5 minutes
      isActive: true
    };

    // Simulate price movement
    const priceInterval = setInterval(() => {
      if (!this.currentRound || !this.currentRound.isActive) {
        clearInterval(priceInterval);
        return;
      }

      // Random price movement
      const change = (Math.random() - 0.5) * 0.002;
      this.currentRound.currentPrice *= (1 + change);

      // End round if time is up
      if (new Date() >= this.currentRound.endTime) {
        this.currentRound.isActive = false;
        clearInterval(priceInterval);
      }
    }, 1000);
  }

  getCurrentRound() {
    return this.currentRound;
  }

  submitPrediction(userId: number, direction: 'up' | 'down', amount: number) {
    if (!this.currentRound || !this.currentRound.isActive) {
      throw new Error("No active prediction round");
    }

    // Check if prediction window is still open (close 30 seconds before end)
    const timeToEnd = this.currentRound.endTime.getTime() - Date.now();
    if (timeToEnd < 30000) {
      throw new Error("Prediction window closed");
    }

    if (amount < 5 || amount > 100) {
      throw new Error("Bet amount must be between 5-100 SLERF");
    }

    const predictionKey = `${userId}_${this.currentRound.id}`;
    
    if (this.userPredictions.has(predictionKey)) {
      throw new Error("Already predicted for this round");
    }

    this.userPredictions.set(predictionKey, {
      userId,
      roundId: this.currentRound.id,
      direction,
      amount,
      startPrice: this.currentRound.startPrice
    });

    return { success: true };
  }

  getUserPrediction(userId: number) {
    if (!this.currentRound) return null;

    const predictionKey = `${userId}_${this.currentRound.id}`;
    const prediction = this.userPredictions.get(predictionKey);

    return prediction ? {
      hasPredicted: true,
      direction: prediction.direction,
      amount: prediction.amount
    } : { hasPredicted: false };
  }
}

// Global instances
export const miningGame = new SlerfMiningGame();
export const predictionGame = new SlerfPredictionGame();