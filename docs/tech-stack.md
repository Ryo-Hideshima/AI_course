# 技術構成

## フロントエンド
- 言語: TypeScript
- ライブラリ: React
- ビルドツール: Vite
- スタイリング: Tailwind CSS
- パッケージ管理: npm

## バックエンド
- 言語: Java
- フレームワーク: Spring Boot
- ビルドツール: Gradle
- API形式: REST API

## データベース
- PostgreSQL

## バージョン管理
- GitHub

## 全体構成

```mermaid
flowchart LR
    A[React + TypeScript (Vite)] -- REST API --> B[Spring Boot (Gradle)]
    B -- SQL --> C[(PostgreSQL)]
```
