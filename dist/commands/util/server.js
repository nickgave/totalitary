import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.');
export async function execute(interaction) {
    const guild = await interaction.guild?.fetch();
    await interaction.reply(`This server is ${guild?.name} and has ${guild?.memberCount} members.`);
}
;
