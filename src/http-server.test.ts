import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from './http-server';
import type { Server } from 'node:http';

const BASE = 'https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createServer();
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        baseUrl = `http://127.0.0.1:${addr.port}`;
      }
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

async function postConvert(body: unknown, contentType = 'application/json') {
  const res = await fetch(`${baseUrl}/convert`, {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return {
    status: res.status,
    json: await res.json() as Record<string, unknown>,
  };
}

describe('POST /convert', () => {
  it('有効なテキストを変換して HTML を返す', async () => {
    const { status, json } = await postConvert({ text: 'Hello [wow]!' });
    expect(status).toBe(200);
    expect(json.html).toBe(`Hello <img src="${BASE}/wow.webp">!`);
  });

  it('カスタム config 付きリクエストでカスタム設定が適用される', async () => {
    const { status, json } = await postConvert({
      text: '[custom] text',
      config: { base_url: 'https://example.com', emojis: ['[custom]'] },
    });
    expect(status).toBe(200);
    expect(json.html).toBe('<img src="https://example.com/custom.webp"> text');
  });

  it('application/json; charset=utf-8 を許容する', async () => {
    const { status, json } = await postConvert({ text: '[wow]' }, 'application/json; charset=utf-8');
    expect(status).toBe(200);
    expect(json.html).toBe(`<img src="${BASE}/wow.webp">`);
  });

  it('空ボディで 400 エラーを返す', async () => {
    const res = await fetch(`${baseUrl}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    });
    expect(res.status).toBe(400);
  });

  it('text フィールドがない場合 400 エラーを返す', async () => {
    const { status, json } = await postConvert({ notText: 'hello' });
    expect(status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('不正な JSON で 400 エラーを返す', async () => {
    const { status, json } = await postConvert('{invalid json', 'application/json');
    expect(status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('JSON プリミティブ (null) で 400 エラーを返す', async () => {
    const { status, json } = await postConvert('null', 'application/json');
    expect(status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('不正な Content-Type で 400 エラーを返す', async () => {
    const res = await fetch(`${baseUrl}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ text: 'hello' }),
    });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.error).toBeDefined();
  });
});

describe('Method Not Allowed', () => {
  it('GET /convert で 405 エラーを返す', async () => {
    const res = await fetch(`${baseUrl}/convert`);
    expect(res.status).toBe(405);
    const json = await res.json() as Record<string, unknown>;
    expect(json.error).toBe('Method Not Allowed');
  });
});

describe('Not Found', () => {
  it('存在しないパスで 404 エラーを返す', async () => {
    const res = await fetch(`${baseUrl}/unknown`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'hello' }),
    });
    expect(res.status).toBe(404);
    const json = await res.json() as Record<string, unknown>;
    expect(json.error).toBe('Not Found');
  });
});
