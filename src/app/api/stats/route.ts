import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requestLogs, apiKeys } from '@/drizzle/schema';
import { eq, sql, and, gte, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d';
  
  // Calculate the start date based on period
  const periodMap: Record<string, number> = {
    '24h': 1,
    '7d': 7,
    '30d': 30,
    '90d': 90,
  };
  const days = periodMap[period] || 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  try {
    // Get user's API key IDs
    const userKeys = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));
    
    if (userKeys.length === 0) {
      return NextResponse.json({
        totalCostCents: 0,
        totalRequests: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        avgLatencyMs: 0,
        dailyStats: [],
        modelBreakdown: [],
        providerBreakdown: [],
      });
    }
    
    const keyIds = userKeys.map(k => k.id);
    
    // Get aggregate stats
    const aggregateStats = await db
      .select({
        totalCostCents: sql<number>`COALESCE(SUM(${requestLogs.costCents}), 0)`,
        totalRequests: sql<number>`COUNT(*)`,
        totalInputTokens: sql<number>`COALESCE(SUM(${requestLogs.inputTokens}), 0)`,
        totalOutputTokens: sql<number>`COALESCE(SUM(${requestLogs.outputTokens}), 0)`,
        avgLatencyMs: sql<number>`COALESCE(AVG(${requestLogs.latencyMs}), 0)`,
      })
      .from(requestLogs)
      .where(
        and(
          sql`${requestLogs.apiKeyId} = ANY(${keyIds})`,
          gte(requestLogs.createdAt, startDate)
        )
      );
    
    // Get daily stats for chart
    const dailyStats = await db
      .select({
        date: sql<string>`DATE(${requestLogs.createdAt})`,
        costCents: sql<number>`SUM(${requestLogs.costCents})`,
        requests: sql<number>`COUNT(*)`,
        inputTokens: sql<number>`SUM(${requestLogs.inputTokens})`,
        outputTokens: sql<number>`SUM(${requestLogs.outputTokens})`,
      })
      .from(requestLogs)
      .where(
        and(
          sql`${requestLogs.apiKeyId} = ANY(${keyIds})`,
          gte(requestLogs.createdAt, startDate)
        )
      )
      .groupBy(sql`DATE(${requestLogs.createdAt})`)
      .orderBy(sql`DATE(${requestLogs.createdAt})`);
    
    // Get model breakdown
    const modelBreakdown = await db
      .select({
        model: requestLogs.model,
        provider: requestLogs.provider,
        costCents: sql<number>`SUM(${requestLogs.costCents})`,
        requests: sql<number>`COUNT(*)`,
        inputTokens: sql<number>`SUM(${requestLogs.inputTokens})`,
        outputTokens: sql<number>`SUM(${requestLogs.outputTokens})`,
      })
      .from(requestLogs)
      .where(
        and(
          sql`${requestLogs.apiKeyId} = ANY(${keyIds})`,
          gte(requestLogs.createdAt, startDate)
        )
      )
      .groupBy(requestLogs.model, requestLogs.provider)
      .orderBy(desc(sql`SUM(${requestLogs.costCents})`));
    
    // Get provider breakdown
    const providerBreakdown = await db
      .select({
        provider: requestLogs.provider,
        costCents: sql<number>`SUM(${requestLogs.costCents})`,
        requests: sql<number>`COUNT(*)`,
      })
      .from(requestLogs)
      .where(
        and(
          sql`${requestLogs.apiKeyId} = ANY(${keyIds})`,
          gte(requestLogs.createdAt, startDate)
        )
      )
      .groupBy(requestLogs.provider);
    
    return NextResponse.json({
      ...aggregateStats[0],
      dailyStats,
      modelBreakdown,
      providerBreakdown,
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
