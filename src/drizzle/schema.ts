import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, index } from 'drizzle-orm/pg-core';

// API Keys - users create these to authenticate with TokenMeter
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID
  keyHash: text('key_hash').notNull(), // Hashed API key for validation
  keyPrefix: text('key_prefix').notNull(), // "tm_abc..." for display
  name: text('name'), // User-friendly name
  
  // User's actual AI provider keys (encrypted in production)
  openaiKey: text('openai_key'),
  anthropicKey: text('anthropic_key'),
  geminiKey: text('gemini_key'),
  grokKey: text('grok_key'),
  mistralKey: text('mistral_key'),
  groqKey: text('groq_key'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
});

// Request logs - every API call is logged here
export const requestLogs = pgTable('request_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiKeyId: uuid('api_key_id').references(() => apiKeys.id).notNull(),
  
  // Request info
  provider: text('provider').notNull(), // 'openai' | 'anthropic'
  model: text('model').notNull(), // 'gpt-4o', 'claude-3-sonnet', etc.
  endpoint: text('endpoint').notNull(), // '/chat/completions', etc.
  
  // Token counts
  inputTokens: integer('input_tokens').notNull(),
  outputTokens: integer('output_tokens').notNull(),
  
  // Cost in cents (to avoid float issues)
  costCents: integer('cost_cents').notNull(),
  
  // Performance
  latencyMs: integer('latency_ms').notNull(),
  statusCode: integer('status_code').notNull(),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // Optional: store request/response for debugging (can be disabled)
  requestBody: jsonb('request_body'),
  responsePreview: text('response_preview'), // First 500 chars of response
}, (table) => [
  index('idx_logs_api_key').on(table.apiKeyId),
  index('idx_logs_created').on(table.createdAt),
  index('idx_logs_provider').on(table.provider),
]);

// Budget alerts
export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  
  // Alert configuration
  provider: text('provider'), // null = all providers, or 'openai', 'anthropic', etc.
  thresholdCents: integer('threshold_cents').notNull(), // Alert when spend exceeds
  period: text('period').notNull().default('daily'), // 'daily' | 'weekly' | 'monthly'
  email: text('email').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  
  lastTriggeredAt: timestamp('last_triggered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Optimization suggestions log
export const suggestions = pgTable('suggestions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  
  type: text('type').notNull(), // 'model_switch' | 'caching' | 'mode_change'
  title: text('title').notNull(),
  description: text('description').notNull(),
  potentialSavingsCents: integer('potential_savings_cents'),
  
  dismissed: boolean('dismissed').default(false).notNull(),
  appliedAt: timestamp('applied_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type RequestLog = typeof requestLogs.$inferSelect;
export type NewRequestLog = typeof requestLogs.$inferInsert;
export type Alert = typeof alerts.$inferSelect;
export type Suggestion = typeof suggestions.$inferSelect;
