const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const path = require('path');
const { schedule } = require('node-cron');
const DB = require('./config/db.connect');
const { GroupModel } = require('./models/group.model');

const { generateDocument, filterDates } = require('./utils');
const { getRectangleFromExcel } = require('../server/utils/parser');
const { PinnedModel } = require('./models/pinned.model');
const { UserModel } = require('./models/user.model');
const { sendMessage } = require('./gigachat/createRequest');
const { GigachatModel } = require('./models/gigachat.model');
const { getAccessToken } = require('./gigachat/getAccessToken');
const { AccessTokenModel } = require('./models/accessToken.model');

const bot = new Telegraf('6948521745:AAFndHaNtRANJ82jrBxU2jzOzh4btw6EFEY');

const keywords = ['бот', 'товарищБот', 'папочка'];
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
let currentShift = 1;
let selectedGroup = '';

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

bot.start(async (ctx) => {
    const chatId = ctx.chat.id.toString();

    const candidate = await UserModel.findAll({ raw: true, where: { chat_id: chatId } });
    if (candidate.length) {
        return ctx.reply('Привет!\nЧтобы не задавать глупые вопросу админу: сразу напиши /help');
    }

    return ctx.reply(
        'Привет, новичок!\n' +
            'Попробуй команду `/register_user [группа]`, чтобы я запомнил тебя.\n' +
            'Чтобы не задавать глупые вопросу админу: сразу напиши /help',
    );
});

bot.command('ask_gigachat', async (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ');

    await GigachatModel.create({ role: 'user', content: message });

    const messages = await GigachatModel.findAll({ raw: true });

    for (let i = 0; i < messages.length; i += 1) {
        delete messages[i].id;
    }

    const tokens = await AccessTokenModel.findAll({ raw: true });

    const answer = await sendMessage(messages, tokens[0].access_token);
    await GigachatModel.create({ role: 'assistant', content: answer });

    ctx.reply(answer);
});

bot.command('clear_chat', async (ctx) => {
    await GigachatModel.destroy({ where: {} });

    ctx.reply('Диалог с гигачатом очищен');
});

bot.command('refresh_token', async (ctx) => {
    await AccessTokenModel.destroy({ where: {} });

    const token = await getAccessToken();
    await AccessTokenModel.create({ access_token: token });

    ctx.reply('Токен обновлен');
});

bot.command('register_user', async (ctx) => {
    const chatId = ctx.message.from.id.toString();
    const candidate = await UserModel.findAll({ raw: true, where: { chat_id: chatId } });
    if (candidate.length) {
        return ctx.reply('Ты уже зарегистрирован!\nДважды делать это необходимость нет!');
    }

    const group = ctx.message.text.split(' ')[1];
    if (!group) return ctx.reply('Не угадал ;(\nПопробуй вот так: `/register_user [группа]`');

    await UserModel.create({ chat_id: chatId, group });
    return ctx.reply(`Отлично! Ты зарегистрировался!\nТвоя группа: ${group}`);
});

bot.command('register', async (ctx) => {
    const group = ctx.message.text.split(' ')[1];

    if (!group) return ctx.reply('Не угадал ;(\nПопробуй вот так: `/register [группа]`');

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
            '- каждый вечер напоминать тебе, какие завтра пары\n' +
            '- запоминать пользователей и группы, чтобы автоматически показывать расписание без уточнения',
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

bot.action('calendar', async (ctx) => {
    const date = new Date();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const buttons = [];

    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const months = [
        'январь',
        'февраль',
        'март',
        'апрель',
        'май',
        'июнь',
        'июль',
        'август',
        'сентябрь',
        'октябрь',
        'ноябрь',
        'декабрь',
    ];
    for (let i = 0; i < 7; i += 1) {
        buttons.push(Markup.button.callback(days[i], 'empty'));
    }

    for (let i = 0; i < firstDay; i += 1) {
        buttons.push(Markup.button.callback('\u200B', 'empty'));
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        buttons.push(Markup.button.callback(day.toString(), `day_${day}`));
    }

    while (buttons.length % 7 !== 0) {
        buttons.push(Markup.button.callback('\u200B', 'empty'));
    }

    const rows = [];
    for (let i = 0; i < buttons.length; i += 7) {
        rows.push(buttons.slice(i, i + 7));
    }

    const inlineKeyboard = Markup.inlineKeyboard(rows);

    ctx.answerCbQuery();
    return ctx.editMessageText(`Вот календарь на ${months[new Date().getMonth()]}`, inlineKeyboard);
});

bot.action(/day_\d+/, async (ctx) => {
    const day = ctx.match[0].split('_')[1];

    function findCurrentDayInMonth(dates, day) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return dates.find((date) => {
            const currentDate = new Date(date.date);

            const dateDay = currentDate.getDate();
            const dateMonth = currentDate.getMonth();
            const dateYear = currentDate.getFullYear();

            return (
                ~~dateDay === ~~day &&
                ~~dateMonth === ~~currentMonth &&
                ~~dateYear === ~~currentYear
            );
        });
    }

    const candidate = await UserModel.findAll({
        raw: true,
        where: { chat_id: ctx.update.callback_query.from.id.toString() },
    });

    let dbGroup = '';
    if (candidate.length) {
        dbGroup = candidate[0].group;
    }

    try {
        const schedule = getRectangleFromExcel(
            `../files/${selectedGroup || dbGroup}.xlsx`,
            'D6:W34',
        );
        const foundDate = findCurrentDayInMonth(schedule, day);

        return ctx.editMessageText(
            `${new Date(foundDate.date).toLocaleDateString(
                'ru-RU',
            )}\n\nРасписание на этот день для ${selectedGroup || dbGroup}:\n${foundDate.jobs.join(
                '\n',
            )}`,
            Markup.inlineKeyboard([[Markup.button.callback('Показать календарь', 'calendar')]]),
        );
    } catch (e) {
        console.log(e);
        ctx.editMessageText(
            'Произошла ошибка при получении расписания.\nПроверь, что ты зарегистрировался!',
        );
    }
});

bot.action('prev_day', (ctx) => {
    if (currentShift === 0) currentShift = -1;
    else currentShift -= 1;

    const schedule = getRectangleFromExcel(`../files/${selectedGroup}.xlsx`, 'D6:W34');
    const tomorrow = filterDates(schedule, currentShift);

    return ctx.editMessageText(
        `${new Date(tomorrow.date).toLocaleDateString(
            'ru-RU',
        )}\n\nРасписание для ${selectedGroup}:\n${tomorrow.jobs.join('\n')}`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('Предыдущий день', 'prev_day'),
                Markup.button.callback('Следующий день', 'next_day'),
            ],
            [Markup.button.callback('Показать календарь', 'calendar')],
        ]),
    );
});
bot.action('next_day', (ctx) => {
    currentShift += 1;
    const schedule = getRectangleFromExcel(`../files/${selectedGroup}.xlsx`, 'D6:W34');
    const tomorrow = filterDates(schedule, currentShift);

    try {
        return ctx.editMessageText(
            `${new Date(tomorrow.date).toLocaleDateString(
                'ru-RU',
            )}\n\nРасписание для ${selectedGroup}:\n${tomorrow.jobs.join('\n')}`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback('Предыдущий день', 'prev_day'),
                    Markup.button.callback('Следующий день', 'next_day'),
                ],
                [Markup.button.callback('Показать календарь', 'calendar')],
            ]),
        );
    } catch (e) {
        console.log(e.message);
    }
});

bot.on(message('text'), async (ctx) => {
    const message = ctx.update.message.text;
    const chatId = ctx.message.from.id.toString();

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
                            try {
                                const group = sentence.split(' ')[2];

                                if (!group) {
                                    const candidate = await UserModel.findAll({
                                        raw: true,
                                        where: { chat_id: chatId },
                                    });

                                    if (!candidate.length) {
                                        return ctx.reply(
                                            'Ты не указал группу\nНадо вот так: расписание для 611-2\n' +
                                                'Чтобы каждый раз не указывать группу, просто зарегистрируйся: `/register_user [номер группы]`',
                                        );
                                    }

                                    selectedGroup = candidate[0].group;
                                    currentShift = 1;
                                    const schedule = getRectangleFromExcel(
                                        `../files/${selectedGroup}.xlsx`,
                                        'D6:W34',
                                    );
                                    const tomorrow = filterDates(schedule);
                                    return ctx.reply(
                                        `Завтра ${new Date(tomorrow.date).toLocaleDateString(
                                            'ru-RU',
                                        )}\n\nРасписание на завтра для ${
                                            selectedGroup || group
                                        }:\n${tomorrow.jobs.join('\n')}`,
                                        Markup.inlineKeyboard([
                                            [
                                                Markup.button.callback(
                                                    'Предыдущий день',
                                                    'prev_day',
                                                ),
                                                Markup.button.callback(
                                                    'Следующий день',
                                                    'next_day',
                                                ),
                                            ],
                                            [
                                                Markup.button.callback(
                                                    'Показать календарь',
                                                    'calendar',
                                                ),
                                            ],
                                        ]),
                                    );
                                }

                                const schedule = getRectangleFromExcel(
                                    `../files/${group}.xlsx`,
                                    'D6:W34',
                                );
                                const tomorrow = filterDates(schedule);
                                selectedGroup = group;
                                currentShift = 1;

                                return ctx.reply(
                                    `Завтра ${new Date(tomorrow.date).toLocaleDateString(
                                        'ru-RU',
                                    )}\n\nРасписание на завтра для ${selectedGroup}:\n${tomorrow.jobs.join(
                                        '\n',
                                    )}`,
                                    Markup.inlineKeyboard([
                                        [
                                            Markup.button.callback('Предыдущий день', 'prev_day'),
                                            Markup.button.callback('Следующий день', 'next_day'),
                                        ],
                                        [Markup.button.callback('Показать календарь', 'calendar')],
                                    ]),
                                );
                            } catch (e) {
                                console.log(e);
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
        const tomorrow = filterDates(schedule);

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

schedule('0 20,21,22 * * *', every20Hour);
// schedule('*/10 * * * * *', every20Hour);
schedule('0 * * * *', everyHour);

async function startBot() {
    try {
        await DB.sync({ alter: true }).then(() => {
            bot.launch();
        });
        await GigachatModel.destroy({ where: {} });
    } catch (e) {
        console.log(e);
    }
}

startBot();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
