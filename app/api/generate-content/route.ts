import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI only if API key is available
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('OpenAI API key is not configured. Content generation will not be available.');
}

const CONTENT_PROMPTS = {
  blog: `You are a professional content writer for Leadership C.O.N.N.E.C.T.I.O.N.S., a youth development organization. 
  
  Create engaging, well-structured HTML blog content based on the following summary. The content should:
  - Be 500-800 words
  - Use proper HTML tags with Tailwind CSS classes (text-primary-600, mb-6, text-body-color, etc.)
  - Include 3-5 sections with <h3 class="mb-4 text-xl font-bold text-primary-600 sm:text-2xl"> headings
  - Use <p class="mb-6 text-base leading-relaxed text-body-color"> for paragraphs
  - Be inspiring and educational
  - Focus on youth empowerment and community impact
  
  Summary: {summary}
  
  Return ONLY the HTML content, no explanations or markdown code blocks.`,
  
  event: `You are writing about a past event for Leadership C.O.N.N.E.C.T.I.O.N.S., a youth development organization.
  
  Create detailed HTML content about this event. Include:
  - Event overview and objectives
  - Key activities and highlights
  - Student experiences and learning outcomes
  - Community impact
  - Use <h3 class="mb-4 text-xl font-bold text-primary-600 sm:text-2xl"> for headings
  - Use <p class="mb-6 text-base leading-relaxed text-body-color"> for paragraphs
  - Use proper HTML structure with Tailwind classes
  
  Summary: {summary}
  
  Return ONLY the HTML content, no explanations or markdown code blocks.`,
  
  class: `You are describing a class or workshop for Leadership C.O.N.N.E.C.T.I.O.N.S., a youth development organization.
  
  Create comprehensive HTML content including:
  - Class description and goals
  - Skills learned
  - Teaching methods
  - Student outcomes
  - Use <h3 class="mb-4 text-xl font-bold text-primary-600 sm:text-2xl"> for headings
  - Use <p class="mb-6 text-base leading-relaxed text-body-color"> for paragraphs
  - Use proper HTML structure with Tailwind classes
  
  Summary: {summary}
  
  Return ONLY the HTML content, no explanations or markdown code blocks.`
};

export async function POST(request: NextRequest) {
  try {
    const { summary, contentType } = await request.json();

    if (!summary || !contentType) {
      return NextResponse.json(
        { error: 'Summary and content type are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const prompt = CONTENT_PROMPTS[contentType as keyof typeof CONTENT_PROMPTS];
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid content type. Must be: blog, event, or class' },
        { status: 400 }
      );
    }

    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI is not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer specializing in youth development and education content. You write engaging, inspiring content that highlights the impact of educational programs on young people.'
        },
        {
          role: 'user',
          content: prompt.replace('{summary}', summary)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';

    // Clean up any markdown code blocks if present
    const cleanedContent = content
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return NextResponse.json({ content: cleanedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate content: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}
