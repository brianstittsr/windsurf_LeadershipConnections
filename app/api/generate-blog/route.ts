import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { topic, tags } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  const prompt = `Write a blog post about "${topic}". The blog post should be engaging, informative, and well-structured. Include the following tags in the post: ${tags}.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const article = response.choices[0]?.message?.content;

    if (article) {
      return NextResponse.json({ article });
    } else {
      return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
