![Node](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Maintenance](https://img.shields.io/badge/Maintained-yes-success)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)

![Stars](https://img.shields.io/github/stars/Takkunlego0916/Ticket-BOT?style=social)
![Forks](https://img.shields.io/github/forks/Takkunlego0916/Ticket-BOT?style=social)
![Issues](https://img.shields.io/github/issues/Takkunlego0916/Ticket-BOT)
![Last Commit](https://img.shields.io/github/last-commit/Takkunlego0916/Ticket-BOT)

# Discord Ticket Bot

カテゴリ別にチケットを作成できる Discord Bot です。  
HTMLログ保存対応済み

---

## 機能

- カテゴリ別チケット作成
- クローズ機能
- HTMLログ自動保存
- Closedカテゴリは再作成可能
- カテゴリが違えば複数同時作成可能

---

## 必要環境

- Node.js v20+
- npm
- Discord Bot Token

---

## セットアップ

### 1️⃣ インストール

```bash
npm install
```

### 2️⃣ 環境変数設定

.envの中の``` DISCORD BOT TOKEN ```をBOTのTokenに。

### 3️⃣ 起動

```bash
npm start
```

## カテゴリ構造

ボタンに応じて以下カテゴリへ作成：
 - BAN異議申し立て
 - プレイヤー通報
 - Discord内通報
 - バグ報告
 - 接続問題

クローズ後はClosedカテゴリーへ移動

## 必要なBOT権限

 - 管理者(推奨)
　　または
 - チャンネル管理
 - ロール管理
 - メッセージ管理
 - メッセージ履歴閲覧

BOTのロールはスタッフロールよりも上に配置してください

## コマンド

```
/ticketpanel
```

チケット作成パネルを表示します。

## ログ保存

チケットを閉じると：

 - HTML形式でログ生成
 - 指定ログチャンネルへ自動送信

## LICENSE

MIT LICENSE
