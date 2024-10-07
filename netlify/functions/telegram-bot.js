const { Telegraf } = require("telegraf");

const web_link = "https://digital-birr.netlify.app/";
const community_link = "https://t.me/+p9ThUnIaaV0wYzZk";

const bot = new Telegraf(process.env.BOT_TOKEN);

const welcomeMessage = (user) => {
  const userName = user.username ? `@${user.username}` : user.first_name;
  return `Hey ${userName}, Welcome to [$BIRR](${community_link})!\n\n` +
    "Start building your financial future today!\n\n" +
    "Invite your friends to join the fun and watch your rewards multiply as you rise to the top together!";
};

const createReplyMarkup = (startPayload) => {
  const urlSent = `${web_link}?start=${startPayload}`;
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Start now!", web_app: { url: urlSent } }],
        [{ text: "Join our Community", url: community_link }]
      ]
    }
  };
};

// Respond to /start command
bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const user = ctx.message.from;
  return ctx.replyWithMarkdown(welcomeMessage(user), { 
    disable_web_page_preview: true,  // Disable link preview
    ...createReplyMarkup(startPayload) 
  });
});

// Respond to any message sent to the bot
bot.on('message', (ctx) => {
  const startPayload = ctx.startPayload || ''; // You can customize this if needed
  const user = ctx.message.from;
  return ctx.replyWithMarkdown(welcomeMessage(user), { 
    disable_web_page_preview: true,  // Disable link preview
    ...createReplyMarkup(startPayload) 
  });
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('Error in handler:', e);
    return { statusCode: 400, body: `Bad Request: ${e.message}` };
  }
};
