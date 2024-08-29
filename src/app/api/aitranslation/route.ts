import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content, targetLanguages } = await request.json();

    const translations = await Promise.all(
      targetLanguages.map(async (lang) => {
        const prompt = `Translate the following English content to ${lang}:\n\n${JSON.stringify(content)}`;
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
        });
        const translatedContent = JSON.parse(completion.choices[0].message.content || '{}');
        return { [lang]: translatedContent };
      })
    );

    const result = Object.assign({}, ...translations);
    return NextResponse.json(result);
  } catch (error) {
    console.error('翻译错误:', error);
    return NextResponse.json({ error: '翻译失败' }, { status: 500 });
  }
}
