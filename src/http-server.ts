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

async function handleConvert(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const contentType = req.headers['content-type'] ?? '';
  if (!contentType.includes('application/json')) {
    sendJson(res, 400, { error: 'Content-Type は application/json である必要があります' });
    return;
  }

  const raw = await readBody(req);
  if (!raw) {
    sendJson(res, 400, { error: 'リクエストボディが空です' });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    sendJson(res, 400, { error: 'JSON の解析に失敗しました' });
    return;
  }

  if (typeof body.text !== 'string') {
    sendJson(res, 400, { error: 'text フィールドは必須です' });
    return;
  }

  const options = body.config
    ? { config: body.config as { base_url: string; emojis: string[] } }
    : undefined;

  const html = convertCustomEmoji(body.text, options);
  sendJson(res, 200, { html });
}

export function createServer() {
  return createHttpServer((req, res) => {
    handleConvert(req, res).catch(() => {
      sendJson(res, 500, { error: 'Internal Server Error' });
    });
  });
}
