import client from './main/structures/new/clientInit';
import config from 'config';
import path from 'path';
import { MongoClient } from 'mongodb';
import mongoProvider from './main/structures/new/mongoProvider'

var commandPath = path.join(__dirname, 'main/commands')

console.log(commandPath)

client.registry
    .registerDefaults()
    .registerGroups([
        ['scraping', 'Scraping Commands'],
    ])
    .registerCommandsIn(commandPath)

client.setProvider( MongoClient.connect(config.bot.mongoURI).then(db => new mongoProvider(db)) )

client.login(config.bot.token);