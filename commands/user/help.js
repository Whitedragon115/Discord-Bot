const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')

const helpmsg = [
    "> </help:1171802229330677811> - 顯示此幫助頁面",
    "> </ping:1171802229330677810> - 確認機器人狀態",
    "> </freecoin:1171827811527426059> - 獲得自己的 FreeCoin 數量",
    "> </transfer:1171866796689723433> - 轉移 FreeCoin 給別人，會收取 5% 手續費",
    "> </feecalculate:1171874197681741965> - 計算轉移手續費",
    "> </fbooster:1171879343954337882> - 查看或使用 FBooster [[?]](<https://docs.freeserver.tw/freecoin/fbooster>)",
    "> </multiplier:1179867829370110086> - 查看目前的 FBooster 倍數",
    "> </sign:1171894002199564288> - 簽到，每日可獲得 0-4 FreeCoin [[?]](<https://docs.freeserver.tw/freecoin/gain/discord/sign>)",
    "> </question:1171894002199564289> - 付費在聊天室發起問題 [[?]](<https://docs.freeserver.tw/freecoin/gain/discord/answer>)",
    "> </level:1182931451541463081> - 查看自己的聊天等級",
    "> </togglemention:1180229420577992836> - 開啟或關閉獲得 FreeCoin 時的提醒"
]


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with commands'),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        const embed = new EmbedBuilder()
            .setTitle('指令幫助')
            .setDescription(`\n${helpmsg.join("\n")}\n\n-# 還有其他問題? [可以查看我們的文檔](<https://docs.freeserver.tw/>)`)
            .setColor(0x00ff00)

        await interaction.reply({ embeds: [embed] })

    }
}