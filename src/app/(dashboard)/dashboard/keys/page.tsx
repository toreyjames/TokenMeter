'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Copy, Trash2, Check, ExternalLink, CheckCircle2, XCircle, Loader2, Download, Zap, HelpCircle, Bell, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  hasOpenai: boolean;
  hasAnthropic: boolean;
  hasGemini: boolean;
  hasGrok: boolean;
  hasMistral: boolean;
  hasGroq: boolean;
  createdAt: string;
  lastUsedAt: string | null;
}

// Provider definitions with colors and links
const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: 'GPT-4o, o1, o1-mini',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-proj-...',
    link: 'https://platform.openai.com/api-keys',
    color: 'bg-black',
    textColor: 'text-white',
    hoverBorder: 'hover:border-green-300',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: 'Claude 4, Claude 3.5 Sonnet/Haiku',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-...',
    link: 'https://console.anthropic.com/settings/keys',
    color: 'bg-[#D4A574]',
    textColor: 'text-white',
    hoverBorder: 'hover:border-orange-300',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    models: 'Gemini 2.0, 1.5 Pro/Flash',
    keyPrefix: 'AI',
    keyPlaceholder: 'AIza...',
    link: 'https://aistudio.google.com/app/apikey',
    color: 'bg-blue-500',
    textColor: 'text-white',
    hoverBorder: 'hover:border-blue-300',
  },
  {
    id: 'grok',
    name: 'xAI Grok',
    models: 'Grok 2, Grok Vision',
    keyPrefix: 'xai-',
    keyPlaceholder: 'xai-...',
    link: 'https://console.x.ai/',
    color: 'bg-zinc-800',
    textColor: 'text-white',
    hoverBorder: 'hover:border-zinc-400',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    models: 'Mistral Large, Codestral',
    keyPrefix: '',
    keyPlaceholder: 'Your Mistral API key',
    link: 'https://console.mistral.ai/api-keys/',
    color: 'bg-orange-500',
    textColor: 'text-white',
    hoverBorder: 'hover:border-orange-400',
  },
  {
    id: 'groq',
    name: 'Groq',
    models: 'Llama 3.3, Mixtral (fast!)',
    keyPrefix: 'gsk_',
    keyPlaceholder: 'gsk_...',
    link: 'https://console.groq.com/keys',
    color: 'bg-purple-600',
    textColor: 'text-white',
    hoverBorder: 'hover:border-purple-400',
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: string; id: string; providers: string[] } | null>(null);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | null>>({});
  
  // Form state
  const [name, setName] = useState('');
  const [providerKeys, setProviderKeys] = useState<Record<string, string>>({});
  
  // Alert prompt state (shown after connection created)
  const [showAlertPrompt, setShowAlertPrompt] = useState(false);
  const [alertProvider, setAlertProvider] = useState<string>('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertPeriod, setAlertPeriod] = useState('daily');
  const [alertEmail, setAlertEmail] = useState('');
  const [creatingAlert, setCreatingAlert] = useState(false);

  // Validation helpers
  const validateKey = (providerId: string, key: string) => {
    if (!key) return true; // Empty is valid (optional)
    const provider = PROVIDERS.find(p => p.id === providerId);
    if (!provider || !provider.keyPrefix) return true;
    return key.startsWith(provider.keyPrefix);
  };

  const hasAnyKey = Object.values(providerKeys).some(k => k && k.trim());
  const allKeysValid = Object.entries(providerKeys).every(([id, key]) => validateKey(id, key));

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (error) {
      console.error('Error fetching keys:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createKey() {
    if (!name || !hasAnyKey) return;
    
    setCreating(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          openaiKey: providerKeys.openai || undefined,
          anthropicKey: providerKeys.anthropic || undefined,
          geminiKey: providerKeys.gemini || undefined,
          grokKey: providerKeys.grok || undefined,
          mistralKey: providerKeys.mistral || undefined,
          groqKey: providerKeys.groq || undefined,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setNewKeyData({ key: data.key, id: data.id, providers: data.providers || [] });
        setShowCreate(false);
        setName('');
        setProviderKeys({});
        setShowAlertPrompt(true); // Show alert prompt after success
        fetchKeys();
      }
    } catch (error) {
      console.error('Error creating key:', error);
    } finally {
      setCreating(false);
    }
  }

  async function createAlert() {
    if (!alertThreshold || !alertEmail) return;
    
    setCreatingAlert(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: alertProvider || null, // null = all providers
          thresholdCents: parseFloat(alertThreshold) * 100,
          period: alertPeriod,
          email: alertEmail,
        }),
      });
      
      if (res.ok) {
        setShowAlertPrompt(false);
        setAlertProvider('');
        setAlertThreshold('');
        setAlertPeriod('daily');
        setAlertEmail('');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setCreatingAlert(false);
    }
  }

  function skipAlert() {
    setShowAlertPrompt(false);
    setAlertProvider('');
    setAlertThreshold('');
    setAlertPeriod('daily');
    setAlertEmail('');
  }

  async function deleteKey(id: string) {
    if (!confirm('Are you sure you want to delete this connection?')) return;
    
    try {
      const res = await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setKeys(keys.filter(k => k.id !== id));
        setTestResults(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  }

  async function testConnection(keyId: string) {
    setTesting(keyId);
    setTestResults(prev => ({ ...prev, [keyId]: null }));
    
    try {
      const res = await fetch('/api/keys/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId }),
      });
      
      if (res.ok) {
        setTestResults(prev => ({ ...prev, [keyId]: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, [keyId]: 'error' }));
      }
    } catch {
      setTestResults(prev => ({ ...prev, [keyId]: 'error' }));
    } finally {
      setTesting(null);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadEnvFile(key: string) {
    const envContent = `# TokenMeter API Key
# Add this to your .env file
TOKENMETER_API_KEY=${key}

# Base URLs for each provider:
# OpenAI:    https://tokenmeter.com/api/v1/openai
# Anthropic: https://tokenmeter.com/api/v1/anthropic
# Gemini:    https://tokenmeter.com/api/v1/gemini
# Grok:      https://tokenmeter.com/api/v1/grok
# Mistral:   https://tokenmeter.com/api/v1/mistral
# Groq:      https://tokenmeter.com/api/v1/groq
`;
    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokenmeter.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const getProviderBadges = (key: ApiKey) => {
    const badges = [];
    if (key.hasOpenai) badges.push({ name: 'OpenAI', color: 'bg-black text-white' });
    if (key.hasAnthropic) badges.push({ name: 'Anthropic', color: 'bg-[#D4A574] text-white' });
    if (key.hasGemini) badges.push({ name: 'Gemini', color: 'bg-blue-500 text-white' });
    if (key.hasGrok) badges.push({ name: 'Grok', color: 'bg-zinc-800 text-white' });
    if (key.hasMistral) badges.push({ name: 'Mistral', color: 'bg-orange-500 text-white' });
    if (key.hasGroq) badges.push({ name: 'Groq', color: 'bg-purple-600 text-white' });
    return badges;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connect Your AI Providers</h1>
          <p className="text-muted-foreground">
            Link your AI accounts to start tracking usage and costs across all providers
          </p>
        </div>
        
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </div>

      {/* Where to get your keys */}
      {(showCreate || keys.length === 0) && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Where to get your API keys
            </CardTitle>
            <CardDescription>
              Click any provider to get your API key. Add at least one to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROVIDERS.map((provider) => (
                <a 
                  key={provider.id}
                  href={provider.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-zinc-900 ${provider.hoverBorder} hover:shadow-sm transition-all group`}
                >
                  <div className={`h-8 w-8 rounded-lg ${provider.color} flex items-center justify-center ${provider.textColor} text-xs font-bold`}>
                    {provider.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{provider.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{provider.models}</div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New key created alert */}
      {newKeyData && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">
            Connection Created Successfully!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            <p className="mb-3">Save your TokenMeter key now - it won&apos;t be shown again.</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <code className="bg-green-100 dark:bg-green-800 px-3 py-2 rounded font-mono text-sm break-all">
                {newKeyData.key}
              </code>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newKeyData.key)}
                  className="border-green-300 hover:bg-green-100"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadEnvFile(newKeyData.key)}
                  className="border-green-300 hover:bg-green-100"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download .env
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Alert Prompt (shown after connection creation) */}
      {showAlertPrompt && newKeyData && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Set a Budget Alert?
            </CardTitle>
            <CardDescription>
              Get notified when your spending exceeds a threshold. You can always add more alerts later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium">Track</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={alertProvider}
                  onChange={(e) => setAlertProvider(e.target.value)}
                >
                  <option value="">All Providers</option>
                  {newKeyData.providers.map((p) => {
                    const provider = PROVIDERS.find(pr => pr.id === p);
                    return (
                      <option key={p} value={p}>
                        {provider?.name || p}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Threshold (USD)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 50.00"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Period</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={alertPeriod}
                  onChange={(e) => setAlertPeriod(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={createAlert}
                disabled={creatingAlert || !alertThreshold || !alertEmail}
              >
                {creatingAlert ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Create Alert
                  </>
                )}
              </Button>
              <Button variant="ghost" onClick={skipAlert}>
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create key form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Connection</CardTitle>
            <CardDescription>
              Enter API keys for the providers you want to use. We&apos;ll create a single TokenMeter key that routes to all of them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Connection Name</label>
              <Input
                placeholder="e.g., My Project, Production, Testing"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                A friendly name to help you remember what this connection is for
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {PROVIDERS.map((provider) => {
                const key = providerKeys[provider.id] || '';
                const isValid = validateKey(provider.id, key);
                
                return (
                  <div key={provider.id}>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded ${provider.color}`}></span>
                      {provider.name}
                      <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <div className="relative mt-1">
                      <Input
                        type="password"
                        placeholder={provider.keyPlaceholder}
                        value={key}
                        onChange={(e) => setProviderKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                        className={key && !isValid ? 'border-red-300 focus:border-red-500 pr-8' : key && isValid ? 'border-green-300 focus:border-green-500 pr-8' : ''}
                      />
                      {key && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {key && !isValid && (
                      <p className="text-xs text-red-500 mt-1">
                        {provider.name} keys start with &quot;{provider.keyPrefix}&quot;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!hasAnyKey && (
              <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                Add at least one API key to create a connection
              </p>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={createKey} 
                disabled={creating || !name || !hasAnyKey || !allKeysValid}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Connection'
                )}
              </Button>
              <Button variant="outline" onClick={() => { setShowCreate(false); setProviderKeys({}); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connections table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Connections</CardTitle>
          <CardDescription>
            Use your TokenMeter key to route requests through our proxy and track costs automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading your connections...
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium mb-1">No connections yet</p>
              <p className="text-sm">Add your first connection to start tracking AI costs</p>
              <Button className="mt-4" onClick={() => setShowCreate(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Connection
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>TokenMeter Key</TableHead>
                  <TableHead>Providers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {key.keyPrefix}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getProviderBadges(key).map((badge) => (
                          <Badge key={badge.name} className={`${badge.color} text-xs`}>
                            {badge.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {testResults[key.id] === 'success' ? (
                          <span className="flex items-center text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Connected
                          </span>
                        ) : testResults[key.id] === 'error' ? (
                          <span className="flex items-center text-sm text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Error
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => testConnection(key.id)}
                            disabled={testing === key.id}
                            className="h-7 text-xs"
                          >
                            {testing === key.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Zap className="h-3 w-3 mr-1" />
                                Test
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteKey(key.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Integration guide */}
      {keys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Start Tracking in 2 Minutes</CardTitle>
            <CardDescription>
              Just change your API base URL - everything else stays the same
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Python (OpenAI/Grok/Mistral/Groq)</h4>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://tokenmeter.com/api/v1/openai",
    default_headers={"X-TokenMeter-Key": "tm_..."}
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Python (Anthropic)</h4>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`import anthropic

client = anthropic.Anthropic(
    base_url="https://tokenmeter.com/api/v1/anthropic",
    default_headers={"X-TokenMeter-Key": "tm_..."}
)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                </pre>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              <strong>Supported base URLs:</strong> /api/v1/openai, /api/v1/anthropic, /api/v1/gemini, /api/v1/grok, /api/v1/mistral, /api/v1/groq
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
