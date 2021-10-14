// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('../config.json');

// collections
const generated = new Set();

// export command
module.exports = {
    
    // command name
	name: 'gen',

    // command description
	description: 'Generate a specified service, if stocked.',

    // command
	execute(message) {

        // if gen channel
        if (message.channel.id === config.genChannel) {

            // if generated before
            if (generated.has(message.author.id)) {

                // send message to channel
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor(color.red)
                    .setTitle('Cooldown')
                    .setDescription('Please wait before executing another command!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                // cancel
                return;

            // if not generated before
            } else {

                // split message content
                const messageArray = message.content.split(' ');

                // args
                const args = messageArray.slice(1);

                // if the service is missing
                if (!args[0]) {

                    // send message to channel
                    message.channel.send(

                        // embed
                        new Discord.MessageEmbed()
                        .setColor(config.color.red)
                        .setTitle('Missing parameters')
                        .setDescription('You need to give a service name!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setTimestamp()
                    );

                    // cancel
                    return;
                };

                // stock files path
                const filePath = `${__dirname}/../stock/${args[0]}.txt`;

                // read the file
                fs.readFile(filePath, function (error, data) {

                    // if no error
                    if (!error) {

                        // text file content to string
                        data = data.toString();

                        // find position
                        const position = data.toString().indexOf('\n');

                        // find first line
                        const firstLine = data.split('\n')[0];

                        // if cannot find first line
                        if (position === -1) {

                            // send message to channel
                            message.channel.send(

                                // embed
                                new Discord.MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Gen error!')
                                .setDescription(`I do not find the \`${args[0]}\` service in my stock!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );

                            // cancel
                            return;
                        };

                        // send the embed and the copy-paste to the message author
                        message.author.send(

                            //embed
                            new Discord.MessageEmbed()
                            .setColor(config.color.green)
                            .setTitle('Generated account')
                            .addField('Service', `${args[0]}`)
                            .addField('Account/Data', `\`\`\`${firstLine}\`\`\``)
                            .setTimestamp()
                        ).then(message.author.send('Here is your copy+paste:')).then(message.author.send(`\`${firstLine}\``));

                        // if the service generated successful (position)
                        if (position !== -1) {

                            // text file to string and change position
                            data = data.substr(position + 1);

                            // write file
                            fs.writeFile(filePath, data, function (error) {

                                // send message to channel
                                message.channel.send(

                                    // embed
                                    new Discord.MessageEmbed()
                                    .setColor(config.color.green)
                                    .setTitle('Account generated!')
                                    .setDescription(`Check your DMs ${message.author}! *If you do not recieved the message, please unlock your DMs!*`)
                                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                    .setTimestamp()
                                );

                                // add the message author to cooldown collection
                                generated.add(message.author.id);

                                // set cooldown (in millisec)
                                setTimeout(() => {

                                    // remove the message author from cooldown collection after timeout
                                    generated.delete(message.author.id);
                                }, config.genCooldown);

                                // if error
                                if (error) {

                                    // write to console
                                    console.log(error);
                                };
                            });

                        // if no lines
                        } else {

                            // send message to channel
                            message.channel.send(

                                // embed
                                new Discord.MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Gen error!')
                                .setDescription(`I do not find any accounts in \`${args[0]}\` service!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );

                            // cancel
                            return;
                        };

                    // if error
                    } else {

                        // send message to channel
                        message.channel.send(

                            // embed
                            new Discord.MessageEmbed()
                            .setColor(config.color.red)
                            .setTitle('Gen error!')
                            .setDescription(`I do not find the \`${args[0]}\` service in my stock!`)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                            .setTimestamp()
                        );

                        // cancel
                        return;
                    };
                });
            };

        // if not gen channel
        } else {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Prohibited activity!')
                .setDescription(`You can use the ${config.prefix}gen command only in <#${config.genChannel}> channel!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	},
};