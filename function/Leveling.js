const { client } = require('../index')
const { getLevel, getActiveBooster, getUser, getUserMention, getActivateFboosters, setUserCoins } = require('./DataTools.js')
const { sendAnnounce } = require('./Chatting.js')

async function levelup(userId) {

    // await dclog('DB', `Level up user data into db: \`${userId}\``); Logging
    const collection = client.mdb.collection('level');
    const level = await collection.findOne({ user: userId });

    if (!level) {
        await collection.insertOne({ user: userId, level: 2 });
        return 2;
    }

    await collection.updateOne(
        { user: userId },
        { $set: { level: level.level + 1 } }
    );

    return level.level + 1;
}

async function addexp(userId, expe) {

    const UserXp = await client.qdb.get(`user_${userId}.xp`);
    const UserLevel = await client.qdb.get(`user_${userId}.level`);

    if (!UserXp) {
        await client.qdb.set(`user_${userId}.xp`, 0);
        UserXp = 0;
    } else if (!UserLevel) {
        await client.qdb.set(`user_${userId}.level`, await getLevel(userId) ?? 1);
        UserLevel = 1;
    }

    const requiredExp = Math.floor(1000 * ((UserLevel * 0.05) ** 0.8 + 0.909));
    if (UserXp < requiredExp) return false;

    const multiplier = await getActiveBooster();
    const level = await levelup(userId);
    const user = await getUser(userId);
    const mention = await getUserMention(userId);
    UserXp -= requiredExp;

    if (multiplier > 1) {
        const boosters = await getActivateFboosters() ?? [];
        for (const booster of boosters) {
            const boosterUser = await getUser(booster.user);
            await setUserCoins(booster.user, parseInt(boosterUser.info.coins) + 8)
        }
    }

    if (user.error) {
        await sendAnnounce('<:icon_discord_chat:1162324964943343638>', `+0`, `<@${userId}> 升級到了等級 ${level}! 但他沒有註冊帳號，所以升級獎勵被沒收ㄌ`, mention);
        await client.qdb.set(`user_${userId}.level`, level);
        return true;
    }

    await setUserCoins(userId, parseInt(user.info.coins) + Math.round(50 * multiplier)).catch(err => console.error(err));
    await sendAnnounce('<:icon_discord_chat:1162324964943343638>', `+50`, `<@${userId}> 升級到了等級 ${level}!`, mention);

    if (multiplier > 1) {
        const boosters = await getActivateFboosters();
        if (!boosters) return false;
        for (const booster of boosters) {
            if (booster.user == userId) return;
            const bmention = await getUserMention(booster.user);
            await sendAnnounce('<:icon_discord_rules:1162325284763222107>', `+8`, `<@${booster.user}> 升級了，你因 FBooster 獲得了 8 <:freecoin:1171871969617117224>!`, bmention);
        }
    }

    await client.qdb.set(`user_${userId}.level`, level);
    return true;

}

module.exports = {
    levelup,
    addexp
}