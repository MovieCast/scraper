import { CommandoClient } from 'discord.js-commando';
import Discord from 'discord.js'; 

export default class MovieCastClient extends CommandoClient {
    constructor(options = {}) {
        super(options)
        
        this.scrapeChannel = this.channels.get('337409688687607838')

        this.methods = {
            collection: Discord.Collection,
            embed: Discord.MessageEmbed,
            webHook: Discord.WebhookClient
        };
    }
}