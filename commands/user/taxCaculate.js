const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { TaxRate } = require('../../config.json')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tax-calculate')
        .setDescription('Calculate the tax you need to pay for your income')
        .addIntegerOption(option => option
            .setName('數量')
            .setDescription('你想要轉移的 FreeCoin 數量')
            .setRequired(true)
        ),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        const amount = interaction.options.getInteger('數量');

        if (amount <= 0) {
            const embed = new EmbedBuilder()
                .setTitle('請輸入正確的數量')
                .setDescription('請輸入正整數')
                .setColor(0xff0000)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const tax = Math.round(amount * TaxRate);

        const embed = new EmbedBuilder()
            .setTitle('轉移計算機')
            .setDescription(`欲轉移 ${amount} <:freecoin:1171871969617117224>`)
            .addFields(
                { name: '手續費', value: `${tax} <:freecoin:1171871969617117224>` },
                { name: '共需支付', value: `${amount + tax} <:freecoin:1171871969617117224>` }
            )
            .setColor(0x00ff00)

        await interaction.reply({ embeds: [embed] })

    }
}