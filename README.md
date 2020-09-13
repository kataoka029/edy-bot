edy-bot は、渋谷にある貸衣装店 Empty Dressy の管理システムとして開発中のアプリケーションのサーバーサイドです。

## 📝 API

## 💡 技術

- Express
- Node.js
- PostgreSQL
- Stripe
- WebSocket

## 📁 フォルダ構成

```
├── README.md
├── bot
│   ├── index.js
│   └── logic
│       └── index.js
├── config.js
├── db
│   ├── index.js
│   ├── migrations
│   │   ├── 20200522234114_create_messages_table.js
│   │   ├── 20200623125514_create_users_table.js
│   │   └── 20200730223613_create_orders_table.js
│   └── seeds
│       ├── seed_messages.js
│       ├── seed_orders.js
│       └── seed_users.js
├── knexfile.js
├── node_modules
├── package.json
├── public
│   └── index.html
├── routers
│   ├── api
│   │   ├── index.js
│   │   ├── messages
│   │   │   └── index.js
│   │   ├── orders
│   │   │   └── index.js
│   │   └── users
│   │       └── index.js
│   ├── index.js
│   ├── payment
│   │   └── index.js
│   └── webhook
│       └── index.js
├── server.js
├── tests
│   └── api_messages.test.js
└── yarn.lock
```

## 🖥 クライアントサイド

https://github.com/kataoka029/edy-manager
