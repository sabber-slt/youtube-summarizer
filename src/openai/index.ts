import OpenAI from 'openai';
import { Language } from '../utils/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const openaiHandler = async (text: string, language: Language) => {
  const prompt =
  `Please provide a long summary of the given text in ${language} language.`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: text }
      ],
      model: 'gpt-3.5-turbo'
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    return error;
  }
};
