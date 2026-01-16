import { db } from './db';
import { apiKeys } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Generate a new API key
 * Returns the raw key (only shown once) and the data to store
 */
export function generateApiKey(): { rawKey: string; keyHash: string; keyPrefix: string } {
  // Generate a random 32-byte key
  const randomBytes = crypto.randomBytes(32);
  const rawKey = `tm_${randomBytes.toString('base64url')}`;
  
  // Hash for storage
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  
  // Prefix for display (first 8 chars after tm_)
  const keyPrefix = rawKey.substring(0, 11) + '...';
  
  return { rawKey, keyHash, keyPrefix };
}

/**
 * Validate an API key and return the associated data
 */
export async function validateApiKey(rawKey: string | null): Promise<{
  id: string;
  userId: string;
  openaiKey: string | null;
  anthropicKey: string | null;
  geminiKey: string | null;
  grokKey: string | null;
  mistralKey: string | null;
  groqKey: string | null;
} | null> {
  if (!rawKey || !rawKey.startsWith('tm_')) {
    return null;
  }
  
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  
  const result = await db
    .select({
      id: apiKeys.id,
      userId: apiKeys.userId,
      openaiKey: apiKeys.openaiKey,
      anthropicKey: apiKeys.anthropicKey,
      geminiKey: apiKeys.geminiKey,
      grokKey: apiKeys.grokKey,
      mistralKey: apiKeys.mistralKey,
      groqKey: apiKeys.groqKey,
    })
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash))
    .limit(1);
  
  if (result.length === 0) {
    return null;
  }
  
  // Update last used timestamp (fire and forget)
  db.update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.keyHash, keyHash))
    .catch(console.error);
  
  return result[0];
}

export interface ProviderKeys {
  openaiKey?: string;
  anthropicKey?: string;
  geminiKey?: string;
  grokKey?: string;
  mistralKey?: string;
  groqKey?: string;
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(
  userId: string,
  name: string,
  providerKeys: ProviderKeys
): Promise<{ rawKey: string; id: string }> {
  const { rawKey, keyHash, keyPrefix } = generateApiKey();
  
  const result = await db
    .insert(apiKeys)
    .values({
      userId,
      keyHash,
      keyPrefix,
      name,
      openaiKey: providerKeys.openaiKey || null,
      anthropicKey: providerKeys.anthropicKey || null,
      geminiKey: providerKeys.geminiKey || null,
      grokKey: providerKeys.grokKey || null,
      mistralKey: providerKeys.mistralKey || null,
      groqKey: providerKeys.groqKey || null,
    })
    .returning({ id: apiKeys.id });
  
  return { rawKey, id: result[0].id };
}

/**
 * Get all API keys for a user (without sensitive data)
 */
export async function getUserApiKeys(userId: string) {
  return db
    .select({
      id: apiKeys.id,
      keyPrefix: apiKeys.keyPrefix,
      name: apiKeys.name,
      hasOpenai: apiKeys.openaiKey,
      hasAnthropic: apiKeys.anthropicKey,
      hasGemini: apiKeys.geminiKey,
      hasGrok: apiKeys.grokKey,
      hasMistral: apiKeys.mistralKey,
      hasGroq: apiKeys.groqKey,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId));
}

/**
 * Delete an API key
 */
export async function deleteApiKey(userId: string, keyId: string): Promise<boolean> {
  const result = await db
    .delete(apiKeys)
    .where(eq(apiKeys.id, keyId))
    .returning({ id: apiKeys.id });
  
  return result.length > 0;
}
