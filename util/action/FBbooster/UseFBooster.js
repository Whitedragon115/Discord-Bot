const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js')
const { setActivateBooster } = require('../../../function/CoinInterac.js')

module.exports = {
    customId: 'fboosterselect',

    /**
     * @param {import ('discord.js').ChatInputCommandInteraction} interaction
     * @param {import ('discord.js').Client} client
     */

    async execute(interaction, client) {

        const userSelection = interaction.values[0];

        const embed = new EmbedBuilder()
            .setTitle('Fbooster 啟動確認')
            .setDescription(`你選擇了 Fbooster (ID:\`${userSelection}\`)，你確定要啟用嗎?\n> 請在10秒內回答`)
            .setColor(0x00ff00)

        const row = new ActionRowBuilder()
        const ybtn = new ButtonBuilder()
            .setCustomId('fboosterconfirm')
            .setLabel('確認')
            .setStyle(ButtonStyle.SUCCESS)

        const nbtn = new ButtonBuilder()
            .setCustomId('fboostercancel')
            .setLabel('取消')
            .setStyle(ButtonStyle.DANGER)

        row.addComponent(ybtn).addComponent(nbtn)
        await interaction.update({ embeds: [embed], components: [row] });

        //===== collect the button interaction =====

        const nextfilter = i => i.customId === 'fboosterconfirm' || i.customId === 'fboostercancel';
        const nextcollector = interaction.channel.createMessageComponentCollector({ filter: nextfilter, time: 10 * 1000 });

        nextcollector.on('collect', async i => {
            if (i.customId == 'fboostercancel') {
                await i.update({ content: '已取消使用 FBooster。', components: [] });
                return await nextcollector.stop();
            }

            if (i.customId == 'fboosterconfirm') {
                const result = await setActivateBooster(interaction.user.id, userSelection);
                if (!result) {
                    await i.update({ content: `找不到該 FBooster 或該 FBooster 不屬於你。`, components: [] });
                    return await nextcollector.stop();
                }
                await i.update({ content: `已成功使用 FBooster!`, components: [] });
                return await nextcollector.stop();
            }

        })
    }
}
