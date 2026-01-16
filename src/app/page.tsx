import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, DollarSign, Zap, TrendingUp, ArrowRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Gauge className="h-6 w-6" />
            <span className="font-bold">TokenMeter</span>
          </Link>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/docs" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Docs
              </Link>
            </nav>
            
            <SignedIn>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Get Started</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center justify-center gap-4 py-24 md:py-32">
        <Badge variant="secondary" className="mb-4">
          OpenAI • Anthropic • Gemini • Grok • Mistral • Groq
        </Badge>
        
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Know exactly what your
          <span className="text-primary block">AI is costing you</span>
        </h1>
        
        <p className="max-w-[700px] text-center text-lg text-muted-foreground md:text-xl">
          Track every token, get cost optimization suggestions, and never be surprised 
          by your AI bill again. One line integration.
        </p>
        
        <div className="flex gap-4 mt-6">
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignInButton>
          </SignedOut>
          <Link href="/docs">
            <Button size="lg" variant="outline">
              View Docs
            </Button>
          </Link>
        </div>
        
        {/* Code snippet */}
        <div className="mt-12 w-full max-w-2xl">
          <div className="rounded-lg border bg-muted p-4">
            <p className="text-sm text-muted-foreground mb-2">One line change:</p>
            <pre className="text-sm overflow-x-auto">
              <code>{`client = OpenAI(base_url="https://tokenmeter.com/api/v1/openai")`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="container py-12 border-t">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Track costs across all major AI providers
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-bold">O</div>
            <span className="font-medium">OpenAI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#D4A574] flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="font-medium">Anthropic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="font-medium">Gemini</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white text-xs font-bold">X</div>
            <span className="font-medium">Grok</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="font-medium">Mistral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="font-medium">Groq</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight mb-12">
          Everything you need to control AI costs
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Real-time Cost Tracking</CardTitle>
              <CardDescription>
                See exactly what every API call costs, broken down by model and endpoint.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Optimization Tips</CardTitle>
              <CardDescription>
                Get actionable suggestions to reduce costs. &quot;Switch to Haiku, save 80%&quot;
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Zero Latency Impact</CardTitle>
              <CardDescription>
                Edge-deployed proxy adds &lt;1ms to your requests. You won&apos;t notice it.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Gauge className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Budget Alerts</CardTitle>
              <CardDescription>
                Set spending limits and get notified before you blow your budget.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="container py-16 md:py-24 border-t">
        <h2 className="text-center text-3xl font-bold tracking-tight mb-4">
          Simple pricing
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Start free, scale as you grow
        </p>
        
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For personal projects</CardDescription>
              <div className="text-3xl font-bold">$0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  10K requests/month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  7-day data retention
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  1 connection
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <Badge className="w-fit mb-2">Popular</Badge>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For teams & production</CardDescription>
              <div className="text-3xl font-bold">$19<span className="text-base font-normal">/mo</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited requests
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  30-day data retention
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited connections
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Budget alerts
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
              <div className="text-3xl font-bold">Custom</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  SSO/SAML
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Self-hosted option
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Dedicated support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            <span className="font-semibold">TokenMeter</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Built for developers who care about costs.
          </p>
        </div>
      </footer>
    </div>
  );
}
