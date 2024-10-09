const { Telegraf } = require("telegraf");

const web_link = "https://digital-birr.netlify.app/";
const community_link = "https://t.me/+p9ThUnIaaV0wYzZk";

const bot = new Telegraf(process.env.REACT_APP_BOT_TOKEN);

// Updated message with two lines
const message = "Hello, this is a test message to the channel with an inline button!\n\n" +
                "We hope you find our services beneficial!";

const createReplyMarkup = () => {
  const urlSent = `${web_link}?start=`; // You can customize this if needed
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Start now!", web_app: { url: urlSent } }]
      ]
    }
  };
};

exports.handler = async (event, context) => {
  try {
    await bot.telegram.sendMessage("-1001379581156", message, {
      parse_mode: 'Markdown', // Ensure you are using Markdown correctly
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
      body: JSON.stringify({ error: "Failed to send message", details: error.message }), // Include error message
    };
  }
};
