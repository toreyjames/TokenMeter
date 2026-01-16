'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Trash2, DollarSign, Mail, Clock, Loader2 } from 'lucide-react';

interface Alert {
  id: string;
  provider: string | null;
  thresholdCents: number;
  period: string;
  email: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
}

// Provider display info
const PROVIDER_INFO: Record<string, { name: string; color: string }> = {
  openai: { name: 'OpenAI', color: 'bg-black text-white' },
  anthropic: { name: 'Anthropic', color: 'bg-[#D4A574] text-white' },
  gemini: { name: 'Gemini', color: 'bg-blue-500 text-white' },
  grok: { name: 'Grok', color: 'bg-zinc-800 text-white' },
  mistral: { name: 'Mistral', color: 'bg-orange-500 text-white' },
  groq: { name: 'Groq', color: 'bg-purple-600 text-white' },
};

export default function SettingsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [newProvider, setNewProvider] = useState('');
  const [newThreshold, setNewThreshold] = useState('');
  const [newPeriod, setNewPeriod] = useState('daily');
  const [newEmail, setNewEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAlerts();
    fetchConfiguredProviders();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfiguredProviders = async () => {
    try {
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = await res.json();
        setConfiguredProviders(data.configuredProviders || []);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const createAlert = async () => {
    if (!newThreshold || !newEmail) return;
    
    setIsCreating(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: newProvider || null,
          thresholdCents: parseFloat(newThreshold) * 100,
          period: newPeriod,
          email: newEmail,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAlerts([...alerts, data]);
        setNewProvider('');
        setNewThreshold('');
        setNewEmail('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleAlert = async (alert: Alert) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: alert.id,
          enabled: !alert.enabled,
        }),
      });

      if (res.ok) {
        setAlerts(alerts.map(a => 
          a.id === alert.id ? { ...a, enabled: !a.enabled } : a
        ));
      }
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAlerts(alerts.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const periodLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };

  const getProviderBadge = (provider: string | null) => {
    if (!provider) {
      return <Badge variant="outline">All Providers</Badge>;
    }
    const info = PROVIDER_INFO[provider];
    if (info) {
      return <Badge className={info.color}>{info.name}</Badge>;
    }
    return <Badge variant="outline">{provider}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Alerts</h1>
        <p className="text-muted-foreground mt-2">
          Get notified when your AI spending exceeds thresholds
        </p>
      </div>

      {/* Budget Alerts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Your Alerts
            </CardTitle>
            <CardDescription>
              Manage your spending alerts across all providers
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Alert'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* New Alert Form */}
          {showForm && (
            <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 space-y-4">
              <h3 className="font-medium">Create New Alert</h3>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Track</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                  >
                    <option value="">All Providers</option>
                    {configuredProviders.map((p) => (
                      <option key={p} value={p}>
                        {PROVIDER_INFO[p]?.name || p}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-zinc-500" />
                    Threshold (USD)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 50.00"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-500" />
                    Period
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="alerts@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={createAlert} 
                  disabled={isCreating || !newThreshold || !newEmail}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Alert'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* No providers configured warning */}
          {configuredProviders.length === 0 && !isLoading && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                You haven&apos;t added any API connections yet. Add a connection first to start tracking costs.
              </p>
            </div>
          )}

          {/* Alerts List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No budget alerts configured</p>
              <p className="text-sm mt-1">Create an alert to get notified when spending exceeds your limits</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg flex items-center justify-between transition-opacity ${
                    !alert.enabled ? 'opacity-50' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getProviderBadge(alert.provider)}
                      <span className="font-semibold text-lg">
                        {formatCurrency(alert.thresholdCents)}
                      </span>
                      <Badge variant="outline">{periodLabels[alert.period]}</Badge>
                      <Badge variant={alert.enabled ? 'default' : 'secondary'}>
                        {alert.enabled ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {alert.email}
                      </span>
                      {alert.lastTriggeredAt && (
                        <span>
                          Last triggered: {new Date(alert.lastTriggeredAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAlert(alert)}
                    >
                      {alert.enabled ? 'Pause' : 'Enable'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Alert Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Daily Alerts</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Best for catching runaway costs quickly. Set to your average daily spend + 50%.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100">Per-Provider Alerts</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Track expensive providers like GPT-4o or Claude separately from cheaper ones.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
            <h4 className="font-medium text-amber-900 dark:text-amber-100">Pro Tip</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Set multiple alerts at different thresholds (e.g., 50%, 75%, 100% of budget) 
              to get early warnings before you hit your limit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
