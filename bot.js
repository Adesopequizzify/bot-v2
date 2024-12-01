import TelegramBot from 'node-telegram-bot-api';

// Replace 'YOUR_BOT_TOKEN' with the token you get from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  // Define the inline keyboard
  const keyboard = {
    inline_keyboard: [
      [{ text: 'Start', url: 't.me/wheatsol_bot/app' }],
      [{ text: 'Join Community', url: 'https://t.me/swhit_tg' }]
    ]
  };

  try {
    await bot.sendPhoto(
      chatId,
      'https://raw.githubusercontent.com/Adesopequizzify/earn/refs/heads/main/nh/public/wheatsol.jpg',
      {
        caption: 'Your Time on Telegram is Valuable!\n\nEngage To Unlock Rewards, participate to unlock more $SWHIT 🌾',
        reply_markup: keyboard
      }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error processing your request.');
  }
});

// Error handling
bot.on('error', (error) => {
  console.error('Telegram bot error:', error);
});

// Log when bot is running
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');
