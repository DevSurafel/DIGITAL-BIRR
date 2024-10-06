const { Telegraf } = require("telegraf"); 

// Links 
const web_link = "https://digital-birr.netlify.app/"; 
const community_link = "https://t.me/+p9ThUnIaaV0wYzZk"; 

// Initialize bot 
const bot = new Telegraf(process.env.BOT_TOKEN); 

// Start command with welcome message and inline buttons 
bot.start((ctx) => { 
  const startPayload = ctx.startPayload; 
  const urlSent = `${web_link}?start=${startPayload}`; // Use backticks for template literals
  const user = ctx.message.from; 
  const userName = user.username ? `@${user.username}` : user.first_name; // Use backticks for template literals
 
  return ctx.replyWithMarkdown(`*Hey ${userName}, Welcome to [**$BIRR**](https://t.me/+p9ThUnIaaV0wYzZk)!*  
Start building your financial future today!`, { // Use backticks for markdown text
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
    console.error('Error in handler:', e); // Improved error logging
    return { statusCode: 400, body: 'Bad Request: ' + e.message }; 
  } 
}; 

// Set webhook (this should be done once, not in the function) 
// Use this in your local environment or a separate setup script: 
// bot.telegram.setWebhook('https://your-netlify-site.netlify.app/.netlify/functions/telegram-bot');
