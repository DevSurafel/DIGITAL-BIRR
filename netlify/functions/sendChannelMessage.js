const { Telegraf } = require("telegraf");

// Replace with your bot token
const bot = new Telegraf(process.env.REACT_APP_BOT_TOKEN);

// Replace with your channel ID (e.g., @your_channel_name or channel ID)
const channelId = "-1001379581156";

// Message you want to send
const message = "Hello, this is a test message to the channel!";

exports.handler = async (event, context) => {
  try {
    await bot.telegram.sendMessage(channelId, message, { parse_mode: 'Markdown' });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send message" }),
    };
  }
};
