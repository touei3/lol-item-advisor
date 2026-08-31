# デスクトップ版（Electron）

LoL の起動中に常時最前面ウィンドウとして動き、**チャンピオン選択では敵ピックへのカウンター**、
**試合中は次に買うべきアイテム**を自動表示します。

Web版（手動選択・GitHub Pages）と推奨エンジンを共有しています。

## 仕組み

| フェーズ | 使うAPI | 取得元 |
|---|---|---|
| チャンピオン選択 | **LCU API**（`lockfile` 認証, `127.0.0.1:<port>`） | `electron/main/lcu.ts` |
| 試合中 | **Live Client Data API**（`127.0.0.1:2999`） | `electron/main/liveclient.ts` |

- main プロセス（Node）がローカルAPIをポーリングし、状態を renderer（UI）へ IPC 送信
- renderer は Web版と同じ推奨エンジン（`src/recommend.ts` ほか）で計算して表示
- どちらも **自分のPC内で完結**（CORS・スクレイピング規約の問題なし）
- ゲーム画面へのオーバーレイ注入はしません（Vanguard対策・安全のため別ウィンドウ）

## 開発・実行

```bash
# 依存インストール（初回のみ）
npm install

# 開発（renderer=Vite dev + main/preload=esbuild watch + Electron起動）
npm run desktop:dev

# ビルドして起動
npm run desktop

# それぞれ個別に
npm run desktop:build      # main/preload + renderer をビルド → dist-electron/
npm run desktop:start      # ビルド済みを Electron で起動
```

### LoL 無しでUIを確認する（モック）
- アプリ右上の「モック」ボタンで、チャンピオン選択↔試合中のダミー表示を切替
- ブラウザだけで確認したい場合: `npm run desktop:build:renderer` 後、
  `electron/renderer/preview.html` を Vite dev で開くと idle/champselect/ingame を手動切替できる

## 実機テスト時の確認ポイント（要 LoL 起動）
以下はこちらでは検証できないため、実際のクライアントで確認してください：
1. `lockfile` のパス（既定 `C:/Riot Games/League of Legends/lockfile`）。違う場合は
   環境変数 `LOL_LOCKFILE` で上書き可能。
2. チャンピオン選択で敵の確定ピックが表示されるか（ドラフトのみ。ブラインドは試合開始まで不可）
3. 試合中に自分／敵が正しく識別されるか（Riot ID 対応のため `summonerName` 照合に注意）
4. 所持アイテムから「次の1手」が正しく出るか

## パッケージ化（配布用 .exe）※未実装
electron-builder を追加すればインストーラ生成が可能です（必要になったら対応）。
