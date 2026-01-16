'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCost } from '@/lib/pricing';
import { formatDistanceToNow } from 'date-fns';

interface RequestLog {
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

interface RecentRequestsProps {
  data: RequestLog[];
}

export function RecentRequests({ data }: RecentRequestsProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.provider === 'openai' ? 'default' : 'secondary'}>
                      {log.provider}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.model}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="text-muted-foreground">{log.inputTokens}</span>
                    <span className="mx-1">→</span>
                    <span>{log.outputTokens}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.latencyMs >= 1000 
                      ? `${(log.latencyMs / 1000).toFixed(2)}s`
                      : `${log.latencyMs}ms`
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.statusCode === 200 ? 'default' : 'destructive'}>
                      {log.statusCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCost(log.costCents)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No requests yet. Start making API calls to see them here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
