import { 
  users, tasks, userTasks, tokenBalances, referrals, activities,
  type User, type InsertUser, type Task, type InsertTask, 
  type UserTask, type InsertUserTask, type TokenBalance, type InsertTokenBalance,
  type Referral, type InsertReferral, type Activity, type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  getUserStats(userId: number): Promise<{
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
  getUserTasks(userId: number): Promise<UserTask[]>;
  completeUserTask(userTask: InsertUserTask): Promise<UserTask>;
  getCompletedTasksToday(userId: number): Promise<UserTask[]>;
  resetDailyTasks(userId: number): Promise<void>;
  
  // Token balance operations
  getUserTokenBalances(userId: number): Promise<TokenBalance[]>;
  updateTokenBalance(userId: number, tokenSymbol: string, balance: number): Promise<TokenBalance>;
  
  // Referral operations
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(userId: number): Promise<Referral[]>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: number, limit?: number): Promise<Activity[]>;
  
  // Claims
  claimRewards(userId: number): Promise<{ claimed: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private userTasks: Map<number, UserTask>;
  private tokenBalances: Map<number, TokenBalance>;
  private referrals: Map<number, Referral>;
  private activities: Map<number, Activity>;
  private currentUserId: number;
  private currentTaskId: number;
  private currentUserTaskId: number;
  private currentTokenBalanceId: number;
  private currentReferralId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.userTasks = new Map();
    this.tokenBalances = new Map();
    this.referrals = new Map();
    this.activities = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
    this.currentUserTaskId = 1;
    this.currentTokenBalanceId = 1;
    this.currentReferralId = 1;
    this.currentActivityId = 1;
    
    // Initialize default tasks
    this.initializeTasks();
  }

  private initializeTasks() {
    const defaultTasks = [
      {
        name: "Daily Login",
        description: "Sign in to your account",
        reward: 10,
        taskType: "daily",
        isActive: true,
        icon: "fas fa-check",
        buttonText: "Complete"
      },
      {
        name: "Complete Quiz",
        description: "Answer Web3 knowledge questions",
        reward: 25,
        taskType: "daily",
        isActive: true,
        icon: "fas fa-question",
        buttonText: "Start Quiz"
      },
      {
        name: "Share on Twitter",
        description: "Tweet with #Chonk9k hashtag",
        reward: 20,
        taskType: "daily",
        isActive: true,
        icon: "fab fa-twitter",
        buttonText: "Tweet"
      },
      {
        name: "Invite Friends",
        description: "Refer new users to the platform",
        reward: 30,
        taskType: "daily",
        isActive: true,
        icon: "fas fa-users",
        buttonText: "Invite"
      }
    ];

    defaultTasks.forEach(task => {
      const id = this.currentTaskId++;
      this.tasks.set(id, { ...task, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      walletAddress: insertUser.walletAddress,
      chainType: insertUser.chainType,
      username: insertUser.username || null,
      loginStreak: 1,
      totalRewards: 0,
      tasksCompleted: 0,
      referralCount: 0,
      loyaltyScore: 0,
      pendingRewards: 0,
      referralEarnings: 0,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      referredBy: insertUser.referredBy || null
    };
    this.users.set(id, user);
    
    // Initialize token balances
    await this.updateTokenBalance(id, "SLERF", 1247);
    await this.updateTokenBalance(id, "CHONKPUMP", 892);
    
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...existingUser, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserStats(userId: number): Promise<{
    totalRewards: number;
    tasksCompleted: number;
    referralCount: number;
    loyaltyScore: number;
    pendingRewards: number;
    referralEarnings: number;
    loginStreak: number;
  }> {
    const user = this.users.get(userId);
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

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.isActive);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { 
      id,
      name: insertTask.name,
      description: insertTask.description,
      reward: insertTask.reward,
      taskType: insertTask.taskType,
      isActive: insertTask.isActive ?? true,
      icon: insertTask.icon,
      buttonText: insertTask.buttonText
    };
    this.tasks.set(id, task);
    return task;
  }

  async getUserTasks(userId: number): Promise<UserTask[]> {
    return Array.from(this.userTasks.values()).filter(
      (userTask) => userTask.userId === userId
    );
  }

  async completeUserTask(insertUserTask: InsertUserTask): Promise<UserTask> {
    const id = this.currentUserTaskId++;
    const userTask: UserTask = {
      id,
      userId: insertUserTask.userId || null,
      taskId: insertUserTask.taskId || null,
      completedAt: new Date(),
      canReset: insertUserTask.canReset ?? true,
      lastResetAt: new Date()
    };
    this.userTasks.set(id, userTask);
    
    // Update user stats
    const user = this.users.get(insertUserTask.userId!);
    if (user) {
      const task = this.tasks.get(insertUserTask.taskId!);
      if (task) {
        await this.updateUser(user.id, {
          tasksCompleted: (user.tasksCompleted || 0) + 1,
          pendingRewards: (user.pendingRewards || 0) + task.reward,
          totalRewards: (user.totalRewards || 0) + task.reward
        });
        
        // Create activity
        await this.createActivity({
          userId: user.id,
          type: "task_completed",
          description: `Completed ${task.name}`,
          reward: task.reward
        });
      }
    }
    
    return userTask;
  }

  async getCompletedTasksToday(userId: number): Promise<UserTask[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.userTasks.values()).filter(
      (userTask) => 
        userTask.userId === userId && 
        userTask.completedAt && 
        userTask.completedAt >= today
    );
  }

  async resetDailyTasks(userId: number): Promise<void> {
    const userTasks = await this.getUserTasks(userId);
    userTasks.forEach(userTask => {
      if (userTask.canReset) {
        this.userTasks.delete(userTask.id);
      }
    });
  }

  async getUserTokenBalances(userId: number): Promise<TokenBalance[]> {
    return Array.from(this.tokenBalances.values()).filter(
      (balance) => balance.userId === userId
    );
  }

  async updateTokenBalance(userId: number, tokenSymbol: string, balance: number): Promise<TokenBalance> {
    const existing = Array.from(this.tokenBalances.values()).find(
      (b) => b.userId === userId && b.tokenSymbol === tokenSymbol
    );

    if (existing) {
      const updated = { ...existing, balance };
      this.tokenBalances.set(existing.id, updated);
      return updated;
    }

    const id = this.currentTokenBalanceId++;
    const newBalance: TokenBalance = {
      id,
      userId,
      tokenSymbol,
      balance,
      chainType: tokenSymbol === "SLERF" ? "base" : "solana"
    };
    this.tokenBalances.set(id, newBalance);
    return newBalance;
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentReferralId++;
    const referral: Referral = {
      id,
      referrerId: insertReferral.referrerId || null,
      referredUserId: insertReferral.referredUserId || null,
      rewardEarned: insertReferral.rewardEarned || null,
      createdAt: new Date()
    };
    this.referrals.set(id, referral);
    
    // Update referrer stats
    const referrer = this.users.get(insertReferral.referrerId!);
    if (referrer) {
      await this.updateUser(referrer.id, {
        referralCount: (referrer.referralCount || 0) + 1,
        referralEarnings: (referrer.referralEarnings || 0) + (insertReferral.rewardEarned || 30),
        pendingRewards: (referrer.pendingRewards || 0) + (insertReferral.rewardEarned || 30)
      });
      
      // Create activity
      await this.createActivity({
        userId: referrer.id,
        type: "referral_earned",
        description: "Earned referral bonus",
        reward: insertReferral.rewardEarned || 30
      });
    }
    
    return referral;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(
      (referral) => referral.referrerId === userId
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = {
      id,
      userId: insertActivity.userId || null,
      type: insertActivity.type,
      description: insertActivity.description,
      reward: insertActivity.reward || null,
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getUserActivities(userId: number, limit = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async claimRewards(userId: number): Promise<{ claimed: number }> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const claimed = user.pendingRewards || 0;
    await this.updateUser(userId, { pendingRewards: 0 });
    
    // Update token balance
    await this.updateTokenBalance(userId, "SLERF", (await this.getUserTokenBalances(userId)).find(b => b.tokenSymbol === "SLERF")?.balance || 0 + claimed);
    
    // Create activity
    await this.createActivity({
      userId,
      type: "tokens_claimed",
      description: `Claimed ${claimed} $SLERF tokens`,
      reward: claimed
    });

    return { claimed };
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize default tasks
    this.initializeTasks();
  }

  private async initializeTasks() {
    const defaultTasks = [
      {
        name: "Daily Login",
        description: "Sign in to your account",
        reward: 10,
        taskType: "daily",
        isActive: true,
        icon: "fas fa-check",
        buttonText: "Complete"
      },
      {
        name: "Complete Quiz",
        description: "Answer Web3 knowledge questions",
        reward: 25,
        taskType: "daily",
        isActive: true,
        icon: "fas fa-question",
        buttonText: "Start Quiz"
      },
      {
        name: "Share on Twitter",
        description: "Tweet with #Chonk9k hashtag",
        reward: 20,
        taskType: "daily",
        isActive: true,
        icon: "fab fa-twitter",
        buttonText: "Tweet"
      },
      {
        name: "Invite Friends",
        description: "Refer new users to the platform",
        reward: 30,
        taskType: "daily",
        isActive: true,
        icon: "fas fa-users",
        buttonText: "Invite"
      }
    ];

    // Check if tasks already exist
    const existingTasks = await this.getAllTasks();
    if (existingTasks.length === 0) {
      for (const task of defaultTasks) {
        await this.createTask(task);
      }
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        walletAddress: insertUser.walletAddress,
        chainType: insertUser.chainType,
        username: insertUser.username,
        lastLoginAt: insertUser.lastLoginAt,
        referredBy: insertUser.referredBy
      })
      .returning();
    
    // Initialize token balances
    await this.updateTokenBalance(user.id, "SLERF", 1247);
    await this.updateTokenBalance(user.id, "CHONKPUMP", 892);
    
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  async getUserStats(userId: number): Promise<{
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

  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.isActive, true));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async getUserTasks(userId: number): Promise<UserTask[]> {
    return await db.select().from(userTasks).where(eq(userTasks.userId, userId));
  }

  async completeUserTask(insertUserTask: InsertUserTask): Promise<UserTask> {
    const [userTask] = await db
      .insert(userTasks)
      .values({
        userId: insertUserTask.userId,
        taskId: insertUserTask.taskId,
        completedAt: new Date(),
        canReset: insertUserTask.canReset ?? true,
        lastResetAt: new Date()
      })
      .returning();
    
    // Update user stats
    if (userTask.userId && userTask.taskId) {
      const user = await this.getUser(userTask.userId);
      const task = await this.getTask(userTask.taskId);
      
      if (user && task) {
        await this.updateUser(user.id, {
          tasksCompleted: (user.tasksCompleted || 0) + 1,
          pendingRewards: (user.pendingRewards || 0) + task.reward,
          totalRewards: (user.totalRewards || 0) + task.reward
        });
        
        // Create activity
        await this.createActivity({
          userId: user.id,
          type: "task_completed",
          description: `Completed ${task.name}`,
          reward: task.reward
        });
      }
    }
    
    return userTask;
  }

  async getCompletedTasksToday(userId: number): Promise<UserTask[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await db
      .select()
      .from(userTasks)
      .where(
        and(
          eq(userTasks.userId, userId),
          gte(userTasks.completedAt, today)
        )
      );
  }

  async resetDailyTasks(userId: number): Promise<void> {
    await db
      .delete(userTasks)
      .where(
        and(
          eq(userTasks.userId, userId),
          eq(userTasks.canReset, true)
        )
      );
  }

  async getUserTokenBalances(userId: number): Promise<TokenBalance[]> {
    return await db.select().from(tokenBalances).where(eq(tokenBalances.userId, userId));
  }

  async updateTokenBalance(userId: number, tokenSymbol: string, balance: number): Promise<TokenBalance> {
    // Check if balance already exists
    const [existing] = await db
      .select()
      .from(tokenBalances)
      .where(
        and(
          eq(tokenBalances.userId, userId),
          eq(tokenBalances.tokenSymbol, tokenSymbol)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(tokenBalances)
        .set({ balance })
        .where(eq(tokenBalances.id, existing.id))
        .returning();
      return updated;
    }

    const [newBalance] = await db
      .insert(tokenBalances)
      .values({
        userId,
        tokenSymbol,
        balance,
        chainType: tokenSymbol === "SLERF" ? "base" : "solana"
      })
      .returning();
    
    return newBalance;
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db
      .insert(referrals)
      .values({
        referrerId: insertReferral.referrerId,
        referredUserId: insertReferral.referredUserId,
        rewardEarned: insertReferral.rewardEarned || 30
      })
      .returning();
    
    // Update referrer stats
    if (referral.referrerId) {
      const referrer = await this.getUser(referral.referrerId);
      if (referrer) {
        await this.updateUser(referrer.id, {
          referralCount: (referrer.referralCount || 0) + 1,
          referralEarnings: (referrer.referralEarnings || 0) + (referral.rewardEarned || 30),
          pendingRewards: (referrer.pendingRewards || 0) + (referral.rewardEarned || 30)
        });
        
        // Create activity
        await this.createActivity({
          userId: referrer.id,
          type: "referral_earned",
          description: "Earned referral bonus",
          reward: referral.rewardEarned || 30
        });
      }
    }
    
    return referral;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    return await db.select().from(referrals).where(eq(referrals.referrerId, userId));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values({
        userId: insertActivity.userId,
        type: insertActivity.type,
        description: insertActivity.description,
        reward: insertActivity.reward
      })
      .returning();
    return activity;
  }

  async getUserActivities(userId: number, limit = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(activities.createdAt)
      .limit(limit);
  }

  async claimRewards(userId: number): Promise<{ claimed: number }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const claimed = user.pendingRewards || 0;
    await this.updateUser(userId, { pendingRewards: 0 });
    
    // Update token balance
    const balances = await this.getUserTokenBalances(userId);
    const slerfBalance = balances.find(b => b.tokenSymbol === "SLERF");
    await this.updateTokenBalance(userId, "SLERF", (slerfBalance?.balance || 0) + claimed);
    
    // Create activity
    await this.createActivity({
      userId,
      type: "tokens_claimed",
      description: `Claimed ${claimed} $SLERF tokens`,
      reward: claimed
    });

    return { claimed };
  }
}

export const storage = new DatabaseStorage();
