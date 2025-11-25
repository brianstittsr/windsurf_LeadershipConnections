import { NextRequest, NextResponse } from 'next/server';

// Check for available AI API keys
function getAvailableAIProvider(): { provider: string; apiKey: string } | null {
  if (process.env.OPENAI_API_KEY) {
    return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY };
  }
  if (process.env.GOOGLE_AI_API_KEY) {
    return { provider: 'google', apiKey: process.env.GOOGLE_AI_API_KEY };
  }
  return null;
}

async function getRecommendationsFromOpenAI(apiKey: string, prompt: string): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert form design consultant specializing in data collection optimization. Provide recommendations in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function getRecommendationsFromAnthropic(apiKey: string, prompt: string): Promise<any> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nRespond with valid JSON only.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.content[0].text);
}

async function getRecommendationsFromGoogle(apiKey: string, prompt: string): Promise<any> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt}\n\nRespond with valid JSON only.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
  return JSON.parse(jsonMatch ? jsonMatch[1] : text);
}

export async function POST(request: NextRequest) {
  try {
    const { purpose, audience, goals } = await request.json();

    if (!purpose || !audience || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const aiProvider = getAvailableAIProvider();
    
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'No AI API key configured. Please set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_AI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const prompt = `
As a form design expert, analyze this form project and provide comprehensive recommendations:

FORM PURPOSE:
${purpose}

TARGET AUDIENCE:
${audience}

DATA GOALS:
${goals}

Provide recommendations in the following JSON structure:
{
  "suggestedQuestions": [
    "Question 1 that should be asked",
    "Question 2 that should be asked",
    "Question 3 that should be asked",
    "Question 4 that should be asked",
    "Question 5 that should be asked"
  ],
  "fieldTypes": [
    {
      "question": "Specific question text",
      "fieldType": "text|email|phone|textarea|number|date|select|radio|checkbox|file",
      "reasoning": "Why this field type is optimal for this question"
    }
  ],
  "bestPractices": [
    "Best practice recommendation 1",
    "Best practice recommendation 2",
    "Best practice recommendation 3",
    "Best practice recommendation 4"
  ],
  "dataCollectionTips": [
    "Tip for optimizing data collection 1",
    "Tip for optimizing data collection 2",
    "Tip for optimizing data collection 3",
    "Tip for optimizing data collection 4"
  ]
}

IMPORTANT GUIDELINES:
- Suggest 5-10 specific questions that align with the stated purpose and goals
- For each suggested question, recommend the most appropriate field type and explain why
- Include best practices for form design, user experience, and completion rates
- Provide actionable tips for maximizing data quality and response rates
- Consider the target audience when making recommendations
- Focus on questions that will yield measurable, actionable insights
- Recommend a mix of quantitative (ratings, multiple choice) and qualitative (open-ended) questions
- Suggest ways to reduce form abandonment and increase completion rates
`;

    let recommendations;
    
    switch (aiProvider.provider) {
      case 'openai':
        recommendations = await getRecommendationsFromOpenAI(aiProvider.apiKey, prompt);
        break;
      case 'anthropic':
        recommendations = await getRecommendationsFromAnthropic(aiProvider.apiKey, prompt);
        break;
      case 'google':
        recommendations = await getRecommendationsFromGoogle(aiProvider.apiKey, prompt);
        break;
      default:
        throw new Error('Unknown AI provider');
    }

    // Validate response structure
    if (!recommendations.suggestedQuestions || !recommendations.fieldTypes || 
        !recommendations.bestPractices || !recommendations.dataCollectionTips) {
      throw new Error('Invalid recommendations format');
    }

    return NextResponse.json(recommendations);
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
