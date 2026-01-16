import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Gauge, ArrowLeft } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Gauge className="h-6 w-6" />
            <span className="font-bold">TokenMeter</span>
          </Link>
          <div className="ml-auto">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-10">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Get started with TokenMeter in minutes
        </p>

        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <nav className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Getting Started</p>
            <a href="#quickstart" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Quick Start</a>
            
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">API Providers</p>
            <a href="#openai" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">OpenAI</a>
            <a href="#anthropic" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Anthropic</a>
            <a href="#gemini" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Google Gemini</a>
            <a href="#grok" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">xAI Grok</a>
            <a href="#mistral" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Mistral</a>
            <a href="#groq" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Groq</a>
            
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">IDE Integration</p>
            <a href="#cursor" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Cursor</a>
            <a href="#windsurf" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Windsurf</a>
            <a href="#continue" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Continue.dev</a>
            <a href="#aider" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Aider</a>
            
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Reference</p>
            <a href="#headers" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Response Headers</a>
            <a href="#optimization" className="block px-3 py-2 rounded-lg hover:bg-muted text-sm">Optimization Tips</a>
          </nav>

          {/* Content */}
          <div className="space-y-12">
            {/* Quick Start */}
            <section id="quickstart">
              <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
              <Card>
                <CardHeader>
                  <CardTitle>3 Steps to Start Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge>Step 1</Badge>
                    <p>Create an account and get your TokenMeter API key from the dashboard.</p>
                  </div>
                  <div className="space-y-2">
                    <Badge>Step 2</Badge>
                    <p>Add your provider API keys (OpenAI, Anthropic, Gemini, Grok, Mistral, or Groq).</p>
                  </div>
                  <div className="space-y-2">
                    <Badge>Step 3</Badge>
                    <p>Change your API base URL to point to TokenMeter. That&apos;s it!</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Supported Base URLs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-muted p-2 rounded">OpenAI: /api/v1/openai</div>
                    <div className="bg-muted p-2 rounded">Anthropic: /api/v1/anthropic</div>
                    <div className="bg-muted p-2 rounded">Gemini: /api/v1/gemini</div>
                    <div className="bg-muted p-2 rounded">Grok: /api/v1/grok</div>
                    <div className="bg-muted p-2 rounded">Mistral: /api/v1/mistral</div>
                    <div className="bg-muted p-2 rounded">Groq: /api/v1/groq</div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* OpenAI */}
            <section id="openai">
              <h2 className="text-2xl font-bold mb-4">OpenAI Integration</h2>
              <Tabs defaultValue="python">
                <TabsList>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="node">Node.js</TabsTrigger>
                </TabsList>
                <TabsContent value="python">
                  <Card>
                    <CardContent className="pt-6">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://tokenmeter.com/api/v1/openai",
    default_headers={"X-TokenMeter-Key": "tm_your_key_here"}
)

response = client.chat.completions.create(
    model="gpt-4o-mini",  # or gpt-4o, o1, o1-mini
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="node">
                  <Card>
                    <CardContent className="pt-6">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://tokenmeter.com/api/v1/openai',
  defaultHeaders: { 'X-TokenMeter-Key': 'tm_your_key_here' }
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }]
});`}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>

            {/* Anthropic */}
            <section id="anthropic">
              <h2 className="text-2xl font-bold mb-4">Anthropic Integration</h2>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import anthropic

client = anthropic.Anthropic(
    base_url="https://tokenmeter.com/api/v1/anthropic",
    default_headers={"X-TokenMeter-Key": "tm_your_key_here"}
)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",  # or claude-3-5-haiku, claude-4
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Gemini */}
            <section id="gemini">
              <h2 className="text-2xl font-bold mb-4">Google Gemini Integration</h2>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import google.generativeai as genai

# Configure with TokenMeter proxy
genai.configure(
    api_key="tm_your_key_here",
    transport="rest",
    client_options={"api_endpoint": "tokenmeter.com/api/v1/gemini"}
)

model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content("Hello!")
print(response.text)`}
                  </pre>
                  <p className="text-sm text-muted-foreground mt-4">
                    <strong>Note:</strong> For Gemini, pass your TokenMeter key as the api_key. 
                    TokenMeter will use your configured Gemini key on the backend.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Grok */}
            <section id="grok">
              <h2 className="text-2xl font-bold mb-4">xAI Grok Integration</h2>
              <Card>
                <CardDescription className="px-6 pt-6">Grok uses an OpenAI-compatible API</CardDescription>
                <CardContent className="pt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://tokenmeter.com/api/v1/grok",
    default_headers={"X-TokenMeter-Key": "tm_your_key_here"}
)

response = client.chat.completions.create(
    model="grok-2",  # or grok-2-vision
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Mistral */}
            <section id="mistral">
              <h2 className="text-2xl font-bold mb-4">Mistral Integration</h2>
              <Card>
                <CardDescription className="px-6 pt-6">Mistral uses an OpenAI-compatible API</CardDescription>
                <CardContent className="pt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://tokenmeter.com/api/v1/mistral",
    default_headers={"X-TokenMeter-Key": "tm_your_key_here"}
)

response = client.chat.completions.create(
    model="mistral-large-latest",  # or codestral, mistral-small
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Groq */}
            <section id="groq">
              <h2 className="text-2xl font-bold mb-4">Groq Integration</h2>
              <Card>
                <CardDescription className="px-6 pt-6">Groq uses an OpenAI-compatible API - super fast inference!</CardDescription>
                <CardContent className="pt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://tokenmeter.com/api/v1/groq",
    default_headers={"X-TokenMeter-Key": "tm_your_key_here"}
)

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",  # or mixtral-8x7b, llama-3.1-8b-instant
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* IDE: Cursor */}
            <section id="cursor">
              <h2 className="text-2xl font-bold mb-4">Cursor IDE</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Using TokenMeter with Cursor</CardTitle>
                  <CardDescription>
                    Track costs when using your own API keys in Cursor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Cursor can use your own API keys instead of the built-in subscription. 
                    To track these costs with TokenMeter:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Open Cursor Settings → Models → OpenAI API Key</li>
                    <li>Enter your TokenMeter key: <code className="bg-muted px-1 rounded">tm_your_key</code></li>
                    <li>Set the Base URL to: <code className="bg-muted px-1 rounded">https://tokenmeter.com/api/v1/openai</code></li>
                    <li>All your Cursor AI requests will now be tracked!</li>
                  </ol>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-sm">
                    <strong>Note:</strong> This only works when using your own API keys in Cursor, 
                    not the built-in Cursor Pro subscription.
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* IDE: Windsurf */}
            <section id="windsurf">
              <h2 className="text-2xl font-bold mb-4">Windsurf (Codeium)</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Using TokenMeter with Windsurf</CardTitle>
                  <CardDescription>
                    Track costs when using your own API keys in Windsurf
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Open Windsurf Settings → AI → Custom API Configuration</li>
                    <li>Select your provider (OpenAI, Anthropic, etc.)</li>
                    <li>Set the API endpoint to TokenMeter&apos;s proxy URL</li>
                    <li>Add your TokenMeter key in the headers</li>
                  </ol>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "endpoint": "https://tokenmeter.com/api/v1/openai",
  "headers": {
    "X-TokenMeter-Key": "tm_your_key_here"
  }
}`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* IDE: Continue */}
            <section id="continue">
              <h2 className="text-2xl font-bold mb-4">Continue.dev</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Using TokenMeter with Continue</CardTitle>
                  <CardDescription>
                    Track costs in the Continue VS Code / JetBrains extension
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Edit your <code className="bg-muted px-1 rounded">~/.continue/config.json</code>:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "models": [
    {
      "title": "GPT-4o via TokenMeter",
      "provider": "openai",
      "model": "gpt-4o",
      "apiBase": "https://tokenmeter.com/api/v1/openai",
      "requestOptions": {
        "headers": {
          "X-TokenMeter-Key": "tm_your_key_here"
        }
      }
    },
    {
      "title": "Claude via TokenMeter",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "apiBase": "https://tokenmeter.com/api/v1/anthropic",
      "requestOptions": {
        "headers": {
          "X-TokenMeter-Key": "tm_your_key_here"
        }
      }
    }
  ]
}`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* IDE: Aider */}
            <section id="aider">
              <h2 className="text-2xl font-bold mb-4">Aider</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Using TokenMeter with Aider</CardTitle>
                  <CardDescription>
                    Track costs in the Aider CLI coding assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Set environment variables before running Aider:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# For OpenAI models
export OPENAI_API_BASE=https://tokenmeter.com/api/v1/openai
export OPENAI_API_KEY=tm_your_key_here

# For Anthropic models  
export ANTHROPIC_API_URL=https://tokenmeter.com/api/v1/anthropic
export ANTHROPIC_API_KEY=tm_your_key_here

# Run Aider
aider --model gpt-4o`}
                  </pre>
                  <p className="text-sm text-muted-foreground mt-4">
                    Or add to your <code className="bg-muted px-1 rounded">.aider.conf.yml</code>:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`openai-api-base: https://tokenmeter.com/api/v1/openai
openai-api-key: tm_your_key_here`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Response Headers */}
            <section id="headers">
              <h2 className="text-2xl font-bold mb-4">Response Headers</h2>
              <Card>
                <CardHeader>
                  <CardTitle>TokenMeter adds useful headers to every response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">X-TokenMeter-Cost-Cents</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The cost of this request in cents (e.g., &quot;5&quot; = $0.05)
                      </p>
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">X-TokenMeter-Input-Tokens</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Number of input/prompt tokens used
                      </p>
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">X-TokenMeter-Output-Tokens</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Number of output/completion tokens generated
                      </p>
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">X-TokenMeter-Latency-Ms</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total request latency in milliseconds
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Optimization */}
            <section id="optimization">
              <h2 className="text-2xl font-bold mb-4">Optimization Tips</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold">Use the right model for the job</h4>
                    <p className="text-sm text-muted-foreground">
                      GPT-4o-mini, Claude 3.5 Haiku, Gemini Flash, and Groq&apos;s Llama are 90%+ cheaper 
                      than premium models and work great for most tasks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Try Groq for speed</h4>
                    <p className="text-sm text-muted-foreground">
                      Groq offers incredibly fast inference (100+ tokens/sec) at low prices. 
                      Great for real-time applications.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Watch your context length</h4>
                    <p className="text-sm text-muted-foreground">
                      You pay for input tokens too. Summarize long contexts before sending them.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Set up budget alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure alerts in the dashboard to get notified before you exceed your budget.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
