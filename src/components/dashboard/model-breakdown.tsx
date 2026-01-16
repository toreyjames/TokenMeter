'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCost, suggestCheaperModel } from '@/lib/pricing';

interface ModelStat {
  model: string;
  provider: string;
  costCents: number;
  requests: number;
  inputTokens: number;
  outputTokens: number;
}

interface ModelBreakdownProps {
  data: ModelStat[];
}

export function ModelBreakdown({ data }: ModelBreakdownProps) {
  const totalCost = data.reduce((sum, m) => sum + m.costCents, 0);
  
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Usage by Model</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.slice(0, 6).map((model, index) => {
              const percentage = totalCost > 0 ? (model.costCents / totalCost) * 100 : 0;
              const suggestion = suggestCheaperModel(model.provider, model.model);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={model.provider === 'openai' ? 'default' : 'secondary'}>
                        {model.provider}
                      </Badge>
                      <span className="font-medium text-sm">{model.model}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{formatCost(model.costCents)}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({model.requests} requests)
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {/* Optimization suggestion */}
                  {suggestion && model.costCents > 10 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      💡 Switch to {suggestion.model} to save ~{suggestion.savingsPercent}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No usage data yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
