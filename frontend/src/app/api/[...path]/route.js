import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8005';

export async function GET(request, { params }) {
  return proxyRequest(request, params.path);
}

export async function POST(request, { params }) {
  return proxyRequest(request, params.path);
}

async function proxyRequest(request, path) {
  try {
    const url = new URL(request.url);
    const backendUrl = new URL(
      `/api/${path.join('/')}${url.search}`,
      BACKEND_URL
    );

    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': response.headers.get('Cache-Control') || 'no-cache',
      },
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Backend service unavailable' },
      { status: 502 }
    );
  }
}
