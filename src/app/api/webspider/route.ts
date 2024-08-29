import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    const fetchedContents = await Promise.all(urls.map(async (url: string) => {
      try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        // 提取网页的主要内容，这里可以根据需要调整选择器
        const mainContent = $('body').text(); // 你可以使用更具体的选择器来提取特定内容
        return mainContent.trim();
      } catch (fetchError) {
        console.error(`无法抓取 ${url}:`, fetchError);
        return null; // 返回null以便后续处理
      }
    }));

    // 过滤掉抓取失败的内容
    const validContents = fetchedContents.filter(content => content !== null);
    return NextResponse.json({ contents: validContents });
  } catch (error) {
    console.error('抓取错误:', error);
    return NextResponse.json({ error: '抓取网页内容失败' }, { status: 500 });
  }
}
