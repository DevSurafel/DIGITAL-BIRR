const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.REACT_APP_BOT_TOKEN); // Use your bot token here

// Channel ID or username
const channelId = "-1001379581156"; // Replace this with your Telegram channel's username or chat ID

// Function to send a message to the channel
const sendMessageToChannel = async (message) => {
  try {
    await bot.telegram.sendMessage(channelId, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: true, // Disable preview for links
    });
    console.log("Message sent to the channel successfully.");
  } catch (error) {
    console.error("Error sending message to the channel:", error);
  }
};

// Example usage to broadcast a message
const broadcastMessage = () => {
  const message = "🚀 Important Update!\n\n" +
    "Join our community and stay tuned for more updates.\n" +
    "[Click here to join the community](https://t.me/+p9ThUnIaaV0wYzZk)";

  sendMessageToChannel(message);
};

// Export the broadcast function for external triggers
module.exports = { broadcastMessage };
