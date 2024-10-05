const { client } = require('../index')
require('dotenv').config();

async function getActivateFboosters() {
    // await dclog('DB', `Get fboosters data from db`); logging
    const collection = client.mdb.collection('actbooster');
    const boosters = await collection.find({}).toArray();
    return !boosters || boosters.length === 0 ? false : boosters;
}

async function getActiveBooster() {
    // await dclog('DB', `Get booster data from db`); Logging
    const collection = client.mdb.collection('actbooster');
    const boosters = await collection.find({}).toArray();
    if (!boosters) {
        return 1.0;
    }
    let multiplier = 1.0;
    boosters.forEach(booster => {
        multiplier = multiplier + parseFloat(booster.multiplier) - 1;
    });
    return multiplier.toFixed(1);
}

async function getLevel(userId) {
    // await dclog('DB', `Get user level data from db: \`${userId}\``); lOGGING
    const collection = client.mdb.collection('level');
    const level = await collection.findOne({ user: userId });
    return level ? level.level : null;
}

async function getUserFboosters(userId) {
    // await dclog('DB', `Get user fbooster data from db: \`${userId}\``); Logging
    const collection = client.mdb.collection('booster');
    const boosters = await collection.find({ user: userId }).toArray();
    return !boosters || boosters.length === 0 ? false : boosters;
}

async function getUserMention(userId) {
    // await dclog('DB', `Get user mention data from db: \`${userId}\``); Logging
    const collection = client.mdb.collection('mention');
    const check = await collection.findOne({ user: userId });
    return !check;
}

async function getUser(id) {
    // await dclog('DB', `Getting user data via api \`${id}\``); Logging
    const url = `${process.env.DASH_URL}/api/admin/user/getFromID`;
    const headers = {
        'Content-Type': 'application/json',
        api: `${process.env.DASH_API_KEY}`,
        bypasswaf: `${process.env.WAF_BYPASS_KEY}`,
    };
    const data = {
        id: `${id}`,
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

async function signIntoDB(userId) {
    await dclog('DB', `\`${userId}\` has signed today`);
    const collection = client.mdb.collection('sign');
    await collection.insertOne({ user: userId });
    return true;
}

async function getSignFromDB(userId) {
    await dclog('DB', `Get sign data from db: \`${userId}\``);
    const collection = client.mdb.collection('sign');
    const check = await collection.findOne({ user: userId });
    return Boolean(check);
}

async function setUserCoins(id, coins) {
    // await dclog('DB', `Setting user coins via api \`${id}\`, \`${coins}\`FC`); Logging

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

async function setUserMention(userId, mention) {
    await dclog(
        'DB',
        `Set user mention data into db: \`${userId} ${mention}\``
    );
    const collection = client.mdb.collection('mention');
    if (mention) {
        await collection.deleteOne({ user: userId });
    } else {
        await collection.insertOne({ user: userId });
    }
}

module.exports = {
    getActivateFboosters,
    getActiveBooster,
    getLevel,
    getUserFboosters,
    getUserMention,
    getUser,
    signIntoDB,
    getSignFromDB,
    setUserCoins,
    setUserMention,
};