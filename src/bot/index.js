import client from './main/structures/new/clientInit';
import config from 'config';
import path from 'path';
import { MongoClient } from 'mongodb';

client.registry
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'main/commands'))

client.setProvider( MongoClient.connect(config.bot.mongoURI).then(db => new mongoProvider(db)) )

client.login(config.bot.token);