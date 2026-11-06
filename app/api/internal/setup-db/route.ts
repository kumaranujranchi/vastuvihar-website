import { NextResponse } from 'next/server';
import { INIT_SCHEMA_SQL } from '@/lib/dbBootstrap';

export async function GET() {
  try {
    let cf: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getCloudflareContext } = require('@opennextjs/cloudflare');
      cf = getCloudflareContext();
    } catch {}

    const db = cf?.env?.DB;

    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Cloudflare D1 binding (env.DB) is not available. If running on AWS Lightsail or Node.js, run `npx prisma db push` to initialize tables.',
        envKeys: Object.keys(cf?.env || {}),
      }, { status: 400 });
    }

    try {
      await db.prepare("PRAGMA foreign_keys = OFF;").run();
    } catch {}

    const statements = INIT_SCHEMA_SQL.split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const results: Array<{ stmt: string; error?: string }> = [];
    let successCount = 0;

    for (const stmt of statements) {
      try {
        await db.prepare(stmt).run();
        successCount++;
      } catch (err: any) {
        results.push({ stmt: stmt.slice(0, 50), error: err?.message || String(err) });
      }
    }

    // Verify all tables created
    const tablesResult = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name ASC").all();
    const tableNames = (tablesResult?.results || []).map((r: any) => r.name);

    return NextResponse.json({
      success: tableNames.includes('Lead') && tableNames.includes('AdminUser'),
      totalStatements: statements.length,
      successCount,
      errors: results,
      tables: tableNames,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || String(error),
    }, { status: 500 });
  }
}

export const POST = GET;
