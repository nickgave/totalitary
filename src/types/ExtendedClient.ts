import { Client, ClientOptions, Collection } from 'discord.js';
import type { Command } from './Command.js';

export class ExtendedClient extends Client {
    public commands: Collection<string, Command>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}