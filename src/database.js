import {MongoClient} from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'fileshare';

export const connect = (callback) => {
    MongoClient.connect(url, (err, client) => {
        return callback(err, client.db(dbName))
    });
};
