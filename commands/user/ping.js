const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const randomReplyMsg = ["Pong!", "Pong! Pong!", "Pong! Pong! Pong!", "Pong! Pong! Pong! Pong!"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Ping')
            .setDescription(randomReplyMsg[Math.floor(Math.random() * randomReplyMsg.length)])
            .setColor(0x00ff00)

        await interaction.reply({ embeds: [embed] })
    }
}