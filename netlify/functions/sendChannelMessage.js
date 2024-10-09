const { Telegraf } = require("telegraf");

const web_link = "https://digital-birr.netlify.app/";
const community_link = "https://t.me/+p9ThUnIaaV0wYzZk";

const bot = new Telegraf(process.env.REACT_APP_BOT_TOKEN);

// Updated message with two lines
const message = "Hello, this is a test message to the channel with an inline button!\n\n" +
                "We hope you find our services beneficial!";

const createReplyMarkup = (startPayload = '') => {
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

bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const user = ctx.message.from;
  return ctx.replyWithMarkdown(welcomeMessage(user), { 
    disable_web_page_preview: true,  // Disable link preview
    ...createReplyMarkup(startPayload) 
  });
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Sending the message to the channel with the inline button
    await bot.telegram.sendMessage("-1001379581156", message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      ...createReplyMarkup()
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending message:", error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send message", details: error.message }),
    };
  }
};
