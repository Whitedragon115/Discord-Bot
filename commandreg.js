const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
requre('dotenv').config();

const commands = [
  {
    name: 'ping',
    description: '看看機器人有沒有活著?'
  },
  {
    name: 'help',
    description: '不會用指令? 使用 /help 來查看指令列表吧!'
  },
  {
    name: 'freecoin',
    description: '查看你的 FreeCoin 數量'
  },
  {
    name: 'transfer',
    description: '轉移 FreeCoin 給其他使用者，會收取 5% 手續費',
    options: [
      {
        name: '使用者',
        description: '要轉移 FreeCoin 的使用者',
        type: 6,
        required: true,
      },
      {
        name: '數量',
        description: '要轉移的 FreeCoin 數量',
        type: 4,
        required: true,
      },
    ],
  },
  {
    name: 'feecalculate',
    description: '計算轉移 FreeCoin 的手續費',
    options: [
      {
        name: '數量',
        description: '要轉移的 FreeCoin 數量',
        type: 4,
        required: true,
      },
    ],
  },
  {
    name: 'fbooster',
    description: '管理你的 FBooster。這是什麼? 查看 /help 來了解更多',
    options: [
      {
        name: '動作',
        description: '選擇動作',
        type: 3,
        required: true,
        choices: [
          {
            name: '查看',
            value: 'view',
          },
          {
            name: '購買',
            value: 'buy',
          },
          {
            name: '使用',
            value: 'use',
          },
        ],
      },
    ],
  },
  {
    name: 'sign',
    description: '每日簽到，可獲得隨機 FreeCoin',
  },
  {
    name: 'question',
    description: '提供 FreeCoin，使其他人回答問題；問題將被發至聊天室',
    options: [
      {
        name: '數量',
        description: '要提供的 FreeCoin 獎勵數量',
        min_value: 15,
        type: 4,
        required: true,
      },
      {
        name: '問題',
        description: '要提供的問題',
        type: 3,
        required: true,
      },
      {
        name: '正確解答',
        description: '問題的正確解答，可以提供多項，使用半形逗號","分開答案。(注意:空格也會被視為答案內容)',
        type: 3,
        required: true,
      }
    ],
  },
  {
    name: 'multiplier',
    description: '查看目前 FBooster 的倍率、到期時間與使用者',
  },
  {
    name: 'togglemention',
    description: '在機器人更新你的 FreeCoin 時，是否要提及你',
  },
  {
    name: 'level',
    description: '查看你的等級',
  }
]; 
const CLIENT_ID = 1161610985690374184n
const GUILD_ID = 1161357736819302500n
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();