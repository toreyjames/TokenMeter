'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { CostChart } from '@/components/dashboard/cost-chart';
import { ModelBreakdown } from '@/components/dashboard/model-breakdown';
import { RecentRequests } from '@/components/dashboard/recent-requests';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalCostCents: number;
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  avgLatencyMs: number;
  dailyStats: Array<{
    date: string;
    costCents: number;
    requests: number;
    inputTokens: number;
    outputTokens: number;
  }>;
  modelBreakdown: Array<{
    model: string;
    provider: string;
    costCents: number;
    requests: number;
    inputTokens: number;
    outputTokens: number;
  }>;
}

interface Log {
  id: string;
  provider: string;
  model: string;
  endpoint: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  latencyMs: number;
  statusCode: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState('7d');
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsRes, logsRes] = await Promise.all([
          fetch(`/api/stats?period=${period}`),
          fetch('/api/logs?limit=10'),
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setRecentLogs(logsData.logs || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your AI API usage and costs
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px]" />
          <Skeleton className="col-span-3 h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your AI API usage and costs
          </p>
        </div>
        
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <StatsCards
        totalCostCents={stats?.totalCostCents || 0}
        totalRequests={stats?.totalRequests || 0}
        totalInputTokens={stats?.totalInputTokens || 0}
        totalOutputTokens={stats?.totalOutputTokens || 0}
        avgLatencyMs={stats?.avgLatencyMs || 0}
      />

      <div className="grid gap-4 md:grid-cols-7">
        <CostChart data={stats?.dailyStats || []} />
        <ModelBreakdown data={stats?.modelBreakdown || []} />
      </div>

      <RecentRequests data={recentLogs} />
    </div>
  );
}
