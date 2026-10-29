import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/lib/dnsaid/server';

export const dynamic = 'force-dynamic';

async function dispatch(request: NextRequest, method: string) {
  let body: unknown = {};
  if (method === 'POST') {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const { statusCode, payload } = await app.handle(method, request.nextUrl.pathname, { body, query });
  return NextResponse.json(payload, { status: statusCode });
}

export function GET(request: NextRequest) {
  return dispatch(request, 'GET');
}

export function POST(request: NextRequest) {
  return dispatch(request, 'POST');
}
