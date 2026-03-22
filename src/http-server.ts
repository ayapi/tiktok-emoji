import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { convertCustomEmoji } from './converter';

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  if (url.pathname !== '/convert') {
    sendJson(res, 404, { error: 'Not Found' });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const contentType = (req.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    sendJson(res, 400, { error: 'Content-Type は application/json である必要があります' });
    return;
  }

  const raw = await readBody(req);
  if (!raw) {
    sendJson(res, 400, { error: 'リクエストボディが空です' });
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    sendJson(res, 400, { error: 'JSON の解析に失敗しました' });
    return;
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    sendJson(res, 400, { error: 'JSON の解析に失敗しました' });
    return;
  }

  const body = parsed as Record<string, unknown>;
  if (typeof body.text !== 'string') {
    sendJson(res, 400, { error: 'text フィールドは必須です' });
    return;
  }

  let options: { config: { base_url: string; emojis: string[] } } | undefined;
  if (body.config !== undefined) {
    const cfg = body.config;
    if (
      !cfg || typeof cfg !== 'object' || Array.isArray(cfg) ||
      typeof (cfg as Record<string, unknown>).base_url !== 'string' ||
      !Array.isArray((cfg as Record<string, unknown>).emojis) ||
      !(cfg as Record<string, unknown[]>).emojis.every((e: unknown) => typeof e === 'string')
    ) {
      sendJson(res, 400, { error: 'config の形式が不正です (base_url: string, emojis: string[] が必要)' });
      return;
    }
    options = { config: cfg as { base_url: string; emojis: string[] } };
  }

  const html = convertCustomEmoji(body.text, options);
  sendJson(res, 200, { html });
}

export function createServer() {
  return createHttpServer((req, res) => {
    handleRequest(req, res).catch(() => {
      if (!res.headersSent) {
        sendJson(res, 500, { error: 'Internal Server Error' });
      }
    });
  });
}
