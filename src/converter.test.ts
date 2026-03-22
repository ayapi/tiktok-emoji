import { describe, it, expect } from 'vitest';
import { resolveEmojiUrl, convertCustomEmoji } from './converter';
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

describe('convertCustomEmoji', () => {
  const BASE = 'https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg';

  it('単一の絵文字コードを <img> 要素に変換する', () => {
    expect(convertCustomEmoji('[wow]')).toBe(
      `<img src="${BASE}/wow.webp">`,
    );
  });

  it('複数の絵文字コードを含むテキストを変換する', () => {
    expect(convertCustomEmoji('Hello [wow] world [laugh]!')).toBe(
      `Hello <img src="${BASE}/wow.webp"> world <img src="${BASE}/laugh.webp">!`,
    );
  });

  it('未知の絵文字コードは元テキストをそのまま維持する', () => {
    expect(convertCustomEmoji('[unknown]')).toBe('[unknown]');
  });

  it('絵文字コードを含まないテキストはそのまま返す', () => {
    expect(convertCustomEmoji('Hello world!')).toBe('Hello world!');
  });

  it('絵文字コード以外のテキスト部分を変更しない', () => {
    expect(convertCustomEmoji('前[wow]後')).toBe(
      `前<img src="${BASE}/wow.webp">後`,
    );
  });

  it('既知と未知の絵文字が混在するテキストを正しく処理する', () => {
    expect(convertCustomEmoji('[wow] and [unknown] and [laugh]')).toBe(
      `<img src="${BASE}/wow.webp"> and [unknown] and <img src="${BASE}/laugh.webp">`,
    );
  });

  it('カスタム設定を使用する', () => {
    const customConfig = {
      base_url: 'https://example.com',
      emojis: ['[custom]'],
    };
    expect(convertCustomEmoji('[custom] text', { config: customConfig })).toBe(
      '<img src="https://example.com/custom.webp"> text',
    );
  });

  it('カスタム設定ではデフォルト絵文字を認識しない', () => {
    const customConfig = {
      base_url: 'https://example.com',
      emojis: ['[custom]'],
    };
    expect(convertCustomEmoji('[wow]', { config: customConfig })).toBe('[wow]');
  });
});
