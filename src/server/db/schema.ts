import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import type { InferModel } from 'drizzle-orm';

// 首先定义函数
const createContentsTable = () => {
  return pgTable('contents', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    url: text('url'),
    order: integer('order'),
    category: text('category'),
    previewImages: text('preview_images').array(),
    keywords: text('keywords'),
    description: text('description'),
    tags: text('tags'),
    sections: jsonb('sections'),
    language: text('language').notNull(),
    originalContentId: integer('original_content_id'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
};

// 然后使用函数创建表
export const contents = createContentsTable();

// 在表定义之后添加外键约束
// contents.originalContentId.references(() => contents.id);

// 如果需要，你可以定义这些类型
export type Content = InferModel<typeof contents>;
export type NewContent = InferModel<typeof contents, 'insert'>;