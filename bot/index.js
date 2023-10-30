const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const path = require('path');
const { schedule } = require('node-cron');
const DB = require('./config/db.connect');
const { GroupModel } = require('./models/group.model');

const { generateDocument, filterDates } = require('./utils');
const { getRectangleFromExcel } = require('../server/utils/parser');
const { PinnedModel } = require('./models/pinned.model');

const bot = new Telegraf('6948521745:AAFndHaNtRANJ82jrBxU2jzOzh4btw6EFEY');

const keywords = ['бот', 'ботяра', 'товарищБот'];
const commandsList = ['расписание', 'сделай рапорт на хак'];
const templates = [
    '\n - расписание для [номер группы, например, 611-11]',
    '\n - сделай рапорт на хак\n' +
        'Имена: через запятую участники\n' +
        'Старший: через запятую старшие\n' +
        'Время начала: строка вида чч:мм дд:мм:гггг\n' +
        'Время завершения: строка вида чч:мм дд:мм:гггг\n' +
        'Событие: название_события',
];

async function helpRouter(ctx, type) {
    switch (type) {
        case 'edit': {
            return ctx.editMessageText(
                'Что ты хочешь уточнить?',
                Markup.inlineKeyboard([
                    [Markup.button.callback('Как ко мне можно обращаться?', 'appeal')],
                    [Markup.button.callback('Список команд', 'command_list')],
                    [Markup.button.callback('Что я могу', 'whatcanido')],
                ]),
            );
        }

        default: {
            return ctx.reply(
                'Что ты хочешь уточнить?',
                Markup.inlineKeyboard([
                    [Markup.button.callback('Как ко мне можно обращаться?', 'appeal')],
                    [Markup.button.callback('Список команд', 'command_list')],
                    [Markup.button.callback('Что я могу', 'whatcanido')],
                ]),
            );
        }
    }
}

bot.start(async (ctx) =>
    ctx.reply('Привет! Чтобы не задавать глупые вопросу админу: сразу напиши /help'),
);

bot.command('register', async (ctx) => {
    const group = ctx.message.text.split(' ')[1];

    const candidate = await GroupModel.findAll({
        raw: true,
        where: {
            chat_id: ctx.chat.id.toString(),
        },
    });

    if (candidate.length) {
        return ctx.reply(`Эта группа уже зарегистрирована!`);
    }

    await GroupModel.create({
        group,
        chat_id: ctx.chat.id.toString(),
    });

    return ctx.reply(`Вы зарегистрировали группу ${group}`);
});

bot.command('unregister', async (ctx) => {
    await GroupModel.destroy({
        where: {
            chat_id: ctx.chat.id.toString(),
        },
    });

    return ctx.reply(
        'Группа успешно удалено из списка рассылки. Спасибо, что были со мной\n' +
            'Предательство — всегда обидно',
    );
});

bot.help(helpRouter);
bot.action('help', (ctx) => helpRouter(ctx, 'edit'));

bot.action('appeal', (ctx) =>
    ctx.editMessageText(
        `Ты можешь написать одно из ключевых слов (фраз) в начале своего обращения, чтобы вызвать меня:\n- ${keywords.join(
            '\n- ',
        )}`,
        Markup.inlineKeyboard([[Markup.button.callback('Назад', 'help')]]),
    ),
);

bot.action('whatcanido', (ctx) =>
    ctx.editMessageText(
        'Я могу пока не много, но уже достаточно, чтобы быть полезным (своему Отечеству). Могу:\n' +
            '- показывать расписание на завтра\n' +
            '- сделать рапорт на хак\n' +
            '- каждый вечер напоминать тебе, какие завтра пары',
        Markup.inlineKeyboard([[Markup.button.callback('Назад', 'help')]]),
    ),
);

bot.action('command_list', (ctx) =>
    ctx.editMessageText(
        `Вот список команд, которые нужно указать после обращения, чтобы я начал что-то делать:\n- ${commandsList.join(
            '\n- ',
        )}\n\n
А вот образец команд, чтобы я понял, что ты от меня хочешь:
${templates.join(' ')}`,
        Markup.inlineKeyboard([[Markup.button.callback('Назад', 'help')]]),
    ),
);

bot.action('whatcanido', (ctx) => ctx.reply('whatcanido'));

bot.on(message('text'), async (ctx) => {
    const message = ctx.update.message.text;

    keywords.map(async (keyword) => {
        if (message.toLowerCase().includes(keyword)) {
            const sentence = message.split(' ').slice(1).join(' ');
            if (!sentence) {
                return ctx.reply('Нужно указать саму команду. Если не знаешь, попробуй /help');
            }

            for (let i = 0; i < commandsList.length; i += 1) {
                if (sentence.includes(commandsList[i])) {
                    switch (i) {
                        case 0: {
                            const group = sentence.split(' ')[2];
                            if (!group) {
                                return ctx.reply(
                                    'Ты не указал группу\nНадо вот так: расписание для 611-2',
                                );
                            }

                            try {
                                const schedule = getRectangleFromExcel(
                                    `../files/${group}.xlsx`,
                                    'D6:W34',
                                );
                                const tomorrow = filterDates(schedule)[0];

                                return ctx.reply(
                                    `Завтра ${new Date(tomorrow.date).toLocaleDateString(
                                        'ru-RU',
                                    )}\n\n
  Расписание на завтра:\n${tomorrow.jobs.join('\n')}`,
                                );
                            } catch (e) {
                                return ctx.reply(
                                    'Группа, которую ты указал, не найдена. Попробуй еще раз',
                                );
                            }
                        }

                        case 1: {
                            try {
                                const lines = sentence.split('\n');
                                const names = lines[1].split('Имена: ')[1].split(', ');
                                const commander = lines[2].split('Старший: ')[1];
                                const start_time = lines[3].split('Время начала: ')[1];
                                const end_time = lines[4].split('Время завершения: ')[1];
                                const event = lines[5].split('Событие: ')[1];
                                const raport_name =
                                    lines[6]?.split('Название файла: ')[1] || `Рапорт на ${event}`;

                                await generateDocument(
                                    {
                                        names,
                                        commander,
                                        start_time,
                                        end_time,
                                        event,
                                    },
                                    raport_name,
                                );

                                return await ctx.replyWithDocument({
                                    source: path.resolve(__dirname, `./files/${raport_name}.docx`),
                                });
                            } catch (e) {
                                return await ctx.reply(
                                    'Какая-то ошибка\nПроверь правильность написания команды — это очень важно!',
                                );
                            }
                        }

                        default:
                            ctx.reply('Что-то точно произошло...');
                            break;
                    }
                }
            }

            return ctx.reply('Я не понимаю, что ты хочешь(');
        }
    });
});

async function everyHour() {
    const groups = await GroupModel.findAll({
        raw: true,
    });

    for (let i = 0; i < groups.length; i += 1) {
        await bot.telegram.sendMessage(
            groups[i].chat_id,
            `В Петербурге ${new Date().getHours()} часов!`,
        );
    }
}

async function every20Hour() {
    const groups = await GroupModel.findAll({
        raw: true,
    });

    groups.forEach(async (group) => {
        const schedule = getRectangleFromExcel(`../files/${group.group}.xlsx`, 'D6:W34');
        const tomorrow = filterDates(schedule)[0];

        const sentMessage = await bot.telegram.sendMessage(
            group.chat_id,
            `Завтра ${new Date(tomorrow.date).toLocaleDateString('ru-RU')}\n\n
Расписание на завтра:\n${tomorrow.jobs.join('\n')}`,
        );

        const chatId = sentMessage.chat.id;
        const pinnedMessages = await PinnedModel.findAll({
            raw: true,
            where: { chat_id: chatId.toString() },
        });
        for (let j = 0; j < pinnedMessages.length; j += 1) {
            await bot.telegram.unpinChatMessage(chatId, pinnedMessages[j].message_id);
        }
        // await PinnedModel.destroy({ where: { chat_id: chatId } });

        await bot.telegram.pinChatMessage(chatId, sentMessage.message_id);
        await PinnedModel.create({ message_id: sentMessage.message_id, chat_id: chatId });
    });
}

schedule('0 20 * * *', every20Hour);
// schedule('*/10 * * * * *', every20Hour);
schedule('0 * * * *', everyHour);

async function startBot() {
    try {
        await DB.sync({ alter: true }).then(() => {
            bot.launch();
        });
    } catch (e) {
        console.log(e);
    }
}

startBot();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
