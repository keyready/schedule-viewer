const { Telegraf } = require('telegraf');
const { schedule } = require('node-cron');

const bot = new Telegraf('6948521745:AAFndHaNtRANJ82jrBxU2jzOzh4btw6EFEY');

bot.start(async (ctx) => {
   
});

async function every20Hour() {
    const groups = await GroupModel.findAll({
        raw: true,
    });

    groups.forEach(async (group) => {
        const schedule = getRectangleFromExcel(`../files/${group.group}.xlsx`, 'D6:W34');
        const tomorrow = filterDates(schedule);

        const sentMessage = await bot.telegram.sendMessage(
            group.chat_id,
            `Завтра ${new Date(tomorrow.date).toLocaleDateString('ru-RU')}\n\n
Расписание на завтра:\n${tomorrow.jobs.join('\n')}`,
        );

        const chatId = sentMessage.chat.id;

        await bot.telegram.pinChatMessage(chatId, sentMessage.message_id);
    });
}

schedule('0 20,21,22 * * *', every20Hour);

startBot();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
