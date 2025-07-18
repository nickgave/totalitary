import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ExtendedClient } from './types/ExtendedClient.js';
import { GatewayIntentBits } from 'discord.js';
import { handleCommand } from './handleCommand.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });
await handleCommand(client);
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const eventModule = await import(fileUrl);
    const event = eventModule.default ?? eventModule;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}
client.login(process.env.TOKEN);
