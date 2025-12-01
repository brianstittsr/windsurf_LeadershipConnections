import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }

    const { title, paragraph, date, location, tags } = await request.json();

    if (!title || !paragraph) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a comprehensive, engaging article about this past event from Leadership C.O.N.N.E.C.T.I.O.N.S.:

Title: ${title}
Description: ${paragraph}
Date: ${date || 'Not specified'}
Location: ${location || 'Not specified'}
Tags: ${tags?.join(', ') || 'None'}

Create a detailed HTML article with:
- A main h3 heading with the title
- Multiple sections with h4 headings (5-7 sections recommended)
- Rich, detailed paragraphs (3-5 sentences each) describing the event, its impact, and significance
- Use Tailwind CSS classes for styling
- Include sections about: program overview, activities, community impact, participant experiences, outcomes, and lasting legacy
- Make it inspirational, informative, and professional
- Use classes like: text-2xl, font-bold, mb-6, text-primary-600, dark:text-primary-400, text-xl, font-semibold, mb-4, text-base, leading-relaxed, text-body-color
- Wrap everything in a div with class="event-content"
- Add a highlighted callout box at the end with classes: mt-8, p-6, bg-primary, bg-opacity-10, rounded-lg
- The callout should have a bold title with class "text-base font-medium text-primary mb-2" and body text with class "text-base text-body-color"

Important:
- Write in past tense since this is a past event
- Be specific and detailed
- Highlight the educational and community impact
- Make it engaging and inspirational
- Return ONLY the HTML content, no markdown code blocks or extra formatting`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content writer creating engaging articles about educational and community programs. Write in an inspirational, informative tone that highlights the impact and significance of each event. Always return clean HTML without markdown code blocks.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate article from AI service' },
        { status: 500 }
      );
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate article' },
      { status: 500 }
    );
  }
}
