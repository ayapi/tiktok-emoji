# tiktok-emoji

TikTok LIVE Studio のチャットコメントに含まれる CustomEmoji（`[emoji_name]` 形式）を、CDN 画像の `<img>` 要素に変換するライブラリ。

## インストール

Git URL で直接インストールできます（プライベートリポジトリ対応）。

```bash
pnpm add github:ayapi/tiktok-emoji
# または
pnpm add git+ssh://git@github.com:ayapi/tiktok-emoji.git
```

## 使い方

### ライブラリとして

```typescript
import { convertCustomEmoji } from 'tiktok-emoji';

const html = convertCustomEmoji('Hello [wow] world [laugh]!');
// => 'Hello <img src="https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/.../wow.webp"> world <img src=".../laugh.webp">!'
```

未知の絵文字コードはそのまま維持されます。

```typescript
convertCustomEmoji('[unknown]');
// => '[unknown]'
```

### カスタム設定

デフォルトの絵文字リスト（全24種）の代わりにカスタム設定を使えます。

```typescript
import { convertCustomEmoji } from 'tiktok-emoji';

const html = convertCustomEmoji('[custom] text', {
  config: {
    base_url: 'https://your-cdn.example.com/emojis',
    emojis: ['[custom]', '[another]'],
  },
});
// => '<img src="https://your-cdn.example.com/emojis/custom.webp"> text'
```

### URL 解決

個別の絵文字コードから CDN URL を取得できます。

```typescript
import { resolveEmojiUrl, DEFAULT_BEANS_EMOJI_CONFIG } from 'tiktok-emoji';

resolveEmojiUrl('[wow]', DEFAULT_BEANS_EMOJI_CONFIG);
// => 'https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg/wow.webp'

resolveEmojiUrl('[unknown]', DEFAULT_BEANS_EMOJI_CONFIG);
// => undefined
```

### HTTP API サーバー

```typescript
import { createServer } from 'tiktok-emoji/server';

const server = createServer();
server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
```

#### `POST /convert`

```bash
curl -X POST http://localhost:3000/convert \
  -H 'Content-Type: application/json' \
  -d '{"text": "Hello [wow]!"}'
```

レスポンス:

```json
{ "html": "Hello <img src=\"https://p16-tiktok-livestudio-asset-sg.ibyteimg.com/tos-alisg-i-x0wz2yqgvw-sg/wow.webp\">!" }
```

カスタム設定付き:

```json
{
  "text": "[custom] text",
  "config": {
    "base_url": "https://your-cdn.example.com",
    "emojis": ["[custom]"]
  }
}
```

#### エラーレスポンス

| Status | 条件 |
|--------|------|
| 400 | 空ボディ、`text` フィールド欠落、不正 JSON、不正 Content-Type、不正 config |
| 404 | `/convert` 以外のパス |
| 405 | POST 以外のメソッド |

## デフォルト絵文字一覧

全24種の CustomEmoji がデフォルトで内蔵されています。

`[wow]` `[laugh]` `[thanks]` `[laughcry]` `[thumb]` `[hi]` `[heart]` `[congrat]` `[rockyserious]` `[rockyloveit]` `[rockyproud]` `[rockycool]` `[rosiedislike]` `[rosieawkward]` `[rosiekisskiss]` `[rosiecute]` `[jolliekissingface]` `[jolliewow]` `[jolliespeechless]` `[jolliesatisfied]` `[sagethink]` `[sagefulfilled]` `[sageclever]` `[sagemoney]`

## 開発

```bash
pnpm install
pnpm test        # テスト実行
pnpm build       # ESM + CJS ビルド
pnpm typecheck   # 型チェック
```

## ライセンス

ISC
