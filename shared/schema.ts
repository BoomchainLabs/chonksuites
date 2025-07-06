import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  chainType: text("chain_type").notNull(), // 'evm' or 'solana'
  username: text("username"),
  loginStreak: integer("login_streak").default(0),
  totalRewards: integer("total_rewards").default(0),
  tasksCompleted: integer("tasks_completed").default(0),
  referralCount: integer("referral_count").default(0),
  loyaltyScore: integer("loyalty_score").default(0),
  pendingRewards: integer("pending_rewards").default(0),
  referralEarnings: integer("referral_earnings").default(0),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  referredBy: text("referred_by"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  reward: integer("reward").notNull(),
  taskType: text("task_type").notNull(), // 'daily', 'weekly', 'one_time'
  isActive: boolean("is_active").default(true),
  icon: text("icon").notNull(),
  buttonText: text("button_text").notNull(),
});

export const userTasks = pgTable("user_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  taskId: integer("task_id").references(() => tasks.id),
  completedAt: timestamp("completed_at"),
  canReset: boolean("can_reset").default(true),
  lastResetAt: timestamp("last_reset_at"),
});

export const tokenBalances = pgTable("token_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tokenSymbol: text("token_symbol").notNull(), // 'SLERF' or 'CHONKPUMP'
  balance: integer("balance").default(0),
  chainType: text("chain_type").notNull(), // 'base' or 'solana'
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id),
  referredUserId: integer("referred_user_id").references(() => users.id),
  rewardEarned: integer("reward_earned").default(30),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'task_completed', 'referral_earned', 'tokens_claimed'
  description: text("description").notNull(),
  reward: integer("reward").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  totalRewards: true,
  tasksCompleted: true,
  referralCount: true,
  loyaltyScore: true,
  pendingRewards: true,
  referralEarnings: true,
  loginStreak: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

export const insertUserTaskSchema = createInsertSchema(userTasks).omit({
  id: true,
});

export const insertTokenBalanceSchema = createInsertSchema(tokenBalances).omit({
  id: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UserTask = typeof userTasks.$inferSelect;
export type InsertUserTask = z.infer<typeof insertUserTaskSchema>;
export type TokenBalance = typeof tokenBalances.$inferSelect;
export type InsertTokenBalance = z.infer<typeof insertTokenBalanceSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
