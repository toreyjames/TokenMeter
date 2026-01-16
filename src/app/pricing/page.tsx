'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Gauge, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const starterPrice = annual ? 7 : 9;
  const proPrice = annual ? 24 : 29;

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
              <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground">
                Pricing
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

      {/* Pricing Content */}
      <main className="flex-1">
        <section className="container py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Simple, transparent pricing</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Save more than you spend
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Teams typically save 15-30% on AI costs. TokenMeter pays for itself in the first week.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                annual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  annual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {annual && (
              <Badge variant="default" className="bg-green-600 hover:bg-green-600">
                Save 20%
              </Badge>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Starter */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>For solo developers with real API usage</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${starterPrice}</span>
                  <span className="text-muted-foreground">/month</span>
                  {annual && <p className="text-sm text-muted-foreground mt-1">Billed annually (${starterPrice * 12}/year)</p>}
                </div>
              </CardHeader>
              <CardContent>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="w-full mb-6" variant="outline">
                      Start 14-day free trial
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button className="w-full mb-6" variant="outline">
                      Go to Dashboard
                    </Button>
                  </Link>
                </SignedIn>
                
                <ul className="space-y-3">
                  <Feature included>25,000 requests/month</Feature>
                  <Feature included>1 team member</Feature>
                  <Feature included>All 6 AI providers</Feature>
                  <Feature included>30-day log retention</Feature>
                  <Feature included>2 budget alerts</Feature>
                  <Feature included>Cost optimization tips</Feature>
                  <Feature>Slack/Discord alerts</Feature>
                  <Feature>CSV export</Feature>
                  <Feature>API access</Feature>
                </ul>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For teams building AI-powered products</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${proPrice}</span>
                  <span className="text-muted-foreground">/month</span>
                  {annual && <p className="text-sm text-muted-foreground mt-1">Billed annually (${proPrice * 12}/year)</p>}
                </div>
              </CardHeader>
              <CardContent>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="w-full mb-6">
                      Start 14-day free trial
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button className="w-full mb-6">
                      Go to Dashboard
                    </Button>
                  </Link>
                </SignedIn>
                
                <ul className="space-y-3">
                  <Feature included>250,000 requests/month</Feature>
                  <Feature included>5 team members</Feature>
                  <Feature included>All 6 AI providers</Feature>
                  <Feature included>30-day log retention</Feature>
                  <Feature included>Unlimited budget alerts</Feature>
                  <Feature included>Cost optimization tips</Feature>
                  <Feature included>Slack/Discord alerts</Feature>
                  <Feature included>CSV export</Feature>
                  <Feature included>API access</Feature>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Need More */}
          <div className="text-center py-8 border rounded-lg bg-muted/50 max-w-4xl mx-auto mb-16">
            <h3 className="text-xl font-semibold mb-2">Need more?</h3>
            <p className="text-muted-foreground mb-4">
              Higher volumes, longer retention, or custom requirements?
            </p>
            <Button variant="outline">
              Contact us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <FAQ 
                q="How does the 14-day free trial work?"
                a="Start using TokenMeter immediately with full Pro features. No credit card required to start. You'll only be charged if you decide to continue after 14 days."
              />
              <FAQ 
                q="What counts as a request?"
                a="Each API call that passes through TokenMeter counts as one request. This includes calls to any of the 6 supported providers (OpenAI, Anthropic, Google Gemini, xAI Grok, Mistral, Groq)."
              />
              <FAQ 
                q="Can I change plans anytime?"
                a="Yes! Upgrade or downgrade at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at your next billing cycle."
              />
              <FAQ 
                q="What happens if I exceed my request limit?"
                a="We'll notify you when you're approaching your limit. Requests over the limit are still proxied (we won't break your app), but you'll be asked to upgrade to continue tracking."
              />
              <FAQ 
                q="How much can I actually save?"
                a="Most teams find 15-30% savings by identifying: unused API calls, opportunities to use cheaper models, and inefficient prompts. If you're spending $500/mo on AI, expect to save $75-150/mo."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span className="font-semibold">TokenMeter</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TokenMeter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <span className={included ? '' : 'text-muted-foreground'}>{children}</span>
    </li>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="font-semibold mb-2">{q}</h3>
      <p className="text-muted-foreground">{a}</p>
    </div>
  );
}
