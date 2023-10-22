import { Telegraf, session } from "telegraf";
import { Context } from "telegraf";
import { message } from "telegraf/filters";
import { File } from "telegraf/typings/core/types/typegram";
import "dotenv/config";
import { openaiHandler, whisprHandler } from "./openai";
import { audioHandler } from "./youtube/fetch_Subtitle";
import fs from "fs";
import { ogg } from "./ogg";

const bot = new Telegraf(`${process.env.TELEGRAM_API_KEY}`);
bot.use(session());
bot.launch();

// Utility
bot.command("start", async (ctx) => {
  await ctx.reply(
    `Hi ${
      ctx.from.first_name || ""
    }, welcome to the bot!\n Please send me a youtube link to get started! 🎬`
  );
});

const isValidYoutubeLink = (text: string) =>
  /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/g.test(text);

// Text message handler functions

const handleYoutubeLink = async (ctx: Context, text: string) => {
  await ctx.reply("Fetching content...");
  await ctx.sendChatAction("typing");
  const subtitleContents = await audioHandler(text);
  await ctx.reply("Summarizing content...");
  await ctx.sendChatAction("typing");
  const aiResponse = await openaiHandler(subtitleContents);
  return aiResponse;
};

// Voice message handler functions
const processVoiceMessage = async (
  ctx: Context,
  voice: { file_id: string | File }
) => {
  const voiceLink = await ctx.telegram.getFileLink(voice.file_id);
  const oggPath: any = await ogg.create(
    voiceLink.href,
    String(ctx.message.from.id)
  );
  const mp3Path = await ogg.toMp3(oggPath, ctx.message.from.id);
  return whisprHandler(fs.createReadStream(mp3Path as string));
};

bot.on(message("text"), async (ctx) => {
  const { text } = ctx.message;

  if (isValidYoutubeLink(text)) {
    const aiResponse = await handleYoutubeLink(ctx, text);
    await ctx.reply(aiResponse);
  } else {
    await ctx.reply("Please send me a valid youtube link");
  }
});

bot.on("voice", async (ctx) => {
  const { voice } = ctx.message;

  try {
    const whisprResponse = await processVoiceMessage(ctx, voice);
    await ctx.reply(whisprResponse);
  } catch (error) {
    console.error("Error processing voice message:", error);
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
