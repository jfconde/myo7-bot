const Discord = require('discord.js');

const getConnection = require('./db').getConnection;
const withPrefix = require('./utils').withPrefix;
const Log = require('./log');

const getAuthorDisplayName = async (msg) => {
    const member = await msg.guild.member(msg.author);
    return member ? (member.nick || member.nickname) : msg.author.username;
}

class Bot {
    dbConn = null;
    bot = null;
    _token = null;

    constructor(token) {
        this.dbConn = getConnection();
        this.bot = new Discord.Client();
        this._token = token;

        this.setupBot(this.bot);
    }

    start() {
        this.bot.login(this._token)
    }

    setupBot(bot) {
        bot.on('ready', this.onBotReady.bind(this));
        bot.on('message', this.onBotMessage.bind(this));
    }

    onBotReady() {
        Log.info('MyO7 Bot :: Now connected.');
    }

    async onBotMessage(msg) {
        if (msg.author.bot) {
            return;
        }
        Log.info(`Received Message from ${msg.author.id}. Content: ${msg.content}`);

        await this.saveUser(msg.author, await getAuthorDisplayName(msg));

        if (msg.content === 'ping') {
            msg.reply('pong');
            msg.channel.send('pong');
        } else if (msg.content.startsWith('!kick')) {
            if (msg.mentions.users.size) {
                const taggedUser = msg.mentions.users.first();
                msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
            } else {
                msg.reply('Please tag a valid user!');
            }
        }
    }

    async saveUser(user, displayName) {
        const rows = await this.dbConn.select('id').from(withPrefix('users')).limit(1);

        if (!rows.length) {
            await this.dbConn.insert({
                id: user.id,
                name: displayName,
                status: 'Hey there! I\'m using MyO7!'
            }).into(withPrefix('users'));
        } else {
            const row = rows[0];
            if (row.name !== displayName) {
                // Update the persisted username with the last one.
                await (this.dbConn(withPrefix('users')).where({id: user.id}).update({
                    name: displayName
                }));
            }
        }
    }
}

module.exports = Bot;