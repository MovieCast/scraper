import { CommandoClient } from 'discord.js-commando';
import Discord from 'discord.js'; 

export default class MovieCastClient extends CommandoClient {
    constructor(options = {}) {
        super(options)
        
        this.methods = {
            collection: Discord.Collection,
            embed: Discord.MessageEmbed,
            webHook: Discord.WebhookClient
        };
    }
}