import * as dotenv from 'dotenv';
import {
    REST,
    Routes
} from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as readline from 'readline';

dotenv.config();

const commands: any[] = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderspath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderspath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderspath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath).href;

        const commandModule = await import(fileUrl);
        const command = commandModule.default ?? commandModule;

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

if (!process.env.TOKEN) {
    throw new Error('Some environment variable is not defined.');
}

const rest = new REST().setToken(process.env.TOKEN);

async function deploy_testGuild() {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID as string,
                process.env.GUILD_ID as string
            ),
            { body: commands },
        );
        console.log(`Successfully reloaded ${(data as Array<unknown>).length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

async function deploy_GlobalGuild() {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID as string),
            { body: commands },
        );
        console.log(`Successfully reloaded ${(data as Array<unknown>).length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout
});

const txt = `
1: deploy command to test guild.
2: deploy command to global guild.
> `

rl.question(txt, line => {
    const input = parseInt(line);
    if(input === 1) {deploy_testGuild();}
    else if(input === 2) {deploy_GlobalGuild();}
    else {throw new Error(`There is no such command as ${line}`);}
    rl.close();
})