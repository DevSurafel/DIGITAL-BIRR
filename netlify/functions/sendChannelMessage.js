const { broadcastMessage } = require('../src/msg/channelMessageSender.js');

exports.handler = async function (event, context) {
  // Call the function to send the message
  try {
    broadcastMessage();
    return {
      statusCode: 200,
      body: "Message sent successfully!"
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error sending message: ${error.message}`
    };
  }
};
