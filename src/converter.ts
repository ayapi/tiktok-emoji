// placeholder - implemented in Task 3
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

export function convertCustomEmoji(text: string, _options?: ConvertOptions): string {
  return text;
}
