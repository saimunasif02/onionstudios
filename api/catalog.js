import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { blobs } = await list({ prefix: 'catalog.json' });
    res.setHeader('Cache-Control', 'no-store');
    if (!blobs.length) return res.json({});
    const r = await fetch(blobs[0].url + '?t=' + Date.now());
    return res.json(await r.json());
  }
  if (req.method === 'POST') {
    if (!process.env.ADMIN_PASSWORD || req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: 'Password vul' });
    if (req.body && req.body.verify) return res.json({ ok: true });
    await put('catalog.json', JSON.stringify(req.body), {
      access: 'public', addRandomSuffix: false, allowOverwrite: true,
      contentType: 'application/json', cacheControlMaxAge: 0
    });
    return res.json({ ok: true });
  }
  res.status(405).end();
}
