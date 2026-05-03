import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const configs = await db.siteConfig.findMany();
    const configMap: Record<string, string> = {};
    for (const c of configs) {
      configMap[c.key] = c.value;
    }
    return NextResponse.json({ configs: configMap });
  } catch (error) {
    console.error('SiteConfig GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const results = [];

    for (const [key, value] of Object.entries(body)) {
      const config = await db.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      results.push(config);
    }

    return NextResponse.json({ configs: results, message: 'Site config updated' });
  } catch (error) {
    console.error('SiteConfig PUT error:', error);
    return NextResponse.json({ error: 'Failed to update site config' }, { status: 500 });
  }
}
