import { Markup, Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import 'dotenv/config';
import { audioHandler } from './youtube/fetch_Subtitle';
import { openaiHandler } from './openai';
import { isYouTubeLikeValid } from './utils/validate_yt_link';
import { Language, MyContext } from './utils/types';

const bot = new Telegraf<MyContext>(`${process.env.TELEGRAM_API_KEY}`);
bot.use(session());
bot.launch();

bot.command('start', async (ctx) => {
  await ctx.reply(
    `Hi ${
      ctx.from.first_name || ''
    }, welcome to the bot!\n Please send me a YouTube link to get started! 🎬`
  );

});

bot.on(message('text'), async (ctx) => {
  const { text } = ctx.message;

  if (!isYouTubeLikeValid(text)) {
    await ctx.reply('The link that you provided is not valid! Please provide a valide YouTube link.');
    return;
  }

  ctx.session = { youtubeLink: text };

  await ctx.reply('Choose the language you want to get the summarization in', Markup.inlineKeyboard([
    Markup.button.callback('English', Language.english),
    Markup.button.callback('Persian', Language.persian)
  ]));
});

bot.action(Language.english, async (ctx) => {
  await summarize(ctx, Language.english);
});

bot.action(Language.persian, async (ctx, next) => {
  await summarize(ctx, Language.persian);
});

async function summarize(ctx: MyContext, language: Language) {
  const message = await ctx.reply('Fetching content...');
  await ctx.sendChatAction('typing');
  const subtitleContents = await audioHandler(ctx.session.youtubeLink);
  await editMessage(message.chat.id, message.message_id, 'Summarizing content...');
  await ctx.sendChatAction('typing');
  const aiResponse = await openaiHandler(subtitleContents, language);
  await editMessage(message.chat.id, message.message_id, aiResponse);
}

async function editMessage(chatId: number, messageId: number, text: string): Promise<void> {
  await bot.telegram.editMessageText(chatId, messageId, undefined, text);
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
