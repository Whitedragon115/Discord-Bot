const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('AddFBbooster')
        .setDescription('Add FB booster to user')
        .addIntegerOption(option => option
            .setName('數量')
            .setDescription('The amount of FB booster you want to add')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('時長')
            .setDescription('The type of FB booster you want to add')
            .addChoices(
                { name: '1 小時', value: '1' },
                { name: '6 小時', value: '6' },
                { name: '12 小時', value: '12' },
                { name: '24 小時', value: '24' },
                { name: '48 小時', value: '48' },
                { name: '1 周', value: '168' },
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('倍率')
            .setDescription('The type of FB booster you want to add')
            .addChoices(
                { name: '1.2 倍', value: '1.1' },
                { name: '1.5 倍', value: '1.5' },
                { name: '1.7 倍', value: '1.7' },
                { name: '2 倍', value: '2' },
                { name: '3 倍', value: '3' },
                { name: '4 倍', value: '4' },
            )
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you want to add to')
            .setRequired(true)
        ),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        const amount = interaction.options.getInteger('數量');
        const duration = interaction.options.getString('時長');
        const multiplier = interaction.options.getString('倍率');
        const user = interaction.options.getUser('user');

        const data = {
            user: user.id,
            multiplier: multiplier,
            lasts: duration,
        }

        const collection = client.mdb.collection('booster');

        for(let i = 0; i < amount; i++) {
            await collection.insertOne(data)
        }
    }
}