import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { apiKeys } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

// POST - Test a connection by making a lightweight API call
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { keyId } = body;
    
    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }
    
    // Get the key
    const result = await db
      .select({
        openaiKey: apiKeys.openaiKey,
        anthropicKey: apiKeys.anthropicKey,
        geminiKey: apiKeys.geminiKey,
        grokKey: apiKeys.grokKey,
        mistralKey: apiKeys.mistralKey,
        groqKey: apiKeys.groqKey,
      })
      .from(apiKeys)
      .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)))
      .limit(1);
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }
    
    const { openaiKey, anthropicKey, geminiKey, grokKey, mistralKey, groqKey } = result[0];
    const tests: { provider: string; success: boolean; error?: string }[] = [];
    
    // Test OpenAI if configured
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
          },
        });
        
        tests.push({
          provider: 'openai',
          success: res.ok,
          error: res.ok ? undefined : 'Invalid API key',
        });
      } catch {
        tests.push({
          provider: 'openai',
          success: false,
          error: 'Connection failed',
        });
      }
    }
    
    // Test Anthropic if configured
    if (anthropicKey) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'Hi' }],
          }),
        });
        
        tests.push({
          provider: 'anthropic',
          success: res.ok || res.status === 429,
          error: res.ok || res.status === 429 ? undefined : 'Invalid API key',
        });
      } catch {
        tests.push({
          provider: 'anthropic',
          success: false,
          error: 'Connection failed',
        });
      }
    }
    
    // Test Gemini if configured
    if (geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`, {
          method: 'GET',
        });
        
        tests.push({
          provider: 'gemini',
          success: res.ok,
          error: res.ok ? undefined : 'Invalid API key',
        });
      } catch {
        tests.push({
          provider: 'gemini',
          success: false,
          error: 'Connection failed',
        });
      }
    }
    
    // Test Grok if configured (OpenAI-compatible)
    if (grokKey) {
      try {
        const res = await fetch('https://api.x.ai/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${grokKey}`,
          },
        });
        
        tests.push({
          provider: 'grok',
          success: res.ok,
          error: res.ok ? undefined : 'Invalid API key',
        });
      } catch {
        tests.push({
          provider: 'grok',
          success: false,
          error: 'Connection failed',
        });
      }
    }
    
    // Test Mistral if configured (OpenAI-compatible)
    if (mistralKey) {
      try {
        const res = await fetch('https://api.mistral.ai/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${mistralKey}`,
          },
        });
        
        tests.push({
          provider: 'mistral',
          success: res.ok,
          error: res.ok ? undefined : 'Invalid API key',
        });
      } catch {
        tests.push({
          provider: 'mistral',
          success: false,
          error: 'Connection failed',
        });
      }
    }
    
    // Test Groq if configured (OpenAI-compatible)
    if (groqKey) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
          },
        });
        
        tests.push({
          provider: 'groq',
          success: res.ok,
          error: res.ok ? undefined : 'Invalid API key',
        });
      } catch {
        tests.push({
          provider: 'groq',
          success: false,
          error: 'Connection failed',
        });
      }
    }
    
    // Check if all tests passed
    const allPassed = tests.length > 0 && tests.every(t => t.success);
    
    return NextResponse.json({
      success: allPassed,
      tests,
    });
    
  } catch (error) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { error: 'Failed to test connection' },
      { status: 500 }
    );
  }
}
