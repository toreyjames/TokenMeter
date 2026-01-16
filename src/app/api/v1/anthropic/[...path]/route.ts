import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-keys';
import { calculateCost } from '@/lib/pricing';
import { db } from '@/lib/db';
import { requestLogs } from '@/drizzle/schema';

export const runtime = 'edge';

const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1';

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
                          request.headers.get('x-api-key')?.startsWith('tm_') 
                            ? request.headers.get('x-api-key') 
                            : null;
    
    // Validate the key
    const keyData = await validateApiKey(tokenMeterKey);
    
    if (!keyData) {
      return NextResponse.json(
        { error: 'Invalid or missing TokenMeter API key' },
        { status: 401 }
      );
    }
    
    if (!keyData.anthropicKey) {
      return NextResponse.json(
        { error: 'No Anthropic API key configured. Add one in your TokenMeter dashboard.' },
        { status: 400 }
      );
    }
    
    // Clone the request body
    const body = await request.json();
    const model = body.model || 'unknown';
    
    // Forward to Anthropic
    const anthropicResponse = await fetch(`${ANTHROPIC_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'x-api-key': keyData.anthropicKey,
        'Content-Type': 'application/json',
        'anthropic-version': request.headers.get('anthropic-version') || '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    
    const latencyMs = Date.now() - startTime;
    
    // Parse response
    const responseData = await anthropicResponse.json();
    
    // Extract token usage from Anthropic response
    let inputTokens = 0;
    let outputTokens = 0;
    
    if (responseData.usage) {
      inputTokens = responseData.usage.input_tokens || 0;
      outputTokens = responseData.usage.output_tokens || 0;
    }
    
    // Calculate cost
    const costCents = calculateCost('anthropic', model, { 
      input: inputTokens, 
      output: outputTokens 
    });
    
    // Log the request (async - don't block response)
    logRequest({
      apiKeyId: keyData.id,
      provider: 'anthropic',
      model,
      endpoint,
      inputTokens,
      outputTokens,
      costCents,
      latencyMs,
      statusCode: anthropicResponse.status,
      requestBody: body,
      responsePreview: JSON.stringify(responseData).substring(0, 500),
    }).catch(console.error);
    
    // Return response with added headers
    return NextResponse.json(responseData, {
      status: anthropicResponse.status,
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
