const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { getUser, setUserCoins } = require('../../function/DataTools.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('transfer FreeCoin to others')
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount of FreeCoin you want to transfer')
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you want to transfer to')
            .setRequired(true)
        ),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        let amount = interaction.options.getInteger('amount');
        const user = interaction.options.getUser('user');

        if (interaction.user.id === user.id) {
            const embed = new EmbedBuilder()
                .setTitle('無法轉移 FreeCoin')
                .setDescription('轉給自己很好玩...嗎?')
                .setColor(0xff0000)
            return await interaction.reply({ embeds: [embed] });
        }

        if (amount == 0) {
            const embed = new EmbedBuilder()
                .setTitle('無法轉移 FreeCoin')
                .setDescription('`轉 0 是要...顯示你很窮嗎?')
                .setColor(0xff0000)
            return await interaction.reply({ embeds: [embed] });
        }

        if (amount < 0) {
            const lolmsg = [
                '經過計算，小明現在年齡 `-27歲`',
                '由此得證，公車上最後有 `-37.45`個人',
                '經過計算，這個人欠我 `-100`元',
            ];

            const embed = new EmbedBuilder()
                .setTitle('無法轉移 FreeCoin')
                .setDescription(`哇!負數耶! 你以後數學考卷答案最好就寫\n> \`${lolmsg[Math.floor(Math.random() * lolmsg.length)]}\``)
                .setColor(0xff0000)

            return await interaction.reply({ embeds: [embed] });
        }

        if (isNaN(amount)) {
            amount = Math.ceil(parseFloat(amount) * 100) / 100;
        }

        await interaction.reply('資料查詢中...');

        const FreecoinUser = await getUser(interaction.user.id);
        const targetUser = await getUser(target.id);

        if (FreecoinUser.error) return await interaction.editReply(`找不到你的帳號...請前往 ${dashurl} 註冊。`);
        if (targetUser.error) return await interaction.editReply(`你要轉的人好像沒有註冊或不存在耶...叫他去 ${dashurl} 註冊!`)

        const fee = Math.round(amount * TaxRate);

        if (FreecoinUser.info.coins < amount + fee) {
            const freecoinSymbol = "<:freecoin:1171871969617117224>"
            const errmsg = `若要轉移${amount} $$，需要 ${amount + fee} $$，其中 ${fee} $$ 為手續費)`

            const embed = new EmbedBuilder()
                .setTitle('你沒有足夠的 <:freecoin:1171871969617117224>!')
                .setDescription(errmsg.replaceAll("$$", freecoinSymbol))
                .setColor(0xff0000)

            return await interaction.editReply({ embeds: [embed], content: '' });
        }

        await setUserCoins(interaction.user.id, user.info.coins - amount - fee);
        await setUserCoins(target.id, targetUser.info.coins + amount);

        const embed = new EmbedBuilder()
            .setTitle('轉移成功')
            .setDescription(`成功轉移 ${amount} <:freecoin:1171871969617117224> 給 ${target.username}`)
            .setColor(0x00ff00)

        await interaction.editReply({ embeds: [embed], content: '' });

    }
}