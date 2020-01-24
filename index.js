const express = require('express');

const config = require("./src/config");
const MongoProvider = require("./src/providers/MongoProvider");
const RedisProvider = require("./src/providers/RedisProvider");
const RankingService = require("./src/services/RankingService");

const userProvider = new MongoProvider(config.mongoUrl, config.mongoDbName, config.mongoDbCollection);
const scoresProvider = new RedisProvider(config.redisUrl, config.redisPort, config.redisAuth, config.redisDb); 
const rankingService = new RankingService(userProvider, scoresProvider);

const app = express();

app.listen(config.port, () => {
    console.log("✅ Server started successfully");
    console.log(`✅ Listening on port: ${config.port}`);
});

app.param('page', function (req, res, next) {
    next();
  })

app.get('/api/leaderboard/:page', async (req, res) => {
    try {
        console.log('Fetching data...');        

        let rankings = await rankingService.generateRankings();
        let rankingsCount = rankings.length;
        let rankingsWithPagination = rankingService.chunkArrayInGroups(rankings, 25)[req.params.page - 1];

        res.set({
        'Total-Count-of-Users': `${rankingsCount}`, 
        'Minutes-Until-Next-Update' : `${60 - new Date().getMinutes()}-mins`});  

        res.send({
            totalUsers: rankingsCount,
            timeUntilNextUpdate: `${60 - new Date().getMinutes()}-mins`, 
            rankings: rankingsWithPagination});

        console.log('✅ The server responded with the data!');
    }
    catch (err) {
        console.warn(err);
        res.send({message: err.toString()});
    }
});




