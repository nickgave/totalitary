import * as dotenv from 'dotenv';
import { ExtendedClient } from './types/ExtendedClient.js';
import {
    Events,
    GatewayIntentBits,
    MessageFlags
} from 'discord.js';
import { handleCommand } from './handleCommand.js';

dotenv.config();

const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });
await handleCommand(client);

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
}) 