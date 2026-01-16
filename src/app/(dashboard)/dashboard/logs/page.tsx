'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

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
  responsePreview?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState<string | null>(null);
  const limit = 25;

  useEffect(() => {
    fetchLogs();
  }, [page, provider]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (provider) params.set('provider', provider);
      if (search) params.set('model', search);
      
      const res = await fetch(`/api/logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Request Logs</h1>
        <p className="text-muted-foreground">
          View detailed logs of all your API requests
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={provider === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setProvider(null); setPage(1); }}
              >
                All
              </Button>
              <Button
                variant={provider === 'openai' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setProvider('openai'); setPage(1); }}
              >
                OpenAI
              </Button>
              <Button
                variant={provider === 'anthropic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setProvider('anthropic'); setPage(1); }}
              >
                Anthropic
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {total.toLocaleString()} requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No requests found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
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
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {log.endpoint}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.inputTokens.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.outputTokens.toLocaleString()}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
