# デプロイメントガイド 🚀

このガイドでは、ワークアウトマネージャーを各種プラットフォームにデプロイする方法を説明します。

## 📋 目次

1. [GitHub Pages（推奨）](#github-pages)
2. [Netlify](#netlify)
3. [Vercel](#vercel)
4. [その他の静的ホスティング](#その他の静的ホスティング)
5. [トラブルシューティング](#トラブルシューティング)

---

## GitHub Pages

### 前提条件

- GitHubアカウント
- リポジトリの作成権限

### 自動デプロイ（推奨）

このプロジェクトには GitHub Actions ワークフローが含まれており、`main` ブランチへのプッシュで自動的にデプロイされます。

#### ステップ 1: リポジトリの準備

```bash
# リポジトリを初期化（まだの場合）
cd workout-manager
git init

# GitHubに新しいリポジトリを作成してリモートを追加
git remote add origin https://github.com/YOUR_USERNAME/workout-manager.git

# ファイルをコミット
git add .
git commit -m "Initial commit: Notion-style Workout Manager"
git branch -M main
git push -u origin main
```

#### ステップ 2: GitHub Pages の設定

1. GitHubのリポジトリページに移動
2. **Settings** → **Pages** に移動
3. **Source** で **GitHub Actions** を選択
4. 保存

#### ステップ 3: デプロイの確認

1. **Actions** タブに移動
2. ワークフローが実行されていることを確認
3. 完了後、`https://YOUR_USERNAME.github.io/workout-manager/` でアクセス可能

### 手動デプロイ

自動デプロイを使用しない場合：

```bash
# ビルド
cd app
npm run build

# gh-pages ブランチにデプロイ
npm install -g gh-pages
gh-pages -d dist
```

---

## Netlify

### 方法 1: Git連携（推奨）

#### ステップ 1: Netlifyにサインアップ

1. [Netlify](https://netlify.com) にアクセス
2. GitHubアカウントでサインアップ

#### ステップ 2: 新規サイト作成

1. **Add new site** → **Import an existing project** をクリック
2. GitHubを選択してリポジトリを接続
3. ビルド設定:
   ```
   Base directory: app
   Build command: npm run build
   Publish directory: app/dist
   ```
4. **Deploy site** をクリック

#### ステップ 3: カスタムドメイン（オプション）

1. **Domain settings** に移動
2. カスタムドメインを追加

### 方法 2: Netlify CLI

```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# ログイン
netlify login

# ビルド
cd app
npm run build

# デプロイ
netlify deploy --prod --dir=dist
```

---

## Vercel

### 方法 1: Git連携

#### ステップ 1: Vercelにサインアップ

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでサインアップ

#### ステップ 2: プロジェクトをインポート

1. **Add New** → **Project** をクリック
2. GitHubリポジトリを選択
3. 設定:
   ```
   Framework Preset: Vite
   Root Directory: app
   Build Command: npm run build
   Output Directory: dist
   ```
4. **Deploy** をクリック

### 方法 2: Vercel CLI

```bash
# Vercel CLIをインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ
cd app
vercel --prod
```

---

## その他の静的ホスティング

### Cloudflare Pages

```bash
# Cloudflare Pages CLIをインストール
npm install -g wrangler

# ログイン
wrangler login

# プロジェクトを作成
wrangler pages project create workout-manager

# ビルド & デプロイ
cd app
npm run build
wrangler pages deploy dist
```

### Firebase Hosting

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# ログイン
firebase login

# 初期化
firebase init hosting

# ビルド
cd app
npm run build

# デプロイ
firebase deploy --only hosting
```

### AWS S3 + CloudFront

```bash
# AWS CLIをインストールして設定
aws configure

# ビルド
cd app
npm run build

# S3バケットを作成
aws s3 mb s3://workout-manager-app

# ビルドファイルをアップロード
aws s3 sync dist/ s3://workout-manager-app --delete

# バケットを公開設定
aws s3 website s3://workout-manager-app \
  --index-document index.html \
  --error-document index.html
```

---

## 環境変数の設定

将来的にGemini APIなどの外部サービスを使用する場合：

### GitHub Pages

GitHub Secretsを使用:

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリック
3. 名前: `VITE_GEMINI_API_KEY`
4. 値: APIキー

ワークフローファイルで使用:

```yaml
- name: Build
  working-directory: ./app
  env:
    VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
  run: npm run build
```

### Netlify / Vercel

1. プロジェクト設定に移動
2. **Environment Variables** を追加
3. `VITE_GEMINI_API_KEY` = APIキー

---

## カスタムドメインの設定

### GitHub Pages

1. **Settings** → **Pages**
2. **Custom domain** にドメインを入力
3. DNSレコードを設定:
   ```
   Type: CNAME
   Name: www (または @)
   Value: YOUR_USERNAME.github.io
   ```

### Netlify

1. **Domain settings** → **Add custom domain**
2. Netlifyが自動的にDNS設定を提案

### Vercel

1. **Settings** → **Domains**
2. ドメインを追加
3. DNS設定を更新

---

## HTTPS/SSL証明書

すべての推奨プラットフォームは、無料の SSL 証明書を自動的に提供します：

- **GitHub Pages**: Let's Encrypt（自動）
- **Netlify**: Let's Encrypt（自動）
- **Vercel**: Let's Encrypt（自動）

---

## トラブルシューティング

### 問題: ビルドが失敗する

**解決策:**

```bash
# ローカルでビルドテスト
cd app
rm -rf node_modules package-lock.json
npm install
npm run build

# 成功したらコミット
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### 問題: GitHub Actions でキャッシュエラー

**解決策:**

`.github/workflows/deploy.yml` のキャッシュ設定を確認:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: app/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('app/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 問題: ページが表示されない（404エラー）

**原因:** SPA（Single Page Application）のルーティング問題

**GitHub Pages の解決策:**

`app/public` に `404.html` を作成:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Workout Manager</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'">
  </head>
  <body></body>
</html>
```

### 問題: ダークモードが保存されない

**原因:** ブラウザのプライベートモード

**解決策:** 通常モードで使用するか、セッションストレージに切り替え

### 問題: データが消える

**原因:** ブラウザのストレージ制限またはクリア

**解決策:**
1. 定期的にデータをエクスポート
2. ブラウザのストレージ設定を確認

---

## パフォーマンス最適化

### 画像の最適化

将来的に画像を追加する場合:

```bash
# 画像圧縮ツールをインストール
npm install -D vite-plugin-imagemin
```

### バンドルサイズの削減

```bash
# バンドル分析
npm install -D rollup-plugin-visualizer

# vite.config.js に追加
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    visualizer({ open: true })
  ]
});
```

### キャッシュ戦略

各プラットフォームの推奨設定:

```
Cache-Control: public, max-age=31536000, immutable (静的アセット)
Cache-Control: no-cache (index.html)
```

---

## モニタリングとアナリティクス

### Google Analytics（オプション）

```javascript
// app/index.html に追加
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics

```bash
npm install @vercel/analytics

# App.jsx に追加
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## セキュリティ

### Content Security Policy (CSP)

推奨ヘッダー:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;
```

### CORS設定

APIを使用する場合、適切なCORS設定を確認してください。

---

## バックアップ戦略

### 推奨事項

1. **定期的なGitコミット**: コードの変更を追跡
2. **ブランチ戦略**: `main` (本番), `develop` (開発)
3. **タグ付け**: リリースごとにバージョンタグを作成

```bash
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

---

## サポート

問題が発生した場合:

1. [Issues](https://github.com/YOUR_USERNAME/workout-manager/issues) で既存の問題を検索
2. 新しいissueを作成して詳細を報告
3. [Discussions](https://github.com/YOUR_USERNAME/workout-manager/discussions) でコミュニティに質問

---

## 次のステップ

デプロイが完了したら:

- [ ] カスタムドメインの設定
- [ ] アナリティクスの追加
- [ ] Gemini API の統合（QUICKSTART.mdの「AI統合」セクション参照）
- [ ] PWA化の検討

おめでとうございます！🎉 あなたのワークアウトマネージャーが稼働しました！
