import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import 'dotenv/config';
import { audioHandler } from './youtube/fetch_Subtitle';
import { openaiHandler } from './openai';

const bot = new Telegraf(`${process.env.TELEGRAM_API_KEY}`);
bot.use(session());
bot.launch();

bot.command('start', async (ctx) => {
  await ctx.reply(
    `Hi ${
      ctx.from.first_name || ''
    }, welcome to the bot!\n Please send me a youtube link to get started! 🎬`
  );
});

bot.on(message('text'), async (ctx) => {
  const { text } = ctx.message;

  const validate = text.match(
    /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/g
  );
  if (validate) {
    await ctx.reply('Please send me a youtube link');
    await ctx.reply('Fetching content...');
    await ctx.sendChatAction('typing');
    const subtitleContents = await audioHandler(text);
    await ctx.reply('Summarizing content...');
    await ctx.sendChatAction('typing');
    const aiResponse = await openaiHandler(subtitleContents);
    await ctx.reply(aiResponse);
  } else {
    await ctx.reply('Please send me a youtube link');
  }
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
