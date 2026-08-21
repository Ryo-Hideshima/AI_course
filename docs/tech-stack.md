# 技術構成

## フロントエンド
- 言語: TypeScript(v6.0系)
- ライブラリ: React(v19系)
- ビルドツール: Vite(v8系)
- スタイリング: Tailwind CSS(v4系、`@tailwindcss/vite`)
- パッケージ管理: npm
- 開発サーバーポート: 5173(既定)

## バックエンド
- 言語: Java 21(LTS)
- フレームワーク: Spring Boot 4.1.0
- ビルドツール: Gradle(Gradle Wrapper、Gradle 9.5.1)
- API形式: REST API
- サーバーポート: 8080(既定)

## データベース
- PostgreSQL 16(Dockerコンテナで起動)

## バージョン管理
- GitHub

## 全体構成

```mermaid
flowchart LR
    A[React + TypeScript (Vite)] -- REST API --> B[Spring Boot (Gradle)]
    B -- SQL --> C[(PostgreSQL)]
```
