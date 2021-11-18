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

let ateMenu = [];
client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if (message.content === "점심") {
    const _menus = await Menu.find({});
    let menus = [];

    _menus.map((menu) => {
      menus.push(menu.menu);
    });

    const __menus = menus.filter((menu) => !ateMenu.includes(menu));
    const menu = __menus[Math.floor(Math.random() * __menus.length)];

    ateMenu.push(menu);
    message.channel.send(menu);
  }

  const prefix = "!";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "add") {
    const newMenu = new Menu({ menu: args[0] });
    await newMenu.save((err) => {
      if (err) return console.log(err);
      message.channel.send(`"${args[0]}" 메뉴를 추가했어요!`);
    });
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
