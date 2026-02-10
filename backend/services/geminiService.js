import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI (will be configured with key from env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateHabitInsights = async (habits, userName) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set');
      return getFallbackInsights(habits);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare data for the prompt
    const habitSummary = habits.map(h => {
      const completionCount = h.tracking.filter(t => t.completed).length;
      return `- ${h.name} (${h.icon}): Completed ${completionCount} times`;
    }).join('\n');

    const prompt = `
      Act as an encouraging and wise habit coach.
      User: ${userName || 'Friend'}
      
      Here is the user's habit data:
      ${habitSummary}

      Please provide:
      1. A short, specific observation about their patterns (e.g., "You're crushing it with X but struggling with Y").
      2. One actionable tip to improve consistency.
      3. A short motivational quote tailored to their situation.

      Keep the tone friendly, gamified, and concise (max 150 words). 
      Format the response in PURE JSON with keys: "observation", "tip", "quote".
      Do not include markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up text if it contains markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return getFallbackInsights(habits);
  }
};

const getFallbackInsights = (habits) => {
  return {
    observation: `You're tracking ${habits.length} habits. Keep going!`,
    tip: "Consistency is key. Try to do your habits at the same time every day.",
    quote: "Every action you take is a vote for the type of person you wish to become."
  };
};
