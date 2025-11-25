import { NextRequest, NextResponse } from 'next/server';
import { FormField } from '@/types/form';

// Check for available AI API keys
function getAvailableAIProvider(): { provider: string; apiKey: string } | null {
  // Check OpenAI
  if (process.env.OPENAI_API_KEY) {
    return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY };
  }
  
  // Check Anthropic Claude
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY };
  }
  
  // Check Google Gemini
  if (process.env.GOOGLE_AI_API_KEY) {
    return { provider: 'google', apiKey: process.env.GOOGLE_AI_API_KEY };
  }
  
  return null;
}

async function generateWithOpenAI(apiKey: string, prompt: string): Promise<any> {
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
          content: 'You are a form builder assistant. Generate form configurations in JSON format based on user descriptions. Always include tracking fields for device type, browser, location, timezone, and timestamp.',
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

async function generateWithAnthropic(apiKey: string, prompt: string): Promise<any> {
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
          content: `You are a form builder assistant. Generate form configurations in JSON format based on user descriptions. Always include tracking fields for device type, browser, location, timezone, and timestamp.\n\n${prompt}\n\nRespond with valid JSON only.`,
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

async function generateWithGoogle(apiKey: string, prompt: string): Promise<any> {
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
                text: `You are a form builder assistant. Generate form configurations in JSON format based on user descriptions. Always include tracking fields for device type, browser, location, timezone, and timestamp.\n\n${prompt}\n\nRespond with valid JSON only.`,
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
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
  return JSON.parse(jsonMatch ? jsonMatch[1] : text);
}

export async function POST(request: NextRequest) {
  try {
    const { description, purpose, outcomes } = await request.json();

    if (!description || !purpose || !outcomes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for available AI provider
    const aiProvider = getAvailableAIProvider();
    
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'No AI API key configured. Please set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_AI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Build the prompt
    const prompt = `
Generate a form configuration based on the following requirements:

FORM DESCRIPTION:
${description}

PURPOSE:
${purpose}

DESIRED OUTCOMES:
${outcomes}

Generate a JSON object with the following structure:
{
  "title": "Form title",
  "description": "Form description",
  "fields": [
    {
      "id": "unique-id",
      "label": "Field label",
      "type": "text|email|phone|textarea|number|date|select|radio|checkbox|file",
      "required": true|false,
      "placeholder": "Optional placeholder",
      "options": ["option1", "option2"] // Only for select, radio, checkbox
    }
  ]
}

IMPORTANT: 
- Create appropriate field types based on the data being collected
- Mark essential fields as required
- Include validation-friendly field types (email for emails, phone for phone numbers, etc.)
- Add helpful placeholder text
- For select/radio/checkbox fields, provide relevant options
- DO NOT include tracking fields in the visible form (device, browser, location, etc.) - these will be added automatically by the system
`;

    let formData;
    
    // Generate form using available provider
    switch (aiProvider.provider) {
      case 'openai':
        formData = await generateWithOpenAI(aiProvider.apiKey, prompt);
        break;
      case 'anthropic':
        formData = await generateWithAnthropic(aiProvider.apiKey, prompt);
        break;
      case 'google':
        formData = await generateWithGoogle(aiProvider.apiKey, prompt);
        break;
      default:
        throw new Error('Unknown AI provider');
    }

    // Validate and format the response
    if (!formData.title || !formData.fields || !Array.isArray(formData.fields)) {
      throw new Error('Invalid form data generated');
    }

    // Ensure all fields have proper IDs
    formData.fields = formData.fields.map((field: any, index: number) => ({
      ...field,
      id: field.id || `field-${Date.now()}-${index}`,
      order: index,
    }));

    return NextResponse.json(formData);
  } catch (error: any) {
    console.error('Error generating form:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate form' },
      { status: 500 }
    );
  }
}
