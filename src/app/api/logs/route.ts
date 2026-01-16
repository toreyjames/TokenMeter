import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requestLogs, apiKeys } from '@/drizzle/schema';
import { eq, sql, and, desc, like } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const provider = searchParams.get('provider');
  const model = searchParams.get('model');
  const search = searchParams.get('search');
  
  const offset = (page - 1) * limit;
  
  try {
    // Get user's API key IDs
    const userKeys = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));
    
    if (userKeys.length === 0) {
      return NextResponse.json({ logs: [], total: 0, page, limit });
    }
    
    const keyIds = userKeys.map(k => k.id);
    
    // Build where conditions
    const conditions = [sql`${requestLogs.apiKeyId} = ANY(${keyIds})`];
    
    if (provider) {
      conditions.push(eq(requestLogs.provider, provider));
    }
    
    if (model) {
      conditions.push(like(requestLogs.model, `%${model}%`));
    }
    
    // Get logs
    const logs = await db
      .select({
        id: requestLogs.id,
        provider: requestLogs.provider,
        model: requestLogs.model,
        endpoint: requestLogs.endpoint,
        inputTokens: requestLogs.inputTokens,
        outputTokens: requestLogs.outputTokens,
        costCents: requestLogs.costCents,
        latencyMs: requestLogs.latencyMs,
        statusCode: requestLogs.statusCode,
        createdAt: requestLogs.createdAt,
        responsePreview: requestLogs.responsePreview,
      })
      .from(requestLogs)
      .where(and(...conditions))
      .orderBy(desc(requestLogs.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Get total count
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(requestLogs)
      .where(and(...conditions));
    
    return NextResponse.json({
      logs,
      total: countResult[0].count,
      page,
      limit,
    });
    
  } catch (error) {
    console.error('Logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
