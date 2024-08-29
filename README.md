This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
## 安装了 UI
npx shadcn-ui@latest init
## 安装orm并连接
pnpm add drizzle-orm
## 安装drizzle-kit
pnpm add drizzle-kit -d
## 安装配置文件，在根目录新建 drizzle.config.ts
   import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    host:'localhost',
      port:5432,
      user:'postgres',
      password:'abc123456',
      database:"postgres",
      ssl: false
  },
  verbose: true,
  strict: true,
})
##  npm add pg -d
   安装驱动db，
##   npx drizzle-kit push
    这时候已经连接上数据库，但是需要创建表，
##  npx drizzle-kit studio
    启动GUI  npx drizzle-kit studio
## 安装npm install postgres 
    创建db对象，给其他人调用

##  0828 完成了参考输入框和预览的规划
我们需要在语言列表中添加韩语和俄语

## 设计登录 next-auth
## zod提供用户数据校验的工作的
## 
