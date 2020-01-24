const redis = require('redis');

class RedisProvider{
    constructor(redisUrl, redisPort, redisAuth, redisDb){        
        this.redisUrl = redisUrl;
        this.redisPort = redisPort;
        this.redisAuth = redisAuth;
        this.redisDb = redisDb;
    }

    openConnection(){
        let client = redis.createClient(this.redisPort, this.redisUrl); 
        client.auth(this.redisAuth);
        client.select(this.redisDb); 
        return client;       
    }

    getKeyValues(){
        const that = this;
        
        return new Promise(function(resolve, reject) {
            let client = that.openConnection();
            client.on('error', function(err) {
                return reject(err);
            });                
                   
            client.zrange(that.getDateAsKeyForRedis(), 0, -1, 'withscores', function(err,result){
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })       
    }    

    getDateAsKeyForRedis(){
        const day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
        const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const hours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();

        return `lb_${year}${month}${day}-${hours}`;
    }
}

module.exports = RedisProvider;
