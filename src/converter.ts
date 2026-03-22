import { DEFAULT_BEANS_EMOJI_CONFIG } from './data/emoji-map';

const EMOJI_PATTERN = /(\[[a-zA-Z0-9_]+\])/g;

export interface BeansEmojiConfig {
  readonly base_url: string;
  readonly emojis: readonly string[];
}

export interface ConvertOptions {
  config?: BeansEmojiConfig;
}

export function resolveEmojiUrl(emojiCode: string, config: BeansEmojiConfig): string | undefined {
  if (!config.emojis.includes(emojiCode)) return undefined;
  const name = emojiCode.replace(/^\[|\]$/g, '');
  return `${config.base_url}/${name}.webp`;
}

export function convertCustomEmoji(text: string, options?: ConvertOptions): string {
  const config = options?.config ?? DEFAULT_BEANS_EMOJI_CONFIG;
  return text.replace(EMOJI_PATTERN, (match) => {
    const url = resolveEmojiUrl(match, config);
    return url ? `<img src="${url}">` : match;
  });
}
