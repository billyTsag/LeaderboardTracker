const MongoClient = require("mongodb");


class MongoProvider {
    constructor(url, dbName, collection) {
        this.url = url;
        this.db = dbName;
        this.collection = collection;
    }

    retrieveDocuments() {
        const that = this; // https://stackoverflow.com/questions/34930771/why-is-this-undefined-inside-class-method-when-using-promises
        return new Promise(function (resolve, reject) {
            MongoClient.connect(that.url, { useUnifiedTopology: true }, function (err, db) {
                if (err) {
                    return reject(err);
                }
                db.db(that.dbName).collection(that.collection).find({}).toArray(function (err, result) {     
                    if (err) {
                        return reject(err);
                    }                          
                    resolve(result);                    
                });
            });
        });
    }
}

module.exports = MongoProvider;
