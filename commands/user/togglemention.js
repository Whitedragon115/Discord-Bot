const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { getUserMention, setUserMention } = require('../../function/DataTools')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('togglemention')
        .setDescription('Toggle mention on/off'),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {
        
        const mention = await getUserMention(interaction.user.id);

        if (mention) {
            await setUserMention(interaction.user.id, false);
            await interaction.reply({ content: `已成功關閉提及功能。`, ephemeral: true });
        } else {
            await setUserMention(interaction.user.id, true);
            await interaction.reply({ content: `已成功開啟提及功能。`, ephemeral: true });
        }

    }
}