# Keio Basketball Tech Web

大学バスケットボールチーム Keio Basketball Tech の GitHub Pages 用静的サイトです。団体紹介・スケジュール・試合結果・ニュース・FAQ・問い合わせページを提供します。

## 構成
- `index.html` … Home（ニュース/試合抜粋、SNS）
- `team.html` … 団体紹介
- `schedule.html` … 週間スケジュール、練習場所
- `games.html` / `game.html?slug=` … 試合一覧 + 詳細
- `news.html` / `news-article.html?slug=` … ニュース一覧 + 詳細
- `faq.html`, `contact.html`
- `assets/css/style.css` 共通デザイン
- `assets/js/main.js` ナビゲーション・データ描画
- `data/games.json`, `data/news.json`, `data/upcoming.json` 更新用データ

## データの更新方法
### 試合結果
1. `data/games.json` を開き、オブジェクトを1件追加します。
2. フィールド例:
   ```json
   {
     "date": "2025-02-15",
     "competition": "Spring League",
     "round": "Week 6",
     "opponent": "ABC University",
     "score_for": 77,
     "score_against": 70,
     "venue": "Shinagawa Arena",
     "slug": "2025-02-15-abc",
     "recap": "短い振り返り文",
     "media": {
       "highlight_url": "https://...",
       "photos_url": "https://..."
     }
   }
   ```
3. `slug` は `game.html?slug=...` のURLになるのでユニークにしてください。
4. 追加後 `git commit` → `git push` すると、Home（最新3件）と `games.html`、`game.html` に反映されます。

### ニュース
1. `data/news.json` に記事オブジェクトを追加。
2. フィールド:
   ```json
   {
     "date": "2025-02-01",
     "title": "タイトル",
     "tags": ["カテゴリ"],
     "excerpt": "一覧用の短文",
     "body": "本文",
     "slug": "2025-example"
   }
   ```
3. `slug` は `news-article.html?slug=` のURLになります。
4. 追加後 `git push` で Home と `news.html` に自動反映。

### 次戦（Upcoming Match）
1. `data/upcoming.json` の配列に、最も近い試合の日付が先頭になるよう追記します。
2. フィールド:
   ```json
   {
     "date": "2025-02-10",
     "time": "15:00",
     "competition": "春季リーグ 第2節",
     "opponent": "〇〇大学",
     "venue": "会場名",
     "note": "チケット・配信情報など任意"
   }
   ```
3. Home の「NEXT GAME」カードはこの JSON の先頭要素を参照します。古い試合は配列末尾から削除してください。

## ローカル確認
静的サイトなので以下で動作確認できます。
```bash
python3 -m http.server 4000
```
ブラウザで `http://localhost:4000/` を開いて各ページを確認してください。

## GitHub Pages
リポジトリ設定 → Pages にて `Deploy from a branch / main / /(root)` を選択。push のたびに自動デプロイされます。
