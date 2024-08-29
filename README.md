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
##  0829 完成了对于AI一键生成内容，和AI一键多国语言的翻译解决完事

##  待完成的项目：这些多语言能在各方面，得到前端显示和切换多语言，其实就是怎么从前端获取数据，然后，这个后台只有admin可以进入，需要做认证登录，admin的认证登录，只能是密码登录
##  还需要优化AI对于图片的识别和读取，以及PDF的读取识别
##  还有对于S3的存储，然后返回链接，让AI直接读取链接，这个是不是一个比较好的方案
##  还需要优化关键词，让生成的文章更加精准
##![alt text](public\image.png)
##  现在出现的问题：就是韩语和越南语会出现问题，偶尔会出现文章翻译之后无法正常填入表单



![alt text](public\image02.png)
## 设计登录 next-auth
## zod提供用户数据校验的工作的
## 
