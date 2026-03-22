import { describe, it, expect } from 'vitest';
import { resolveEmojiUrl } from './converter';
import { DEFAULT_BEANS_EMOJI_CONFIG } from './data/emoji-map';

describe('resolveEmojiUrl', () => {
  it('既知の絵文字コードから CDN URL を返す', () => {
    expect(resolveEmojiUrl('[wow]', DEFAULT_BEANS_EMOJI_CONFIG)).toBe(
      'https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg/wow.webp',
    );
  });

  it('ブラケットを除去して URL を構築する', () => {
    expect(resolveEmojiUrl('[laugh]', DEFAULT_BEANS_EMOJI_CONFIG)).toBe(
      'https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg/laugh.webp',
    );
  });

  it('未知の絵文字コードには undefined を返す', () => {
    expect(resolveEmojiUrl('[unknown]', DEFAULT_BEANS_EMOJI_CONFIG)).toBeUndefined();
  });

  it('カスタム設定の base_url を使用する', () => {
    const customConfig = {
      base_url: 'https://example.com/emojis',
      emojis: ['[test]'],
    };
    expect(resolveEmojiUrl('[test]', customConfig)).toBe(
      'https://example.com/emojis/test.webp',
    );
  });
});
