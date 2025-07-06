import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserTaskSchema, insertReferralSchema } from "@shared/schema";
import { z } from "zod";
import { web3Service } from "./web3-service";
import { 
  getDailyTriviaQuestion, 
  checkTriviaCompletedToday, 
  miningGame, 
  predictionGame 
} from "./slerf-games";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Connect wallet and create/get user
  app.post("/api/connect-wallet", async (req, res) => {
    try {
      const { walletAddress, chainType } = insertUserSchema.parse(req.body);
      
      let user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          walletAddress,
          chainType,
          username: `User_${walletAddress.slice(0, 6)}`,
          lastLoginAt: new Date()
        });
      } else {
        // Update last login and streak
        const lastLogin = user.lastLoginAt;
        const now = new Date();
        const daysSinceLastLogin = lastLogin 
          ? Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        
        let newStreak = user.loginStreak || 0;
        if (daysSinceLastLogin === 1) {
          newStreak += 1;
        } else if (daysSinceLastLogin > 1) {
          newStreak = 1;
        }
        
        user = await storage.updateUser(user.id, {
          lastLoginAt: now,
          loginStreak: newStreak,
          loyaltyScore: Math.min(100, Math.floor(
            (newStreak * 5) + 
            (user.referralCount || 0) * 3 + 
            (user.tasksCompleted || 0) * 2 +
            Math.min(50, Math.floor(((now.getTime() - (user.createdAt?.getTime() || now.getTime())) / (1000 * 60 * 60 * 24 * 365)) * 20))
          ))
        });
      }
      
      const stats = await storage.getUserStats(user.id);
      
      // Get user token balances - combine stored and real blockchain data
      let tokenBalances = await storage.getUserTokenBalances(user.id);
      
      // Try to get real blockchain balances
      try {
        const realBalances = await web3Service.getTokenBalances(user.walletAddress, user.chainType);
        
        // Update stored balances with real data
        for (const realBalance of realBalances) {
          await storage.updateTokenBalance(user.id, realBalance.tokenSymbol, realBalance.balance);
        }
        
        // Get updated balances
        tokenBalances = await storage.getUserTokenBalances(user.id);
      } catch (error) {
        console.log('Using stored token balances due to Web3 error:', error);
      }
      
      res.json({
        user,
        stats,
        tokenBalances
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  // Get all available tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Get user's task completion status
  app.get("/api/tasks/status/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userTasks = await storage.getUserTasks(userId);
      const completedToday = await storage.getCompletedTasksToday(userId);
      
      res.json({
        userTasks,
        completedToday: completedToday.map(ut => ut.taskId)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task status" });
    }
  });

  // Complete a task
  app.post("/api/tasks/complete", async (req, res) => {
    try {
      const { userId, taskId } = insertUserTaskSchema.parse(req.body);
      
      // Check if task was already completed today
      const completedToday = await storage.getCompletedTasksToday(userId!);
      const alreadyCompleted = completedToday.some(ut => ut.taskId === taskId);
      
      if (alreadyCompleted) {
        return res.status(400).json({ error: "Task already completed today" });
      }
      
      const userTask = await storage.completeUserTask({
        userId,
        taskId,
        canReset: true
      });
      
      const task = await storage.getTask(taskId!);
      
      res.json({
        userTask,
        reward: task?.reward || 0,
        message: `Task completed! Earned ${task?.reward || 0} $SLERF`
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  // Register referral
  app.post("/api/referral/register", async (req, res) => {
    try {
      const { referrerId, referredUserId } = insertReferralSchema.parse(req.body);
      
      // Check if referral already exists
      const existingReferrals = await storage.getUserReferrals(referrerId!);
      const alreadyReferred = existingReferrals.some(r => r.referredUserId === referredUserId);
      
      if (alreadyReferred) {
        return res.status(400).json({ error: "User already referred" });
      }
      
      const referral = await storage.createReferral({
        referrerId,
        referredUserId,
        rewardEarned: 30
      });
      
      res.json({
        referral,
        message: "Referral registered successfully! Earned 30 $SLERF"
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  // Get referral stats
  app.get("/api/referral/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const referrals = await storage.getUserReferrals(userId);
      const user = await storage.getUser(userId);
      
      res.json({
        totalReferrals: referrals.length,
        totalEarnings: user?.referralEarnings || 0,
        conversionRate: referrals.length > 0 ? 68 : 0, // Mock conversion rate
        referralLink: `https://chonk9k.com/ref/${user?.walletAddress || 'unknown'}`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  // Get loyalty score
  app.get("/api/loyalty-score/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Calculate wallet age in years
      const walletAge = user.createdAt 
        ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365) * 10) / 10
        : 0;
      
      res.json({
        loyaltyScore: user.loyaltyScore || 0,
        factors: {
          loginStreak: user.loginStreak || 0,
          walletAge,
          referralCount: user.referralCount || 0,
          tasksCompleted: user.tasksCompleted || 0
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loyalty score" });
    }
  });

  // Claim rewards
  app.post("/api/claim", async (req, res) => {
    try {
      const { userId } = z.object({ userId: z.number() }).parse(req.body);
      
      const result = await storage.claimRewards(userId);
      
      res.json({
        claimed: result.claimed,
        message: `Successfully claimed ${result.claimed} $SLERF tokens!`
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  // Get user activities
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activities = await storage.getUserActivities(userId, 10);
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Get user dashboard data
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const stats = await storage.getUserStats(userId);
      const tokenBalances = await storage.getUserTokenBalances(userId);
      const activities = await storage.getUserActivities(userId, 5);
      const tasks = await storage.getAllTasks();
      const completedToday = await storage.getCompletedTasksToday(userId);
      
      res.json({
        user,
        stats,
        tokenBalances,
        activities,
        tasks,
        completedTaskIds: completedToday.map(ut => ut.taskId)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Get real-time Web3 network status
  app.get("/api/web3/status", async (req, res) => {
    try {
      const status = await web3Service.getNetworkStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network status" });
    }
  });

  // Validate wallet address
  app.post("/api/web3/validate", async (req, res) => {
    try {
      const { address, chainType } = req.body;
      const isValid = await web3Service.validateWalletAddress(address, chainType);
      res.json({ isValid });
    } catch (error) {
      res.status(400).json({ error: "Invalid validation request" });
    }
  });

  // Get current token prices
  app.get("/api/web3/prices", async (req, res) => {
    try {
      const prices = await web3Service.getTokenPrices();
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch token prices" });
    }
  });

  // Get real token balances for a wallet
  app.post("/api/web3/balances", async (req, res) => {
    try {
      const { walletAddress, chainType } = req.body;
      const balances = await web3Service.getTokenBalances(walletAddress, chainType);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch token balances" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
