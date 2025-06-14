# Love Editor

このプロジェクトは、テキストを編集して任意のデータ形式や画像に変換するためのツールです。

## 使用技術

- フロントエンド: React
- バンドラー: Vite
- 言語: TypeScript

## 主な機能

1. **テキスト編集**:
   - テキストを編集してキャンバスに表示。
   - キャンバスの背景は白色、文字色は黒色。
   - フォントサイズとキャンバスの高さを手動で調整可能。

2. **フォント選択**:
   - Google Fonts を使用して複数のフォントを選択可能。
   - 対応フォント: Arial, Noto Sans JP, Zen Maru Gothic, Zen Kaku Gothic, Kosugi Maru, Yusei Magic。

3. **データ保存**:
   - 編集内容をブラウザのローカルストレージに保存。
   - 再アクセス時にデータを復元。

4. **リセット機能**:
   - デフォルトデータに戻すリセットボタンを提供。

5. **エクスポート機能**:
   - キャンバスの内容を PNG 形式でダウンロード可能。

6. **コピー機能**:
   - 編集したテキストをクリップボードにコピー。
   - JSON 配列形式でコピー可能。

7. **ファイル読み込み**:
   - 改行区切りのテキストファイルをアップロードして編集可能。

8. **画像サイズプリセット**:
   - よく使われる画像サイズを選択可能。
   - プリセット例: Twitter広告投稿, YouTubeサムネイル, A4用紙など。

## 開発者向け情報

### ローカル開発

1. 必要な依存関係をインストール:

   ```bash
   npm install
   ```

2. 開発サーバーを起動:

   ```bash
   npm run dev
   ```

3. ブラウザで開いて動作を確認。

## ファイル構成

- `src/`: ソースコード
  - `EditLoveData.tsx`: メインの編集画面
  - `components/CanvasSettings.tsx`: キャンバス設定コンポーネント
  - `utils/showToast.ts`: トーストメッセージ表示用ユーティリティ
- `public/`: 公開用リソース
  - `split-love.json`: 初期データ
  - `heart-icon.svg`: サイトアイコン
- `data/`: データ関連
  - `furen-love.txt`: サンプルデータ
  - `original-love.txt`: 元データ
- `scripts/`: スクリプト
  - `splitLoveData.ts`: データ分割スクリプト
