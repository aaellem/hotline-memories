import type { VercelRequest } from '@vercel/node';

export function requireAdmin(req: VercelRequest) {
  const provided = (req.headers['x-admin-key'] || req.query.key || '') as string;
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error('ADMIN_PASSWORD not configured');
  if (!provided || provided !== expected) {
    const err: any = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
}
