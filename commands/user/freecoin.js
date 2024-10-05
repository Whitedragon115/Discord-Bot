const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { getUser } = require('../../function/DataTools.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freecoin')
        .setDescription('Look at your FreeCoin'),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        await interaction.reply('資料查詢中...');
        const user = await getUser(interaction.user.id);

        if(user.error){
            const embed = new EmbedBuilder()
                .setTitle('好像還沒註冊...')
                .setDescription('找不到你的帳號...請前往 [這裡](https://dash.freeserver.tw) 註冊。')
                .setColor(0xff0000)

            return await interaction.editReply({ embeds: [embed], content: '' });
        }
        
        const embed = new EmbedBuilder()
            .setTitle('FreeCoin')
            .setDescription(`你的 FreeCoin: ${user.info.coins} <:freecoin:1171871969617117224>`)
            .setColor(0x00ff00)

        await interaction.editReply({ embeds: [embed], content: '' });

    }
}