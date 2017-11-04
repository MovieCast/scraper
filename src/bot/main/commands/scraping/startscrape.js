import { Command } from 'discord.js-commando';

module.exports = class StartScrapeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "startscrape",
            group: "scraping",
            memberName: "startscrape",
            description: "Manually start the scraping process.",
            examples: ["startscrape", 'scrapestart'],
        })
    }

    run(msg) {
        var trueFalse = [true, false]
        var randomTrueFalse = trueFalse[Math.floor(Math.random() * trueFalse.length)]
        switch(randomTrueFalse) {
            case true:
                const embed = new this.client.methods.embed()
                    .setAuthor('Scraping Process - Started')
                    .setTimestamp()
                    .setDescription('The scraping process has been begun!')
                    .setColor([0, 255, 0])
                    .setFooter('MovieCast')
                return msg.embed(embed);
            break;
            case false:
                const embed = new this.client.methods.embed()
                    .setAuthor('Scraping Process - Failed')
                    .setTimestamp()
                    .setDescription('The scraping process has failed with reason: **Reason here, this is a fake for now so yeah.**')
                    .setColor([255, 0, 0])
                    .setFooter('MovieCast')
                return msg.embed(embed);
            break;
        }
    }
}
