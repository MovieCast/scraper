import MovieCastClient from '../extensions/client';
import Discord from 'discord.js';
import config from 'config';
import { createLogger } from './logger';

const client = new MovieCastClient({
    owner: config.bot.ownerID,
    commandPrefix: config.bot.prefix,
    unknownCommandResponse: false
});

const logger = createLogger(`Client`)

client.on('ready', () => logger.info(`Client ready, logged in as ${client.user.tag} (${client.user.id})`))
client.on('debug', msg => logger.debug(msg))
client.on('warn', msg => logger.warn(msg))
client.on('error', err => logger.error(err))
client.on('disconnect', () => logger.warn('Disconnected!'))
client.on('reconnecting', () => logger.warn('Reconnecting...'))

client.scrapeChannel = client.channels.get('337409688687607838')

client.methods = {
            collection: Discord.Collection,
            embed: Discord.MessageEmbed,
            webHook: Discord.WebhookClient
        };

module.exports = client;