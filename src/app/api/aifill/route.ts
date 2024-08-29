import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { reference, referenceType, fieldsToGenerate } = await request.json();

    const prompt = `根据以下参考资料,生成一篇文章的结构化内容:
    ${reference}
    
    请只生成以下选中字段的JSON:
    {
      ${fieldsToGenerate.title ? '"title": "文章标题",' : ''}
      ${fieldsToGenerate.subtitle ? '"subtitle": "副标题",' : ''}
      ${fieldsToGenerate.description ? '"description": "文章描述",' : ''}
      ${fieldsToGenerate.keywords ? '"keywords": "关键词1,关键词2,关键词3",' : ''}
      ${fieldsToGenerate.tags ? '"tags": "标签1,标签2,标签3",' : ''}
      ${fieldsToGenerate.sections ? '"sections": [{"title": "章节标题","content": ["段落1", "段落2"]}]' : ''}
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const generatedContent = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('AI填充错误:', error);
    return NextResponse.json({ error: '生成内容失败' }, { status: 500 });
  }
}
