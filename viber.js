const ngrok = require('./get_public_url');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const bot = new ViberBot({
	authToken: '4e16ff4b2227e35c-9f9ebb9e2f153539-6821c89db50a662a',
	name: "Test",
	avatar: "https://freesvg.org/img/1538298822.png" // It is recommended to be 720x720, and no more than 100kb.
});

function answer(message,response){
    let msg=String(message.text)
    console.log(msg)
    if(/^hi|hello$/i.test(msg)==true){
        let respondMsg=new TextMessage('Hello there')
        response.send(respondMsg)
    }
}
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    if (!(message instanceof TextMessage)) {
        say(response, `Sorry. I can only understand text messages.`);
    }
});

bot.onTextMessage(/./, (message, response) => {
    // checkUrlAvailability(message.text,response);
  answer(message,response)
});

bot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));

 ngrok.getPublicUrl().then(publicUrl => {
        const http = require('http');
        const port = process.env.PORT || 3000;

        console.log('publicUrl => ', publicUrl);

        http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(publicUrl));

    }).catch(error => {
        console.log('Can not connect to ngrok server. Is it running?');
        console.error(error);
        process.exit(1);
    });