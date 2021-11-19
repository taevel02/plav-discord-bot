require("dotenv").config();
const { Client, Intents } = require("discord.js");
const { Menu } = require("./models/Menu");

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_HOST ?? "")
  .then(() => console.log("MongoDB Connected."))
  .catch((err) => console.log("Failed to connect MongoDB: ", err));

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log("Client is ready...");
});

// let ateMenu = [];
client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if (message.content === "점심") {
    const _menus = await Menu.find({});
    let menus = [];
    _menus.map((menu) => {
      menus.push(menu.menu);
    });

    // const __menus = menus.filter((menu) => !ateMenu.includes(menu));
    // const menu = __menus[Math.floor(Math.random() * __menus.length)];
    const menu = menus[Math.floor(Math.random() * menus.length)];

    // ateMenu.push(menu);
    message.channel.send(menu);
  }

  if (message.content === "메뉴") {
    const _menus = await Menu.find({});
    let menus = [];
    _menus.map((menu) => {
      menus.push(menu.menu);
    });

    let content = "";
    menus.map((menu, index) => {
      let temp = "";
      if (index === menus.length) temp = `${index + 1}. ${menu}`;
      else temp = `${index + 1}. ${menu}\n`;
      content += temp;
    });
    message.channel.send(content);
  }

  const prefix = "!";
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  if (command === "add") {
    const newMenu = new Menu({ menu: args[0] });

    const checkMenu = await Menu.findOne({ menu: args[0] }).exec();
    if (checkMenu === null) {
      await newMenu.save((err) => {
        if (err) return console.log(err);
        message.channel.send(`"${args[0]}" 메뉴를 추가했어요!`);
      });
    } else {
      message.channel.send("이미 등록된 메뉴입니다.");
    }
  }
  if (command === "delete") {
    const menu = await Menu.findOne({ menu: args[0] }).exec();

    if (menu.length !== 0) {
      await menu.remove();
      message.channel.send(`"${args[0]}" 메뉴를 지웠습니다.`);
    } else {
      message.channel.send(`"${args[0]}" 메뉴를 찾지 못했습니다.`);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (e) {
    console.log("Not Found Command: ", e);
    await interaction.channel.send("커맨드를 찾을 수 없습니다.");
  }
});

client.login(process.env.BOT_TOKEN);
