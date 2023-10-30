const { Telegraf, Markup } = require("telegraf");
const { message } = require("telegraf/filters");
const { compareStrings } = require("./utils/compareCmd");
const { generateDocument } = require("./utils/createDoc");
const path = require("path");

const bot = new Telegraf("6948521745:AAFndHaNtRANJ82jrBxU2jzOzh4btw6EFEY");

const keywords = ["бот", "ботяра", "папочка", "товарищБот"];
const commands_list = [
  "расписание",
  "сделай рапорт на хак. Имена: [имена через запятую]",
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
${commands_list.join(", ")}`);
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
          const names = sentence.split("Имена: ")[1].split(", ");

          await generateDocument(
            {
              names,
              older: "курсанта Полякова Д.С.",
            },
            "Желающие проебаться на хаке"
          );

          return await ctx.replyWithDocument({
            source: path.resolve(
              __dirname,
              "./files/Желающие проебаться на хаке.docx"
            ),
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
