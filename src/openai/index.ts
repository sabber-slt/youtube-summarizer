import { ReadStream } from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt =
  "Please provide a long summary of the given text in Persian language.";

export const openaiHandler = async (text: string) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
      model: "gpt-3.5-turbo",
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    return error;
  }
};

export const whisprHandler = async (file: ReadStream) => {
  try {
    const chatCompletion = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
      prompt: "Specify punctuation marks for transcribing the audio file.",
      language: "fa",
    });

    return chatCompletion.text;
  } catch (error) {
    console.error("Error in whisprHandler:", error);
    throw error;
  }
};
