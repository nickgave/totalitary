import * as dotenv from 'dotenv';
import { ExtendedClient } from './types/ExtendedClient.js';
import { Events, GatewayIntentBits } from 'discord.js';
import { handleCommand } from './handleCommand.js';
dotenv.config();
const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });
await handleCommand(client);
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(process.env.TOKEN);
client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand())
        return;
    console.log(interaction);
});
