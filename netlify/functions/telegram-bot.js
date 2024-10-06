const { Telegraf } = require("telegraf");

// Links
const web_link = "https://digital-birr.netlify.app/";
const community_link = "https://t.me/+p9ThUnIaaV0wYzZk";

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Start command with welcome message and inline buttons
bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const urlSent = ${web_link}?start=${startPayload};
  const user = ctx.message.from;
  const userName = user.username ? @${user.username} : user.first_name;

    return ctx.replyWithMarkdown(*Hey ${userName}, Welcome to [$BIRR](${urlSent}) 

Start building your financial future today!, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "👋 Start now!", web_app: { url: urlSent } }],
        [{ text: "Join our Community", url: community_link }]
      ]
    }
  });
});

// Netlify function handler
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('error in handler:', e);
    return { statusCode: 400, body: 'Bad Request: ' + e.message };
  }
};

// Set webhook (this should be done once, not in the function)
// Use this in your local environment or a separate setup script:
// bot.telegram.setWebhook(https://your-netlify-site.netlify.app/.netlify/functions/telegram-bot);
