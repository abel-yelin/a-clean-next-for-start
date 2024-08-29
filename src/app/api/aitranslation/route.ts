import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 辅助函数：尝试解析JSON，如果失败则返回null
function tryParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON解析失败:', e);
    return null;
  }
}

// 辅助函数：清理和格式化AI生成的文本
function cleanAIResponse(text: string): string {
  // 移除可能的前缀和后缀
  text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  // 替换不正确的引号
  text = text.replace(/[""]/g, '"');
  // 移除可能的额外空白字符
  return text.trim();
}

export async function POST(request: Request) {
  try {
    const { content, targetLanguages }: { content: any, targetLanguages: string[] } = await request.json();

    const translations = await Promise.all(
      targetLanguages.map(async (lang: string) => {
        const prompt = `Translate the following English content to ${lang}. Return only the translated JSON without any additional text or formatting:

${JSON.stringify(content)}`;

        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
        });

        const aiResponse = completion.choices[0].message.content || '{}';
        const cleanedResponse = cleanAIResponse(aiResponse);
        const translatedContent = tryParseJSON(cleanedResponse);

        if (!translatedContent) {
          console.error(`无法解析 ${lang} 的翻译内容:`, cleanedResponse);
          return { [lang]: content }; // 如果解析失败，返回原始内容
        }

        return { [lang]: translatedContent };
      })
    );

    const result = Object.assign({}, ...translations);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('翻译错误:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: '翻译失败', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: '翻译失败', details: '未知错误' }, { status: 500 });
    }
  }
}
