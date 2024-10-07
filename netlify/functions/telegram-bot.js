const { Telegraf, Markup } = require("telegraf");

// Constants for external links
const community_link = "https://t.me/+p9ThUnIaaV0wYzZk";

// Initialize the bot with the token from environment variables
const bot = new Telegraf(process.env.BOT_TOKEN);

// Handler for the /start command
bot.start(async (ctx) => {
  console.log('Start command received');
  const user = ctx.message.from;
  const userName = user.username ? `@${user.username}` : user.first_name;

  // Get bot information to construct the Mini App link
  const botInfo = await ctx.telegram.getMe();
  const miniAppLink = `https://t.me/${botInfo.username}/app`;
 
  console.log(`Sending welcome message to ${userName}`);
  return ctx.replyWithHTML(
    `Hey ${userName}, Welcome to <a href="${miniAppLink}">$BIRR</a>!\n` +
    `Start building your financial future today!`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("Start now!", miniAppLink)],
      [Markup.button.url("Join our Community", community_link)]
    ])
  );
});

// Netlify function handler
exports.handler = async (event) => {
  console.log('Received event:', event.httpMethod);
  
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    console.log('Parsing update:', event.body);
    const update = JSON.parse(event.body);
    console.log('Handling update');
    await bot.handleUpdate(update);
    console.log('Update handled successfully');
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('Error in handler:', e);
    return { statusCode: 400, body: `Bad Request: ${e.message}` };
  }
};

// Note: Webhook setup should be done separately, not in this function.
// Use this command in your local environment or a separate setup script:
// bot.telegram.setWebhook('https://your-netlify-site.netlify.app/.netlify/functions/telegram-bot');
