import "dotenv/config";
import { Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";
import loadCommands from "./loadCommands.js";
import config from "../../../config.json" assert { type: "json" };
import "colors";

async function registerSlashCommand(client) {
	console.log("Refreshing (/) commands".yellow);

	//Registering the commands
	const rest = new REST({ version: "10" }).setToken(process.env.token);
	const commands = await loadCommands(client);

	try {
		let guilds = [];
		if (config.commandSetup.globalCommands) {
			guilds = client.guilds.cache.map((guild) => guild.id);
		} else {
			guilds = [config.commandSetup.guildId];
		}

		for (let i = 0; i < guilds.length; i++) {
			//Command data goes here
			await rest.put(Routes.applicationGuildCommands(`${process.env.botId}`, `${guilds[i]}`), { body: commands });
		}

		console.log(`Successfully reloaded ${commands.length} (/) commands`.green);
	} catch (error) {
		console.log(`Failed to refresh ${commands.length} (/) commands`.red);
		console.error(error);
	}
}

export default registerSlashCommand;
