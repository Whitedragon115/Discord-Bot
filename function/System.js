const { client } = require('../index.js');

async function clearSignsFromDB() {
    // await dclog('DB', `Clearing all signs...`); Logging
    const collection = client.mdb.collection('sign');
    await collection.deleteMany({});
    return true;
}

cron.schedule('0 0 * * *', async () => {
    console.log('Clearing signs...');
    clearSignsFromDB();
    deleteOutdatedBoosters();
});

cron.schedule('* * * * *', async () => {
    fetch(
        'https://uptime.freeserver.tw/api/push/Vo52SSQ5YM?status=up&msg=OK&ping='
    );
});

module.exports = {
    clearSignsFromDB,
};