import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(request: Request) {
  try {
    const { images } = await request.json(); // 接收图片的URL或Base64编码

    const extractedTexts = await Promise.all(images.map(async (image: string) => {
      const { data: { text } } = await Tesseract.recognize(
        image,
        'eng', // 语言设置为英语，可以根据需要更改
        {
          logger: info => console.log(info) // 可选: 日志信息
        }
      );
      return text.trim();
    }));

    return NextResponse.json({ texts: extractedTexts });
  } catch (error) {
    console.error('图片分析错误:', error);
    return NextResponse.json({ error: '图片分析失败' }, { status: 500 });
  }
}
