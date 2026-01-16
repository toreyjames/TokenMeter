import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createApiKey, getUserApiKeys, deleteApiKey } from '@/lib/api-keys';
import { z } from 'zod';

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  openaiKey: z.string().optional(),
  anthropicKey: z.string().optional(),
  geminiKey: z.string().optional(),
  grokKey: z.string().optional(),
  mistralKey: z.string().optional(),
  groqKey: z.string().optional(),
});

// GET - List all API keys for the user
export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const keys = await getUserApiKeys(userId);
    
    // Transform to hide sensitive data
    const safeKeys = keys.map(key => ({
      id: key.id,
      name: key.name,
      keyPrefix: key.keyPrefix,
      hasOpenai: !!key.hasOpenai,
      hasAnthropic: !!key.hasAnthropic,
      hasGemini: !!key.hasGemini,
      hasGrok: !!key.hasGrok,
      hasMistral: !!key.hasMistral,
      hasGroq: !!key.hasGroq,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
    }));
    
    // Get deduplicated list of configured providers across all connections
    const configuredProviders = new Set<string>();
    keys.forEach(key => {
      if (key.hasOpenai) configuredProviders.add('openai');
      if (key.hasAnthropic) configuredProviders.add('anthropic');
      if (key.hasGemini) configuredProviders.add('gemini');
      if (key.hasGrok) configuredProviders.add('grok');
      if (key.hasMistral) configuredProviders.add('mistral');
      if (key.hasGroq) configuredProviders.add('groq');
    });
    
    return NextResponse.json({ 
      keys: safeKeys,
      configuredProviders: Array.from(configuredProviders),
    });
  } catch (error) {
    console.error('Error fetching keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create a new API key
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const parsed = createKeySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }
    
    const { name, openaiKey, anthropicKey, geminiKey, grokKey, mistralKey, groqKey } = parsed.data;
    
    // Check that at least one provider key is provided
    if (!openaiKey && !anthropicKey && !geminiKey && !grokKey && !mistralKey && !groqKey) {
      return NextResponse.json(
        { error: 'At least one provider API key is required' },
        { status: 400 }
      );
    }
    
    const { rawKey, id } = await createApiKey(userId, name, {
      openaiKey,
      anthropicKey,
      geminiKey,
      grokKey,
      mistralKey,
      groqKey,
    });
    
    // Return which providers were configured for this connection
    const providers: string[] = [];
    if (openaiKey) providers.push('openai');
    if (anthropicKey) providers.push('anthropic');
    if (geminiKey) providers.push('gemini');
    if (grokKey) providers.push('grok');
    if (mistralKey) providers.push('mistral');
    if (groqKey) providers.push('groq');
    
    return NextResponse.json({
      id,
      key: rawKey, // Only returned once!
      providers, // Providers configured in this connection
      message: 'API key created. Save this key - it won\'t be shown again.',
    });
    
  } catch (error) {
    console.error('Error creating key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an API key
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'Key ID is required' },
        { status: 400 }
      );
    }
    
    const deleted = await deleteApiKey(userId, keyId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
