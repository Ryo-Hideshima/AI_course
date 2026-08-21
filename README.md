# タスク管理アプリ(Trello風ボード)

Trello風のシンプルなタスク管理アプリです。タスクをカードとして登録し、進捗状況(未着手/進行中/完了)ごとにボード上へ表示します。スクールの学習課題として、React + Spring Boot + PostgreSQLによる3層構成のWebアプリケーション開発を学ぶことを目的に作成しています。

## ドキュメント
- [要件定義書](requirements.md) — 概要・背景・目的・利用者
- [画面設計](docs/screen-design.md) — 画面構成・画面遷移
- [機能要件](docs/functional-requirements.md) — 機能一覧・カード項目定義・非機能要件
- [データベース設計](docs/database-design.md) — ER図・テーブル定義
- [技術構成](docs/tech-stack.md) — フロントエンド/バックエンド/DBの技術選定とバージョン

## 技術構成
| レイヤー | 技術 |
|---|---|
| フロントエンド | React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 |
| バックエンド | Java 21 + Spring Boot 4.1.0(Gradle) |
| データベース | PostgreSQL 16(Docker) |

詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照してください。

## ディレクトリ構成
```
.
├── requirements.md      # 要件定義書
├── docs/                # 画面設計・機能要件・DB設計・技術構成
├── docker-compose.yml   # PostgreSQL(開発用)
├── backend/             # Spring Boot(REST API)
├── frontend/            # React + Vite(SPA)
└── prototype/           # 実装前に作成したHTML/CSS/JSの画面モック
```

## 開発環境のセットアップと起動

### 前提
- Docker / Docker Compose
- Java 21
- Node.js(npm)

### 1. データベース(PostgreSQL)を起動
```bash
docker compose up -d
```

### 2. バックエンド(Spring Boot)を起動
```bash
cd backend
./gradlew bootRun
```
- 既定ポート: `8080`
- 起動時に `data.sql` でテストデータが自動投入されます
- ヘルスチェック: `curl http://localhost:8080/actuator/health`

### 3. フロントエンド(React)を起動
```bash
cd frontend
npm install
npm run dev
```
- 既定ポート: `5173`
- ブラウザで `http://localhost:5173` を開くとボード画面が表示されます

> サーバー起動時にポートが競合する場合の対処は `.claude/skills/server-startup/SKILL.md` を参照してください。既定ポート(8080/5173)を必ず使用する運用としています。

## 現在の実装状況
- バックエンド: タスクの全件取得・ステータス絞り込み検索(`GET /api/tasks`)、新規作成(`POST /api/tasks`)、編集(`PUT /api/tasks/{id}`)、列間移動・同一列内並び替え(`PUT /api/tasks/{id}/move`)、削除(`DELETE /api/tasks/{id}`、物理削除)を実装済み
- フロントエンド: ボード画面(未着手/進行中/完了)でタスクの表示・追加(モーダル)・編集(カードクリックで開くモーダル)・削除(確認アラート付き)・ドラッグ&ドロップ(列間移動・同一列内並び替え)がすべてバックエンドAPI経由で動作する
- 品質チェック: フロントエンドは `npm run lint`(oxlint)、バックエンドは `./gradlew spotlessCheck`(Spotless + Google Java Format)でコードスタイルを検証できる

## 開発ルール
Issue駆動開発・ブランチ運用・サーバー起動時のポートルールなどの開発ルールは [CLAUDE.md](CLAUDE.md) にまとめています。
