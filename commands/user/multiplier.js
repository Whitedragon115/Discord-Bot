const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { getActiveBooster, getActivateFboosters } = require('../../function/DataTools')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('multiplier')
        .setDescription('Look at the multiplier now in use'),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        const multiplier = await getActiveBooster();
        const boosters = await getActivateFboosters();

        const embed = new EmbedBuilder()
            .setTitle(`## 目前的倍數為 ${multiplier} 倍。`)
            .setDescription(boosters ? `### 目前啟用的 FBooster:\n${boosters.map(booster => `> 使用者: <@${booster.user}> | ${booster.multiplier} 倍，<t:${booster.expires}:R> 到期`).join('\n')}` : '目前沒有啟用中的 FBooster。')
            .setColor(0x00ff00)

        await interaction.reply({ embeds: [embed], ephemeral: true })

    }
}