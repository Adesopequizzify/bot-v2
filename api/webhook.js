import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { body } = req;
    
    if (body.message && body.message.text === '/start') {
      const chatId = body.message.chat.id;
      
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
        res.status(200).json({ ok: true });
      } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Error sending message' });
      }
    } else {
      res.status(200).json({ ok: true });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
