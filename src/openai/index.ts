import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const prompt =
  'Please provide a long summary of the given text in Persian language.';

export const openaiHandler = async (text: string) => {
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
