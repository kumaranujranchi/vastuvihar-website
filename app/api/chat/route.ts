import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Knowledge base snippets for quick contextual answers about Vastu Vihar
const VASTU_VIHAR_KNOWLEDGE = `
Vastu Vihar is Eastern India's largest real estate builder with over 45+ projects across Bihar, Jharkhand, West Bengal, Odisha, and Uttar Pradesh.
Key offerings:
- Affordable 2 BHK / 3 BHK Flats (₹10 - 24 Lac)
- Simplex & Row Houses (₹20 - 35 Lac)
- Premium Duplex Bungalows (₹35 - 50 Lac)
- Luxury Bungalows & Hybrid Homes (₹50 - 95 Lac)
- CEO Villas (₹1.20 - 1.80 Cr)
Helpline: +91-95340-95340
Locations: Patna, Ranchi, Varanasi, Bhubaneswar, Jamshedpur, Gaya, Muzaffarpur, Dhanbad, Siliguri, Asansol, and more.
`;

export async function POST(request: Request) {
  try {
    const { message, sessionId: providedSessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid message is required.' },
        { status: 400 }
      );
    }

    // Get or create session
    let session = providedSessionId
      ? await prisma.chatSession.findUnique({ where: { id: providedSessionId } })
      : null;

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          title: message.slice(0, 40) + '...',
        },
      });
    }

    // Record user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message.trim(),
      },
    });

    let botResponse = '';

    // Check if an AI provider API key is provided in environment
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are the friendly, helpful AI virtual assistant for Vastu Vihar (Eastern India's leading housing & infrastructure developer). Answer the user's question politely and accurately in their language (Hindi, English, or Hinglish).
                      
Company Info:
${VASTU_VIHAR_KNOWLEDGE}

User message: ${message}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          botResponse =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (err) {
        console.error('Gemini API call failed, falling back to smart responder:', err);
      }
    }

    // Smart default response if no external API key is configured yet
    if (!botResponse) {
      const lower = message.toLowerCase();
      if (lower.includes('price') || lower.includes('budget') || lower.includes('rate') || lower.includes('cost')) {
        botResponse =
          'Vastu Vihar offers homes ranging from ₹10 Lac for 2 BHK flats up to ₹1.80 Cr for CEO Villas. Would you like a price list for a specific city like Patna, Ranchi, or Varanasi?';
      } else if (lower.includes('city') || lower.includes('location') || lower.includes('project') || lower.includes('kahan')) {
        botResponse =
          'We have active township projects in 45+ cities across Bihar, Jharkhand, Odisha, West Bengal, and UP (including Patna, Ranchi, Jamshedpur, Varanasi, Bhubaneswar, etc.). Which city are you looking to buy a home in?';
      } else if (lower.includes('job') || lower.includes('career') || lower.includes('vacancy')) {
        botResponse =
          'You can explore our current job openings and apply directly on our Careers page (/careers). You can also upload your resume there!';
      } else if (lower.includes('contact') || lower.includes('number') || lower.includes('call') || lower.includes('phone')) {
        botResponse =
          'You can reach our centralized customer support helpline at +91-95340-95340 or leave your phone number here and our sales representative will call you.';
      } else {
        botResponse =
          'Namaste! Welcome to Vastu Vihar. I am your virtual assistant. How can I assist you with our residential projects, villas, flats, or career opportunities today?';
      }
    }

    // Save assistant message to DB
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: botResponse,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      response: botResponse,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { success: false, error: 'Chat service temporarily unavailable.' },
      { status: 500 }
    );
  }
}
