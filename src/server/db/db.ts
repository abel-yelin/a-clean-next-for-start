// 从 drizzle-orm/postgres-js 模块导入 drizzle 函数，用于创建数据库连接
import { drizzle } from 'drizzle-orm/postgres-js';
// 从 drizzle-orm/postgres-js/migrator 模块导入 migrate 函数，用于数据库迁移
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
// 导入 postgres 模块，用于创建 PostgreSQL 数据库连接
import postgres from 'postgres';
import * as schema from "./schema"

// // 用于数据库迁移的代码（目前被注释掉）
// // 创建一个用于迁移的数据库客户端连接
// const migrationClient = postgres("postgres://postgres:adminadmin@0.0.0.0:5432/db", { max: 1 });
// // 使用 migrate 函数执行数据库迁移
// migrate(drizzle(migrationClient), ...)

// 用于查询目的的数据库连接
// 创建一个用于查询的数据库客户端连接
const queryClient = postgres(
    "postgres://postgres:abc123456@localhost:5432/postgres"
);
// 使用 drizzle 函数创建一个数据库连接对象，并导出它
export const db = drizzle(queryClient,{schema});
