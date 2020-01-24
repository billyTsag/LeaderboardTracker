const MongoProvider = require("../providers/MongoProvider");
const RedisProvider = require("../providers/RedisProvider");
const User = require("../models/User");

class RankingService {
    constructor(userProvider, scoresProvider) {
        this.userProvider = userProvider;
        this.scoresProvider = scoresProvider;
    }

    getUsers() {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.userProvider.retrieveDocuments()
                .then(users => resolve(users.reduce((registry, nextUser) => {
                    const structuredUser = new User(
                        nextUser._id, nextUser.country, nextUser.avatar, nextUser.age, nextUser.name
                    )
                    registry[structuredUser.id] = structuredUser;
                    return registry;
                }, {})))
                .catch(err => reject(err));
        });
    }

    getUserScores() {
        const that = this;

        return new Promise(function (resolve, reject) {
            that.scoresProvider.getKeyValues()
                .then(result => resolve(that.chunkArrayInGroups(result, 2)))
                .catch(err => reject(err));
        });
    }

    async generateRankings() {
        var userScores = await this.getUserScores();
        var registry = await this.getUsers();
        return userScores.map((userScore) => {            
            const userWithScore = registry[userScore[0]];
            userWithScore.score = userScore[1];
            return userWithScore;
        }).sort((one, other) => other.score - one.score);
    }


    chunkArrayInGroups(arr, size) {
        let myArray = [];
        for (let i = 0; i < arr.length; i += size) {
            myArray.push(arr.slice(i, i + size));
        }
        return myArray;
    }
}

module.exports = RankingService;
