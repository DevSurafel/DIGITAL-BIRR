](https://t.me/+p9ThUnIaaV0wYzZk)!*  

Start building your financial future today!, { 
    reply_markup: { 
      inline_keyboard: [ 
        [{ text: "👋 Start now!", web_app: { url: urlSent } }], 
        [{ text: "Join our Community", url: community_link }] 
      ] 
    } 
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
    console.error('error in handler:', e); 
    return { statusCode: 400, body: 'Bad Request: ' + e.message }; 
  } 
};
