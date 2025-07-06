import { 
  users, tasks, userTasks, tokenBalances, referrals, activities,
  type User, type InsertUser, type UpsertUser, type Task, type InsertTask, 
  type UserTask, type InsertUserTask, type TokenBalance, type InsertTokenBalance,
  type Referral, type InsertReferral, type Activity, type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte } from "drizzle-orm";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getUserStats(userId: string): Promise<{
    totalRewards: number;
    tasksCompleted: number;
    referralCount: number;
    loyaltyScore: number;
    pendingRewards: number;
    referralEarnings: number;
    loginStreak: number;
  }>;

  // Task operations
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  
  // User task operations
  getUserTasks(userId: string): Promise<UserTask[]>;
  completeUserTask(userTask: InsertUserTask): Promise<UserTask>;
  getCompletedTasksToday(userId: string): Promise<UserTask[]>;
  resetDailyTasks(userId: string): Promise<void>;
  
  // Token balance operations
  getUserTokenBalances(userId: string): Promise<TokenBalance[]>;
  updateTokenBalance(userId: string, tokenSymbol: string, balance: number): Promise<TokenBalance>;
  
  // Referral operations
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(userId: string): Promise<Referral[]>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
  
  // Claims
  claimRewards(userId: string): Promise<{ claimed: number }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeTasks();
  }

  private async initializeTasks() {
    // Initialize default tasks if they don't exist
    const existingTasks = await db.select().from(tasks);
    
    if (existingTasks.length === 0) {
      const defaultTasks = [
        { name: "Daily Check-in", description: "Complete your daily check-in", reward: 10, taskType: "daily", icon: "Calendar", buttonText: "Check In" },
        { name: "Share on Social", description: "Share Chonk9k on social media", reward: 25, taskType: "daily", icon: "Share", buttonText: "Share" },
        { name: "Invite Friend", description: "Invite a friend to join Chonk9k", reward: 50, taskType: "weekly", icon: "UserPlus", buttonText: "Invite" },
        { name: "Connect Wallet", description: "Connect your crypto wallet", reward: 100, taskType: "one_time", icon: "Wallet", buttonText: "Connect" },
        { name: "Trade Tokens", description: "Make your first token trade", reward: 75, taskType: "one_time", icon: "TrendingUp", buttonText: "Trade" },
        { name: "Complete Profile", description: "Fill out your profile information", reward: 30, taskType: "one_time", icon: "User", buttonText: "Complete" }
      ];
      
      await db.insert(tasks).values(defaultTasks);
    }
  }

  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    // Initialize token balances
    await this.updateTokenBalance(user.id, "SLERF", 1247);
    await this.updateTokenBalance(user.id, "CHONKPUMP", 892);
    
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  async getUserStats(userId: string): Promise<{
    totalRewards: number;
    tasksCompleted: number;
    referralCount: number;
    loyaltyScore: number;
    pendingRewards: number;
    referralEarnings: number;
    loginStreak: number;
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      totalRewards: user.totalRewards || 0,
      tasksCompleted: user.tasksCompleted || 0,
      referralCount: user.referralCount || 0,
      loyaltyScore: user.loyaltyScore || 0,
      pendingRewards: user.pendingRewards || 0,
      referralEarnings: user.referralEarnings || 0,
      loginStreak: user.loginStreak || 0,
    };
  }

  // Task operations
  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.isActive, true));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  // User task operations
  async getUserTasks(userId: string): Promise<UserTask[]> {
    return await db.select().from(userTasks).where(eq(userTasks.userId, userId));
  }

  async completeUserTask(insertUserTask: InsertUserTask): Promise<UserTask> {
    const [userTask] = await db
      .insert(userTasks)
      .values({
        ...insertUserTask,
        completedAt: new Date(),
      })
      .returning();
    return userTask;
  }

  async getCompletedTasksToday(userId: string): Promise<UserTask[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await db.select().from(userTasks).where(
      and(
        eq(userTasks.userId, userId),
        gte(userTasks.completedAt, today)
      )
    );
  }

  async resetDailyTasks(userId: string): Promise<void> {
    // Implementation for resetting daily tasks
    // This would typically mark tasks as ready to be completed again
  }

  // Token balance operations
  async getUserTokenBalances(userId: string): Promise<TokenBalance[]> {
    return await db.select().from(tokenBalances).where(eq(tokenBalances.userId, userId));
  }

  async updateTokenBalance(userId: string, tokenSymbol: string, balance: number): Promise<TokenBalance> {
    const existing = await db.select().from(tokenBalances).where(
      and(
        eq(tokenBalances.userId, userId),
        eq(tokenBalances.tokenSymbol, tokenSymbol)
      )
    );

    if (existing.length > 0) {
      const [updated] = await db
        .update(tokenBalances)
        .set({ balance })
        .where(eq(tokenBalances.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [newBalance] = await db
        .insert(tokenBalances)
        .values({
          userId,
          tokenSymbol,
          balance,
          chainType: tokenSymbol === "SLERF" ? "base" : "solana",
        })
        .returning();
      return newBalance;
    }
  }

  // Referral operations
  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db
      .insert(referrals)
      .values({
        ...insertReferral,
        createdAt: new Date(),
      })
      .returning();
    return referral;
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return await db.select().from(referrals).where(eq(referrals.referrerId, userId));
  }

  // Activity operations
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values({
        ...insertActivity,
        createdAt: new Date(),
      })
      .returning();
    return activity;
  }

  async getUserActivities(userId: string, limit = 10): Promise<Activity[]> {
    return await db.select().from(activities)
      .where(eq(activities.userId, userId))
      .limit(limit);
  }

  // Claims
  async claimRewards(userId: string): Promise<{ claimed: number }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const pendingRewards = user.pendingRewards || 0;
    
    if (pendingRewards > 0) {
      await this.updateUser(userId, {
        pendingRewards: 0,
        totalRewards: (user.totalRewards || 0) + pendingRewards,
      });

      // Log the claim activity
      await this.createActivity({
        userId,
        type: "tokens_claimed",
        description: `Claimed ${pendingRewards} tokens`,
        reward: pendingRewards,
      });
    }

    return { claimed: pendingRewards };
  }
}

export const storage = new DatabaseStorage();