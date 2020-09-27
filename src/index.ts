import * as Discord from "discord.js";
import keys from "./config/keys";
import stock from "./commands/stock";
import { prefix } from "./config/config";
import Command from "./interfaces/Command";

const client = new Discord.Client();
const commands: Discord.Collection<string, Command> = new Discord.Collection();

commands.set(stock.name, stock);

client.on("ready", () => {
  client.user && console.log(`Logged in with as ${client.user.tag}`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const [command, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(" ");

  if (!commands.has(command))
    return message.reply("That command does not exist.");

  try {
    commands.get(command)?.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
});

client.login(keys.discord);
