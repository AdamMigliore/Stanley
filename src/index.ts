import * as Discord from "discord.js";
import keys from "./config/keys";

const client = new Discord.Client();

client.on("ready", () => {});

client.on("message", () => {});

client.login(keys.discord);
