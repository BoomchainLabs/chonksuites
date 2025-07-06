import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "nanoid";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Additional fields for Web3 functionality
  walletAddress: text("wallet_address").unique(),
  chainType: text("chain_type"), // 'evm' or 'solana'
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
  updatedAt: timestamp("updated_at").defaultNow(),
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
  userId: varchar("user_id").references(() => users.id),
  taskId: integer("task_id").references(() => tasks.id),
  completedAt: timestamp("completed_at"),
  canReset: boolean("can_reset").default(true),
  lastResetAt: timestamp("last_reset_at"),
});

export const tokenBalances = pgTable("token_balances", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  tokenSymbol: text("token_symbol").notNull(), // 'SLERF' or 'CHONKPUMP'
  balance: integer("balance").default(0),
  chainType: text("chain_type").notNull(), // 'base' or 'solana'
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: varchar("referrer_id").references(() => users.id),
  referredUserId: varchar("referred_user_id").references(() => users.id),
  rewardEarned: integer("reward_earned").default(30),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // 'task_completed', 'referral_earned', 'tokens_claimed'
  description: text("description").notNull(),
  reward: integer("reward").default(0),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// NFT Collection and Marketplace tables
export const nftCollections = pgTable("nft_collections", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  contractAddress: varchar("contract_address").notNull().unique(),
  name: varchar("name").notNull(),
  symbol: varchar("symbol").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  totalSupply: integer("total_supply").default(0),
  floorPrice: integer("floor_price").default(0), // in lamports
  volume24h: integer("volume_24h").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nftTokens = pgTable("nft_tokens", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  collectionId: varchar("collection_id").notNull().references(() => nftCollections.id),
  tokenId: varchar("token_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  attributes: jsonb("attributes"), // JSON array of traits
  ownerAddress: varchar("owner_address"),
  mintAddress: varchar("mint_address").unique(),
  isListed: boolean("is_listed").default(false),
  price: integer("price"), // in lamports
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketplaceListings = pgTable("marketplace_listings", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  nftTokenId: varchar("nft_token_id").notNull().references(() => nftTokens.id),
  sellerAddress: varchar("seller_address").notNull(),
  price: integer("price").notNull(), // in lamports
  currency: varchar("currency").notNull().default("SOL"), // SOL, SLERF, CHONK9K
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User-created tokens
export const userTokens = pgTable("user_tokens", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  symbol: varchar("symbol").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  totalSupply: bigint("total_supply", { mode: "number" }).notNull(),
  mintAddress: varchar("mint_address").unique(),
  decimals: integer("decimals").default(9),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Staking pools for SLERF and CHONK9K
export const stakingPools = pgTable("staking_pools", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  tokenSymbol: varchar("token_symbol").notNull(), // "SLERF" or "CHONK9K"
  name: varchar("name").notNull(),
  apy: integer("apy").notNull(), // percentage * 100 (e.g., 1500 = 15%)
  minStakeAmount: bigint("min_stake_amount", { mode: "number" }).notNull(),
  maxStakeAmount: bigint("max_stake_amount", { mode: "number" }),
  lockPeriodDays: integer("lock_period_days").notNull(),
  totalStaked: bigint("total_staked", { mode: "number" }).default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStakes = pgTable("user_stakes", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  userId: varchar("user_id").notNull().references(() => users.id),
  poolId: varchar("pool_id").notNull().references(() => stakingPools.id),
  amount: bigint("amount", { mode: "number" }).notNull(),
  rewardsEarned: bigint("rewards_earned", { mode: "number" }).default(0),
  stakedAt: timestamp("staked_at").defaultNow(),
  unlocksAt: timestamp("unlocks_at").notNull(),
  isActive: boolean("is_active").default(true),
});

// Community Challenges
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  challengeType: text("challenge_type").notNull(), // 'trading_volume', 'referrals', 'social_share', 'login_streak', 'staking'
  targetValue: integer("target_value").notNull(),
  rewardPool: integer("reward_pool").notNull(), // Total reward pool in tokens
  rewardType: text("reward_type").notNull(), // 'SLERF' or 'CHONK9K'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxParticipants: integer("max_participants"),
  isActive: boolean("is_active").default(true),
  difficulty: text("difficulty").notNull().default('medium'), // 'easy', 'medium', 'hard', 'legendary'
  icon: text("icon").notNull(),
  badgeUrl: text("badge_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Challenge Participations
export const challengeParticipations = pgTable("challenge_participations", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  currentProgress: integer("current_progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  rewardEarned: integer("reward_earned").default(0),
  rank: integer("rank"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Community Leaderboard
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: varchar("id").primaryKey().notNull().default(nanoid()),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // 'weekly', 'monthly', 'all_time', 'challenge_specific'
  points: integer("points").notNull(),
  rank: integer("rank").notNull(),
  rewardsClaimed: integer("rewards_claimed").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  weekOf: timestamp("week_of"), // For weekly leaderboards
  monthOf: timestamp("month_of"), // For monthly leaderboards
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
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

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export const insertChallengeParticipationSchema = createInsertSchema(challengeParticipations).omit({
  id: true,
  joinedAt: true,
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
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
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeParticipation = typeof challengeParticipations.$inferSelect;
export type InsertChallengeParticipation = z.infer<typeof insertChallengeParticipationSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
