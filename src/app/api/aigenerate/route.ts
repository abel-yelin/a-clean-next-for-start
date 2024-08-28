import { NextResponse } from 'next/server';
import { db } from '@/server/db/db';
import { contents } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

interface ContentData {
  title: string;  // 将 title 设为必需字段
  subtitle?: string;
  url?: string;
  order?: number;
  category?: string;
  previewImages?: string[];
  keywords?: string;
  description?: string;
  tags?: string;
  sections?: any; // 或者使用更具体的类型
}

interface NewContent {
  title: string;  // 添加顶层的 title 字段
  translations: {
    [key: string]: ContentData;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'en';

  try {
    const result = await db.select().from(contents).where(eq(contents.language, language));
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch contents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newContent: NewContent = await request.json();
    console.log('Received content:', newContent);

    // 检查 title 是否存在且不为空
    if (!newContent.title || newContent.title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // 插入英文内容
    const [englishResult] = await db.insert(contents).values({
      title: newContent.title,
      subtitle: newContent.translations.en?.subtitle || null,
      url: newContent.translations.en?.url || null,
      order: newContent.translations.en?.order || null,
      category: newContent.translations.en?.category || null,
      previewImages: newContent.translations.en?.previewImages || [],
      keywords: newContent.translations.en?.keywords || null,
      description: newContent.translations.en?.description || null,
      tags: newContent.translations.en?.tags || null,
      sections: newContent.translations.en?.sections || null,
      language: 'en'
    }).returning();

    // 插入其他语言的内容
    const otherLanguagesResults = await Promise.all(
      Object.entries(newContent.translations).map(async ([lang, content]) => {
        if (lang === 'en') return null;
        const [result] = await db.insert(contents).values({
          title: content.title,
          subtitle: content.subtitle || null,
          url: content.url || null,
          order: content.order || null,
          category: content.category || null,
          previewImages: content.previewImages || [],
          keywords: content.keywords || null,
          description: content.description || null,
          tags: content.tags || null,
          sections: content.sections || null,
          language: lang,
          originalContentId: englishResult.id
        }).returning();
        return result;
      })
    );

    return NextResponse.json({
      english: englishResult,
      translations: otherLanguagesResults.filter(Boolean)
    });

  } catch (error) {
    console.error('POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create content', details: errorMessage }, { status: 500 });
  }
}

// 添加其他需要的方法 (PUT, DELETE 等)