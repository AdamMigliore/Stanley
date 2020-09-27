import Discord from "discord.js";

export default interface Command {
  name: string;
  description: string;
  execute: (message: Discord.Message, args: string[]) => void;
}
