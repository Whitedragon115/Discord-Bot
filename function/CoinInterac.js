const { client } = require('../index')

async function setUserCoins(id, coins) {
    await dclog('DB', `Setting user coins via api \`${id}\`, \`${coins}\`FC`);
    const url = `${process.env.DASH_URL}/api/admin/user/setUserCoinByID`;
    const headers = {
        'Content-Type': 'application/json',
        api: `${process.env.DASH_API_KEY}`,
        bypasswaf: `${process.env.WAF_BYPASS_KEY}`,
    };
    const data = {
        id: `${id}`,
        coins: `${coins}`,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error(error);
    }
}

async function setActivateBooster(userId, boosterId) {
    // await dclog('DB', `Set booster data into db: \`${userId} ${boosterId}\``); Logging
    const collection = client.mdb.collection('booster');
    const booster = await collection.findOne({ _id: new ObjectId(boosterId) });
    if (!booster || booster.user != userId.toString()) return false

    const multiplier = booster.multiplier;
    const lasts = booster.lasts;
    const collection2 = client.mdb.collection('actbooster');

    await collection2.insertOne({
        user: userId,
        multiplier: multiplier,
        expires: Math.floor(Date.now() / 1000) + lasts * 3600,
    });

    await collection.deleteOne({ _id: new ObjectId(boosterId) });
    await sendFboosterAnnounce(userId, multiplier, lasts);

    return true;
}

async function deleteOutdatedBoosters() {
    const collection = client.mdb.collection('actbooster');
    const boosters = await collection.find({}).toArray();
    if (!boosters) {
        return;
    }
    boosters.forEach(async booster => {
        if (booster.expires < Math.floor(Date.now() / 1000)) {
            await dclog(
                'DB',
                `Delete outdated boosters from db (ID: ${booster._id})`
            );
            collection.deleteOne({ _id: new ObjectId(booster._id) });
        }
    });
    return true;
}

async function inviteIntoDB(userId, inviterId) {
    // await dclog('DB', `Put invite data into db: \`${userId} invited by ${inviterId}\``); Logging
    const collection = client.mdb.collection('invites');
    const check = await collection.findOne({ user: userId });
    if (check) return false;

    await collection.insertOne({
        user: userId,
        inviter: inviterId,
    });

    return true;
}

async function getInviterFromDB(userId) {
    // await dclog('DB', `Get inviter data from db: \`${userId}\``); Logging
    const collection = client.mdb.collection('invites');
    const check = await collection.findOne({ user: userId });
    return check ? check.inviter : false;
}

module.exports = {
    setUserCoins,
    setActivateBooster,
    deleteOutdatedBoosters,
    inviteIntoDB,
    getInviterFromDB,
}
