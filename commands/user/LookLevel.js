const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { getLevel } = require('../../function/DataTools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        const level = await getLevel(interaction.user.id);
        const exper = await client.qdb.get(`user_${interaction.user.id}.xp`);
        const requiredExp = Math.floor(1000 * ((level * 0.05) ** 0.8 + 0.909));

        if (!level) return await interaction.reply(`## 你的等級: 1\n經驗值: \`${exper}/1000\``);

        await interaction.reply(`## 你的等級: ${level}\n經驗值: \`${exper}/${requiredExp}\``);

    }
}