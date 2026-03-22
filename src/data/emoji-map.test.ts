import { describe, it, expect } from 'vitest';
import { DEFAULT_BEANS_EMOJI_CONFIG } from './emoji-map';

describe('DEFAULT_BEANS_EMOJI_CONFIG', () => {
  it('base_url が TikTok LIVE Studio CDN を指す', () => {
    expect(DEFAULT_BEANS_EMOJI_CONFIG.base_url).toBe(
      'http://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg',
    );
  });

  it('全24種の絵文字コードを含む', () => {
    expect(DEFAULT_BEANS_EMOJI_CONFIG.emojis).toHaveLength(24);
  });

  it('絵文字コードは [name] 形式である', () => {
    for (const emoji of DEFAULT_BEANS_EMOJI_CONFIG.emojis) {
      expect(emoji).toMatch(/^\[[a-zA-Z0-9_]+\]$/);
    }
  });

  it('既知の絵文字コードを含む', () => {
    expect(DEFAULT_BEANS_EMOJI_CONFIG.emojis).toContain('[wow]');
    expect(DEFAULT_BEANS_EMOJI_CONFIG.emojis).toContain('[laugh]');
    expect(DEFAULT_BEANS_EMOJI_CONFIG.emojis).toContain('[heart]');
    expect(DEFAULT_BEANS_EMOJI_CONFIG.emojis).toContain('[sagemoney]');
  });
});
