import { describe, it, expect } from 'vitest';
import { DEFAULT_BEANS_EMOJI_CONFIG } from './emoji-map';

describe('DEFAULT_BEANS_EMOJI_CONFIG', () => {
  it('base_url が TikTok LIVE Studio CDN (HTTPS) を指す', () => {
    expect(DEFAULT_BEANS_EMOJI_CONFIG.base_url).toBe(
      'https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg',
    );
  });

  it('調査資料の全24種 CustomEmoji と完全一致する', () => {
    expect([...DEFAULT_BEANS_EMOJI_CONFIG.emojis]).toEqual([
      '[wow]', '[laugh]', '[thanks]', '[laughcry]',
      '[thumb]', '[hi]', '[heart]', '[congrat]',
      '[rockyserious]', '[rockyloveit]', '[rockyproud]', '[rockycool]',
      '[rosiedislike]', '[rosieawkward]', '[rosiekisskiss]', '[rosiecute]',
      '[jolliekissingface]', '[jolliewow]', '[jolliespeechless]', '[jolliesatisfied]',
      '[sagethink]', '[sagefulfilled]', '[sageclever]', '[sagemoney]',
    ]);
  });

  it('絵文字コードは [name] 形式である', () => {
    for (const emoji of DEFAULT_BEANS_EMOJI_CONFIG.emojis) {
      expect(emoji).toMatch(/^\[[a-zA-Z0-9_]+\]$/);
    }
  });
});
