import { Client, Collection } from 'discord.js';
export class ExtendedClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
    }
}
