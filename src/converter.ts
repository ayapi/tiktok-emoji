// placeholder - implemented in Task 3
export interface BeansEmojiConfig {
  readonly base_url: string;
  readonly emojis: readonly string[];
}

export interface ConvertOptions {
  config?: BeansEmojiConfig;
}

export function resolveEmojiUrl(_emojiCode: string, _config: BeansEmojiConfig): string | undefined {
  return undefined;
}

export function convertCustomEmoji(text: string, _options?: ConvertOptions): string {
  return text;
}
