import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-keys';
import { calculateCost } from '@/lib/pricing';
import { db } from '@/lib/db';
import { requestLogs } from '@/drizzle/schema';

export const runtime = 'edge';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

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
    
    if (!keyData.geminiKey) {
      return NextResponse.json(
        { error: 'No Gemini API key configured. Add one in your TokenMeter dashboard.' },
        { status: 400 }
      );
    }
    
    // Clone the request body
    const body = await request.json();
    
    // Extract model from the path (Gemini uses /models/{model}:generateContent)
    const modelMatch = endpoint.match(/models\/([^/:]+)/);
    const model = modelMatch ? modelMatch[1] : 'unknown';
    
    // Forward to Gemini with API key as query param
    const url = new URL(`${GEMINI_BASE_URL}${endpoint}`);
    url.searchParams.set('key', keyData.geminiKey);
    
    const geminiResponse = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const latencyMs = Date.now() - startTime;
    
    // Parse response
    const responseData = await geminiResponse.json();
    
    // Extract token usage from Gemini response
    let inputTokens = 0;
    let outputTokens = 0;
    
    if (responseData.usageMetadata) {
      inputTokens = responseData.usageMetadata.promptTokenCount || 0;
      outputTokens = responseData.usageMetadata.candidatesTokenCount || 0;
    }
    
    // Calculate cost
    const costCents = calculateCost('gemini', model, { 
      input: inputTokens, 
      output: outputTokens 
    });
    
    // Log the request (async - don't block response)
    logRequest({
      apiKeyId: keyData.id,
      provider: 'gemini',
      model,
      endpoint,
      inputTokens,
      outputTokens,
      costCents,
      latencyMs,
      statusCode: geminiResponse.status,
      requestBody: body,
      responsePreview: JSON.stringify(responseData).substring(0, 500),
    }).catch(console.error);
    
    // Return response with added headers
    return NextResponse.json(responseData, {
      status: geminiResponse.status,
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

// GET for listing models
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = '/' + path.join('/');
  
  const tokenMeterKey = request.headers.get('x-tokenmeter-key');
  const keyData = await validateApiKey(tokenMeterKey);
  
  if (!keyData || !keyData.geminiKey) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  const url = new URL(`${GEMINI_BASE_URL}${endpoint}`);
  url.searchParams.set('key', keyData.geminiKey);
  
  const response = await fetch(url.toString());
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
