const { client } = require('../index');
const { AnnouncementChannel, BoosterRole } = require('../config.json')

async function sendAnnounce(emoji, amount, content, mention) {
    const channel = client.channels.cache.get(AnnouncementChannel);
    const saperator = await randSaperator();
    if (mention) {
        await channel.send(`${saperator}\n##  ${emoji} ${amount} <:freecoin:1171871969617117224>\n> ${content}`);
    } else {
        await channel.send({
            content: `${saperator}\n## ${emoji} ${amount} <:freecoin:1171871969617117224>\n> ${content}`,
            allowedMentions: { parse: [] },
        });
    }
    return true;
}

async function dclog(type, content) {
    if (type == 'DUMP') {
        if (dclogdata.length == 0) return;
        await client.channels.cache.get('1161357738610270313').send(dclogdata);
        dclogdata = '';
        return;
    }

    const data = `<t:${Math.floor(Date.now() / 1000)}:f> [${type}] ${content}`;
    dclogdata = dclogdata.length ? `${dclogdata}\n${data}` : data;

    if (dclogdata.split('\n').length > 10) {
        await client.channels.cache.get('1161357738610270313').send(dclogdata);
        dclogdata = '';
    }
}

async function sendFboosterAnnounce(user, multiplier, lasts) {
    const saperator = await randSaperator();
    const channel = client.channels.cache.get(process.env.ANNOUNCE_CHANNEL);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + parseInt(lasts));
    const expiryUnixTime = Math.floor(expiryDate.getTime() / 1000);
    const nowMultiplier = await getActiveBooster();

    await channel.send(`${saperator}
        # <a:icon_discord_nitro:1162325260675326045> FBooster 已啟動!
        > <@${user}> 啟用了時長為 ${lasts} 小時，倍數為 ${multiplier} 倍的 FBooster!
        > 此 FBooster 將於 <t:${expiryUnixTime}:R> 到期；目前倍數: ${nowMultiplier}倍\n- <@${BoosterRole}>
        `);

    return true;
}

async function randSaperator() {
    const decorations = [':', '：', '•', '.', '·'];

    let prevDecoration = null;
    let result = '';

    for (let i = 0; i < 20; i++) {
        let decoration = null;

        if (prevDecoration != ':' && Math.random() < 0.25) {
            decoration = ':';
        } else if (prevDecoration != '：' && Math.random() < 0.25) {
            decoration = '：';
        } else {
            let randIndex;
            do {
                randIndex = Math.floor(Math.random() * (decorations.length - 2)) + 2;
            } while (decorations[randIndex] === prevDecoration);
            decoration = decorations[randIndex];
        }

        if (prevDecoration != '：' && decoration != '：') {
            result += ' ';
        }

        result += decoration;
        prevDecoration = decoration;
    }

    return result;
}

module.exports = {
    sendAnnounce,
    dclog,
    sendFboosterAnnounce,
    randSaperator
};