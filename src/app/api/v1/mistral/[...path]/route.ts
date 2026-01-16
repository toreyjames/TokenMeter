import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-keys';
import { calculateCost } from '@/lib/pricing';
import { db } from '@/lib/db';
import { requestLogs } from '@/drizzle/schema';

export const runtime = 'edge';

// Mistral uses OpenAI-compatible API
const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const startTime = Date.now();
  const { path } = await params;
  const endpoint = '/' + path.join('/');
  
  try {
    // Get TokenMeter API key from header
    const tokenMeterKey = request.headers.get('x-tokenmeter-key') || 
                          request.headers.get('authorization')?.replace('Bearer tm_', 'tm_');
    
    // Validate the key
    const keyData = await validateApiKey(tokenMeterKey || null);
    
    if (!keyData) {
      return NextResponse.json(
        { error: 'Invalid or missing TokenMeter API key' },
        { status: 401 }
      );
    }
    
    if (!keyData.mistralKey) {
      return NextResponse.json(
        { error: 'No Mistral API key configured. Add one in your TokenMeter dashboard.' },
        { status: 400 }
      );
    }
    
    // Clone the request body
    const body = await request.json();
    const model = body.model || 'unknown';
    
    // Forward to Mistral (OpenAI-compatible)
    const mistralResponse = await fetch(`${MISTRAL_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.mistralKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const latencyMs = Date.now() - startTime;
    
    // Parse response
    const responseData = await mistralResponse.json();
    
    // Extract token usage (OpenAI format)
    let inputTokens = 0;
    let outputTokens = 0;
    
    if (responseData.usage) {
      inputTokens = responseData.usage.prompt_tokens || 0;
      outputTokens = responseData.usage.completion_tokens || 0;
    }
    
    // Calculate cost
    const costCents = calculateCost('mistral', model, { 
      input: inputTokens, 
      output: outputTokens 
    });
    
    // Log the request (async - don't block response)
    logRequest({
      apiKeyId: keyData.id,
      provider: 'mistral',
      model,
      endpoint,
      inputTokens,
      outputTokens,
      costCents,
      latencyMs,
      statusCode: mistralResponse.status,
      requestBody: body,
      responsePreview: JSON.stringify(responseData).substring(0, 500),
    }).catch(console.error);
    
    // Return response with added headers
    return NextResponse.json(responseData, {
      status: mistralResponse.status,
      headers: {
        'X-TokenMeter-Cost-Cents': costCents.toString(),
        'X-TokenMeter-Input-Tokens': inputTokens.toString(),
        'X-TokenMeter-Output-Tokens': outputTokens.toString(),
        'X-TokenMeter-Latency-Ms': latencyMs.toString(),
      },
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = '/' + path.join('/');
  
  const tokenMeterKey = request.headers.get('x-tokenmeter-key');
  const keyData = await validateApiKey(tokenMeterKey);
  
  if (!keyData || !keyData.mistralKey) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  const response = await fetch(`${MISTRAL_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${keyData.mistralKey}`,
    },
  });
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

async function logRequest(data: {
  apiKeyId: string;
  provider: string;
  model: string;
  endpoint: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  latencyMs: number;
  statusCode: number;
  requestBody?: unknown;
  responsePreview?: string;
}) {
  await db.insert(requestLogs).values({
    apiKeyId: data.apiKeyId,
    provider: data.provider,
    model: data.model,
    endpoint: data.endpoint,
    inputTokens: data.inputTokens,
    outputTokens: data.outputTokens,
    costCents: data.costCents,
    latencyMs: data.latencyMs,
    statusCode: data.statusCode,
    requestBody: data.requestBody,
    responsePreview: data.responsePreview,
  });
}
