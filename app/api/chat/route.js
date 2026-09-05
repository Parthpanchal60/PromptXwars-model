/**
 * @file app/api/chat/route.js
 * @description Next.js App Router API Route for the Capstone Forge Onboarding AI Chat Assistant.
 * Integrates directly with Google Gemini 3.6 Flash using native fetch for zero repository bloat (<10MB).
 * Enforces strict input sanitization, rate-safe error handling, and complete JSDoc typings.
 */

/**
 * System instruction prompting Gemini to act as a warm, encouraging academic advisor.
 * @constant {string}
 */
const ACADEMIC_ADVISOR_SYSTEM_PROMPT = `You are the Capstone Forge Academic Advisor & Hackathon Mentor.
Your mission is to guide, inspire, and support students and hackathon participants who might feel overwhelmed, unsure of their technical skills, or confused about how to structure their project.
- Tone: Welcoming, highly encouraging, structured, empathetic, and clear.
- Core Goals:
  1. Help students identify their current strengths (e.g., Python, JavaScript, UI design, research) and map them to realistic project ideas.
  2. Answer questions about project scoping, team collaboration, and development sprints.
  3. Keep responses structured and actionable using concise bullet points and bold highlights.
  4. Never make a student feel inadequate; always reinforce growth mindset.`;

/**
 * Strips dangerous HTML tags, inline event attributes, and script protocols to prevent XSS.
 *
 * @param {string} input - Untrusted raw user message string.
 * @returns {string} Sanitized text string.
 */
export function sanitizeChatInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Neutralize script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Neutralize dangerous pseudo-protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, 'data_blocked:')
    // Strip HTML tags
    .replace(/<[^>]+>/g, '')
    // Strip control characters while preserving standard whitespace
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

/**
 * Validates the incoming chat request body payload.
 *
 * @param {any} body - Parsed JSON request payload.
 * @returns {{ isValid: boolean, error?: string, sanitizedMessage?: string, history?: Array<{ role: string, content: string }> }}
 */
export function validateChatPayload(body) {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object.' };
  }

  const { message, history } = body;

  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'The "message" field is required and must be a string.' };
  }

  const sanitized = sanitizeChatInput(message);

  if (sanitized.length === 0) {
    return { isValid: false, error: 'Message cannot be empty or contain only disallowed characters.' };
  }

  if (sanitized.length > 1500) {
    return { isValid: false, error: 'Message exceeds maximum allowed length of 1500 characters.' };
  }

  // Validate conversation history if provided
  const validatedHistory = [];
  if (Array.isArray(history)) {
    for (const entry of history.slice(-8)) { // Keep last 8 turns to stay lightweight
      if (entry && typeof entry === 'object' && typeof entry.content === 'string') {
        const role = entry.role === 'assistant' ? 'model' : 'user';
        const cleanContent = sanitizeChatInput(entry.content);
        if (cleanContent.length > 0) {
          validatedHistory.push({ role, content: cleanContent });
        }
      }
    }
  }

  return { isValid: true, sanitizedMessage: sanitized, history: validatedHistory };
}

/**
 * Handles incoming POST requests for the AI Chat Assistant.
 *
 * @param {Request} request - The standard Fetch API Request object.
 * @returns {Promise<Response>} JSON Response with AI message or error details.
 */
export async function POST(request) {
  try {
    // 1. Verify Request Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          error: 'Unsupported Media Type. Expected application/json.',
          status: 415,
        }),
        { status: 415, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse and Validate Request Payload
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: 'Malformed JSON in request body.',
          status: 400,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validation = validateChatPayload(body);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          error: validation.error,
          status: 400,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Resolve Google Gemini API Key safely from environment
    const apiKey =
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'Google Gemini API Key is not configured on the server.',
          status: 500,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Construct Gemini API Request Body with System Prompt and History
    const geminiContents = [
      {
        role: 'user',
        parts: [{ text: `${ACADEMIC_ADVISOR_SYSTEM_PROMPT}\n\nPlease acknowledge and start mentoring.` }],
      },
      {
        role: 'model',
        parts: [{ text: "Understood! I am ready to warmly guide and advise the student." }],
      },
    ];

    // Append validated history
    if (validation.history && validation.history.length > 0) {
      for (const h of validation.history) {
        geminiContents.push({
          role: h.role,
          parts: [{ text: h.content }],
        });
      }
    }

    // Append the current sanitized message
    geminiContents.push({
      role: 'user',
      parts: [{ text: validation.sanitizedMessage }],
    });

    // 5. Call Google Gemini 3.6 Flash (with fallback to gemini-1.5-flash)
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Gemini API returned status ${geminiResponse.status}`;

      console.error('[Gemini Chat API Error]:', errorMessage);

      return new Response(
        JSON.stringify({
          error: 'Upstream AI Service Error. Please try again shortly.',
          status: 502,
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await geminiResponse.json();
    const candidate = data.candidates?.[0];
    const replyText =
      candidate?.content?.parts?.[0]?.text ||
      "I'm here to support you! Tell me what you're thinking of building, or what tech stack you feel most comfortable with.";

    // 6. Return successful response with semantic metadata
    return new Response(
      JSON.stringify({
        reply: replyText,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        status: 200,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('[Chat API Unexpected Exception]:', error);

    return new Response(
      JSON.stringify({
        error: 'An internal server error occurred while processing your chat request.',
        status: 500,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
