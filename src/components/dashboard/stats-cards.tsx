'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Zap, Clock, TrendingUp } from 'lucide-react';
import { formatCost } from '@/lib/pricing';

interface StatsCardsProps {
  totalCostCents: number;
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  avgLatencyMs: number;
}

export function StatsCards({
  totalCostCents,
  totalRequests,
  totalInputTokens,
  totalOutputTokens,
  avgLatencyMs,
}: StatsCardsProps) {
  const totalTokens = totalInputTokens + totalOutputTokens;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCost(totalCostCents)}</div>
          <p className="text-xs text-muted-foreground">
            This period
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            API calls made
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalTokens >= 1_000_000 
              ? `${(totalTokens / 1_000_000).toFixed(2)}M`
              : totalTokens >= 1_000
                ? `${(totalTokens / 1_000).toFixed(1)}K`
                : totalTokens.toLocaleString()
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {totalInputTokens.toLocaleString()} in / {totalOutputTokens.toLocaleString()} out
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgLatencyMs >= 1000 
              ? `${(avgLatencyMs / 1000).toFixed(2)}s`
              : `${Math.round(avgLatencyMs)}ms`
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Response time
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
