import TelegramBot from 'node-telegram-bot-api';

// Initialize bot with token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(200).json({ ok: true, message: 'Webhook is working' });
    return;
  }

  try {
    const { body } = req;
    
    // Handle /start command
    if (body.message && body.message.text === '/start') {
      const chatId = body.message.chat.id;
      
      const keyboard = {
        inline_keyboard: [
          [{ text: 'Start', url: 't.me/wheatsol_bot/app' }],
          [{ text: 'Join Community', url: 'https://t.me/swhit_tg' }]
        ]
      };

      await bot.sendPhoto(
        chatId,
        'https://raw.githubusercontent.com/Adesopequizzify/earn/refs/heads/main/nh/public/wheatsol.jpg',
        {
          caption: 'Your Time on Telegram is Valuable!\n\nEngage To Unlock Rewards, participate to unlock more $SWHIT 🌾',
          reply_markup: keyboard
        }
      );
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
}
