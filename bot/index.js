const { Telegraf, Markup } = require("telegraf");
const { message } = require("telegraf/filters");
const { generateDocument } = require("./utils/createDoc");
const path = require("path");
const { schedule } = require("node-cron");

const bot = new Telegraf("6948521745:AAFndHaNtRANJ82jrBxU2jzOzh4btw6EFEY");

const keywords = ["бот", "ботяра", "папочка", "товарищБот"];
const commands_list = ["расписание", "сделай рапорт на хак"];
const templates = [
  "",
  "Имена: через запятую участники\n" +
    "Старший: через запятую старшие\n" +
    "Время начала: строка вида чч:мм дд:мм:гггг\n" +
    "Время завершения: строка вида чч:мм дд:мм:гггг\n" +
    "Событие: название_события",
];

bot.start(async (ctx) => {
  ctx.reply("Привет!");
});

bot.help((ctx) => {
  return ctx.reply(
    "Что ты хочешь уточнить?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Как ко мне можно обращаться?", "appeal")],
      [Markup.button.callback("Список команд", "command_list")],
      [Markup.button.callback("Что я могу", "whatcanido")],
    ])
  );
});

bot.action("appeal", (ctx) => {
  return ctx.editMessageText(`Ты можешь написать одно из ключевых слов (фраз) в начале своего обращения, чтобы вызвать меня:
${keywords.join(", ")}`);
});

bot.action("command_list", (ctx) => {
  return ctx.reply(`Вот список команд, которые нужно указать после обращения, чтобы я начал что-то делать: 
${commands_list.join(
  ", "
)}\n\n\nА вот образец команд, чтобы я понял, что ты от меня хочешь: ${templates.join(
    "\n"
  )}`);
});

bot.action("whatcanido", (ctx) => {
  return ctx.reply("whatcanido");
});

bot.on(message("text"), (ctx) => {
  const message = ctx.update.message.text;

  keywords.map(async (keyword) => {
    if (message.toLowerCase().includes(keyword)) {
      const sentence = message.split(" ").slice(1).join(" ");
      if (!sentence) {
        return ctx.reply("Ебать ты додик ебанный, где само обращение то?");
      }

      for (let i = 0; i < commands_list.length; i++) {
        if (sentence.includes(commands_list[i])) {
          const lines = sentence.split("\n");
          const names = lines[1].split("Имена: ")[1].split(", ");
          const commander = lines[2].split("Старший: ")[1];
          const start_time = lines[3].split("Время начала: ")[1];
          const end_time = lines[4].split("Время завершения: ")[1];
          const event = lines[5].split("Событие: ")[1];
          const raport_name =
            lines[6]?.split("Название файла: ")[1] || `Рапорт на ${event}`;

          await generateDocument(
            {
              names,
              commander,
              start_time,
              end_time,
              event,
            },
            raport_name
          );

          return await ctx.replyWithDocument({
            source: path.resolve(__dirname, `./files/${raport_name}.docx`),
          });
        }
      }

      return ctx.reply("Я не понимаю, что ты хочешь(");
    }
  });
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
