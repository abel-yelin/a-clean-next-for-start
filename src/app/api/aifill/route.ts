import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fetch from 'node-fetch'; // 确保安装了node-fetch

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { reference, referenceType, fieldsToGenerate, images } = await request.json();

    // 如果参考是网址，先抓取内容
    let referenceContent = reference;
    if (referenceType === 'url') {
      const response = await fetch(`${process.env.BASE_URL}/api/webspider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: [reference] }), // 如果有多个网址，可以传递数组
      });

      if (response.ok) {
        const data = await response.json();
        referenceContent = data.contents.join('\n'); // 合并多个网址的内容
      } else {
        throw new Error('抓取网页内容失败');
      }
    }

    // 如果有图片，先分析图片内容
    if (images && images.length > 0) {
      const imageResponse = await fetch(`${process.env.BASE_URL}/api/checkpic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        referenceContent += '\n' + imageData.texts.join('\n'); // 将提取的文本添加到参考内容中
      } else {
        throw new Error('分析图片内容失败');
      }
    }

    const prompt = `根据以下参考资料,生成一篇地道英文的文章的结构化内容:
    ${referenceContent}
    
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
      model: "gpt-4",
    });

    const generatedContent = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('AI填充错误:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: '与AI服务通信时出错', details: error.message }, { status: 500 });
    } else if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'AI生成的内容格式不正确', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: '生成内容时发生未知错误' }, { status: 500 });
    }
  }
}
