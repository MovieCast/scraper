import mongoose from 'mongoose';

const database = require('config').get('database');

// Build the connection uri
let uri = 'mongodb://'
if (database.username && database.password) {
  uri += `${database.username}:${database.password}@`
}
uri += `${database.host}:${database.port}/${database.name}`

// Connect to mongo db using mongoose
mongoose.Promise = global.Promise
mongoose.connect(uri, {
  useMongoClient: true
}).catch(err => {
    console.error(err);
    //process.exit(1);
})

mongoose.connection.once('open', () => {
    console.log(`Connected to ${uri}`);
});