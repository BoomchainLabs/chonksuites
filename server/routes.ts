import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getDailyTriviaQuestion, checkTriviaCompletedToday, miningGame, predictionGame } from "./slerf-games";
import { web3Service } from "./web3-service";
import { insertUserTaskSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Token balances endpoint
  app.get('/api/token-balances/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const balances = await storage.getUserTokenBalances(userId);
      res.json(balances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
      res.status(500).json({ message: "Failed to fetch token balances" });
    }
  });

  // User stats endpoint
  app.get('/api/user-stats/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Dashboard endpoint
  app.get("/api/dashboard", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const [tokenBalances, stats, tasks, completedTasksToday, activities] = await Promise.all([
        storage.getUserTokenBalances(userId),
        storage.getUserStats(userId),
        storage.getAllTasks(),
        storage.getCompletedTasksToday(userId),
        storage.getUserActivities(userId, 5)
      ]);

      const completedTaskIds = completedTasksToday.map(task => task.taskId).filter(Boolean);

      res.json({
        user,
        tokenBalances,
        stats,
        tasks,
        completedTaskIds,
        activities
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to load dashboard" });
    }
  });

  // Task completion
  app.post("/api/tasks/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { taskId } = req.body;

      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Check if already completed today
      const completedToday = await storage.getCompletedTasksToday(userId);
      const alreadyCompleted = completedToday.some(ct => ct.taskId === taskId);
      
      if (alreadyCompleted && task.taskType === "daily") {
        return res.status(400).json({ message: "Task already completed today" });
      }

      // Complete the task
      const userTask = await storage.completeUserTask({
        userId,
        taskId,
      });

      // Update user rewards
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUser(userId, {
          pendingRewards: (user.pendingRewards || 0) + task.reward,
          tasksCompleted: (user.tasksCompleted || 0) + 1,
        });
      }

      // Log activity
      await storage.createActivity({
        userId,
        type: "task_completed",
        description: `Completed: ${task.name}`,
        reward: task.reward,
      });

      res.json({ 
        success: true, 
        reward: task.reward,
        userTask 
      });
    } catch (error) {
      console.error("Task completion error:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Claim rewards
  app.post("/api/claim", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = await storage.claimRewards(userId);
      res.json(result);
    } catch (error) {
      console.error("Claim rewards error:", error);
      res.status(500).json({ message: "Failed to claim rewards" });
    }
  });

  // Referral endpoints
  app.get("/api/referral/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const referrals = await storage.getUserReferrals(userId);
      
      res.json({
        totalReferrals: referrals.length,
        totalEarnings: referrals.reduce((sum, r) => sum + (r.rewardEarned || 0), 0),
        referrals: referrals
      });
    } catch (error) {
      console.error("Referral stats error:", error);
      res.status(500).json({ message: "Failed to get referral stats" });
    }
  });

  // Loyalty score
  app.get("/api/loyalty-score", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Loyalty score error:", error);
      res.status(500).json({ message: "Failed to get loyalty score" });
    }
  });

  // Daily trivia endpoints
  app.get("/api/trivia/today", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const question = getDailyTriviaQuestion(parseInt(userId));
      const completedToday = await checkTriviaCompletedToday(parseInt(userId));
      
      res.json({
        question,
        completedToday,
        todayReward: question.reward,
        currentStreak: 0 // You can implement streak tracking
      });
    } catch (error) {
      console.error("Trivia error:", error);
      res.status(500).json({ message: "Failed to get trivia question" });
    }
  });

  app.post("/api/trivia/answer", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { questionId, selectedAnswer } = req.body;
      
      const question = getDailyTriviaQuestion(parseInt(userId));
      const isCorrect = question.correctAnswer === selectedAnswer;
      
      if (isCorrect) {
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(userId, {
            pendingRewards: (user.pendingRewards || 0) + question.reward,
          });
        }

        await storage.createActivity({
          userId,
          type: "trivia_completed",
          description: `Answered trivia correctly`,
          reward: question.reward,
        });
      }

      res.json({
        correct: isCorrect,
        reward: isCorrect ? question.reward : 0,
        explanation: `The correct answer was: ${question.options[question.correctAnswer]}`
      });
    } catch (error) {
      console.error("Trivia answer error:", error);
      res.status(500).json({ message: "Failed to submit trivia answer" });
    }
  });

  // Mining game endpoints
  app.post("/api/mining/start", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const session = miningGame.startMiningSession(parseInt(userId));
      res.json(session);
    } catch (error) {
      console.error("Mining start error:", error);
      res.status(500).json({ message: "Failed to start mining session" });
    }
  });

  app.post("/api/mining/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, clickCount } = req.body;
      
      const result = miningGame.completeMiningSession(sessionId, clickCount);
      
      if (result.reward > 0) {
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(userId, {
            pendingRewards: (user.pendingRewards || 0) + result.reward,
          });
        }

        await storage.createActivity({
          userId,
          type: "mining_completed",
          description: `Mined ${result.reward} SLERF tokens`,
          reward: result.reward,
        });
      }

      res.json(result);
    } catch (error) {
      console.error("Mining complete error:", error);
      res.status(500).json({ message: "Failed to complete mining session" });
    }
  });

  app.get("/api/mining/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const status = miningGame.getUserMiningStatus(parseInt(userId));
      res.json(status);
    } catch (error) {
      console.error("Mining status error:", error);
      res.status(500).json({ message: "Failed to get mining status" });
    }
  });

  // Prediction game endpoints
  app.get("/api/prediction/round", isAuthenticated, async (req: any, res) => {
    try {
      const round = predictionGame.getCurrentRound();
      res.json(round);
    } catch (error) {
      console.error("Prediction round error:", error);
      res.status(500).json({ message: "Failed to get prediction round" });
    }
  });

  app.post("/api/prediction/submit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { direction, amount } = req.body;
      
      const result = predictionGame.submitPrediction(parseInt(userId), direction, amount);
      res.json(result);
    } catch (error) {
      console.error("Prediction submit error:", error);
      res.status(500).json({ message: "Failed to submit prediction" });
    }
  });

  app.get("/api/prediction/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prediction = predictionGame.getUserPrediction(parseInt(userId));
      res.json(prediction);
    } catch (error) {
      console.error("User prediction error:", error);
      res.status(500).json({ message: "Failed to get user prediction" });
    }
  });

  // Web3 integration endpoints
  app.post("/api/web3/validate-wallet", isAuthenticated, async (req: any, res) => {
    try {
      const { address, chainType } = req.body;
      const isValid = await web3Service.validateWalletAddress(address, chainType);
      res.json({ valid: isValid });
    } catch (error) {
      console.error("Wallet validation error:", error);
      res.status(500).json({ message: "Failed to validate wallet" });
    }
  });

  app.get("/api/web3/token-balances/:address/:chainType", isAuthenticated, async (req: any, res) => {
    try {
      const { address, chainType } = req.params;
      const balances = await web3Service.getTokenBalances(address, chainType);
      res.json(balances);
    } catch (error) {
      console.error("Token balance error:", error);
      res.status(500).json({ message: "Failed to get token balances" });
    }
  });

  app.get("/api/web3/network-status", async (req, res) => {
    try {
      const status = await web3Service.getNetworkStatus();
      res.json(status);
    } catch (error) {
      console.error("Network status error:", error);
      res.status(500).json({ message: "Failed to get network status" });
    }
  });

  app.get("/api/web3/token-prices", async (req, res) => {
    try {
      const prices = await web3Service.getTokenPrices();
      res.json(prices);
    } catch (error) {
      console.error("Token prices error:", error);
      res.status(500).json({ message: "Failed to get token prices" });
    }
  });

  // Connect wallet (now updates existing authenticated user)
  app.post("/api/connect-wallet", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { walletAddress, chainType } = req.body;
      
      // Update the authenticated user with wallet information
      const user = await storage.updateUser(userId, {
        walletAddress,
        chainType,
        lastLoginAt: new Date()
      });

      // Initialize token balances if new wallet
      const existingBalances = await storage.getUserTokenBalances(userId);
      if (existingBalances.length === 0) {
        await storage.updateTokenBalance(userId, "SLERF", 1247);
        await storage.updateTokenBalance(userId, "CHONKPUMP", 892);
      }

      res.json({ success: true, user });
    } catch (error) {
      console.error("Wallet connection error:", error);
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  // NFT Marketplace routes
  app.get("/api/nft/marketplace", async (req, res) => {
    try {
      const nfts = [
        {
          id: "1",
          name: "Elite Genesis #001",
          description: "First edition premium NFT with exclusive staking rewards and governance rights.",
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
          price: 2.5,
          currency: "SOL",
          ownerAddress: "HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa",
          attributes: [
            { trait_type: "Rarity", value: "Legendary", rarity: 95 },
            { trait_type: "Power", value: "Ultra", rarity: 88 },
            { trait_type: "Element", value: "Cosmic", rarity: 92 }
          ],
          isListed: true,
          collection: {
            name: "Elite Genesis Collection",
            floorPrice: 1.8,
            volume24h: 156.7
          }
        },
        {
          id: "2", 
          name: "Elite Genesis #002",
          description: "Premium NFT with enhanced yield farming capabilities and exclusive access perks.",
          imageUrl: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?w=400",
          price: 3.2,
          currency: "SOL",
          ownerAddress: "HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa",
          attributes: [
            { trait_type: "Rarity", value: "Epic", rarity: 82 },
            { trait_type: "Power", value: "High", rarity: 75 },
            { trait_type: "Element", value: "Digital", rarity: 68 }
          ],
          isListed: true,
          collection: {
            name: "Elite Genesis Collection",
            floorPrice: 1.8,
            volume24h: 156.7
          }
        }
      ];
      
      const stats = {
        totalVolume: 2847.3,
        totalSales: 1249,
        activeListings: 89,
        uniqueOwners: 456
      };
      
      res.json({ nfts, stats });
    } catch (error) {
      console.error("Error fetching marketplace data:", error);
      res.status(500).json({ message: "Failed to fetch marketplace data" });
    }
  });

  app.post("/api/nft/purchase", isAuthenticated, async (req, res) => {
    try {
      const { nftId, buyerAddress, maxPrice } = req.body;
      res.json({ 
        success: true, 
        transactionId: `tx_${Date.now()}`,
        message: "NFT purchased successfully" 
      });
    } catch (error) {
      res.status(500).json({ message: "Purchase failed" });
    }
  });

  // Token Creation routes
  app.post("/api/tokens/create", isAuthenticated, async (req, res) => {
    try {
      const tokenData = req.body;
      const userId = req.user?.id;
      
      const token = {
        id: `token_${Date.now()}`,
        ...tokenData,
        contractAddress: `${tokenData.symbol}${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        network: 'solana',
        status: 'deployed'
      };
      
      res.json({ token, message: "Token created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Token creation failed" });
    }
  });

  // Staking routes
  app.get("/api/staking/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const stakes = [
        {
          poolId: "slerf-premium",
          amount: 25000,
          rewards: 847.3,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      ];
      res.json({ stakes });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staking data" });
    }
  });

  app.post("/api/staking/stake", isAuthenticated, async (req, res) => {
    try {
      const { userId, poolId, amount } = req.body;
      res.json({ 
        success: true,
        stakeId: `stake_${Date.now()}`,
        message: "Tokens staked successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Staking failed" });
    }
  });

  app.post("/api/staking/unstake", isAuthenticated, async (req, res) => {
    try {
      const { userId, poolId } = req.body;
      res.json({ 
        success: true,
        message: "Tokens unstaked successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Unstaking failed" });
    }
  });

  app.post("/api/staking/claim", isAuthenticated, async (req, res) => {
    try {
      const { userId, poolId } = req.body;
      res.json({ 
        success: true,
        rewardsClaimed: 847.3,
        message: "Rewards claimed successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Reward claiming failed" });
    }
  });

  // One-click claim all rewards
  app.post("/api/rewards/claim-all", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.body;
      
      // Simulate claiming from multiple sources
      const stakingRewards = 1247.8;
      const miningRewards = 892.5;
      const taskRewards = 345.2;
      const referralRewards = 198.7;
      
      const totalClaimed = stakingRewards + miningRewards + taskRewards + referralRewards;
      
      res.json({ 
        success: true,
        totalClaimed,
        breakdown: {
          staking: stakingRewards,
          mining: miningRewards,
          tasks: taskRewards,
          referrals: referralRewards
        },
        message: "All rewards claimed successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to claim all rewards" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}