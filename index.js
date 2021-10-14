const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("bot is online")
})

app.listen(3000, () => {
  console.log("project is ready")
})
// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('./config.json');

// create client
const client = new Discord.Client();

// const commands
client.commands = new Discord.Collection();

// load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// const commands
for (const file of commandFiles) {

    // read command file
	const command = require(`./commands/${file}`);

    // set the command
	client.commands.set(command.name, command);
};

// login with token
client.login(config.token)

// ready event
client.once('ready', () => {

    // write to console
	console.log(`I am logged in as ${client.user.tag} to Discord!`);

    // set activity
    client.user.setActivity("Bot made by TusTusDev", {
      type: "STREAMING",
      url: "https://www.twitch.tv/chillhopmusic"
    })
});

// message event // command handling
client.on('message', (message) => {
    // command without prefix
	if (!message.content.startsWith(config.prefix)) {
        // cancel
        return;
    };
    // if a bot execute a command
	if (message.author.bot) {
        // cancel
        return;
    };

    // get the args
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);

    // const command
	const command = args.shift().toLowerCase();

    // if not match
	if (!client.commands.has(command)) {

        // send message to channel
        //message.channel.send(
            
            // embed
            //new Discord.MessageEmbed()
            //.setColor(config.color.red)
            //.setTitle('Unknown command')
            //.setDescription(`Sorry, but no command match \`${command}\`!`)
            //.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            //.setTimestamp()
       // );

        // cancel
        return;
    };

    // try to executing the command
	try {

        // get command
		client.commands.get(command).execute(message, args);

    // if error
	} catch (error) {

        // write to console
		console.error(error);

        // send message to channel
		message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Error occurred!')
            .setDescription(`An error occurred in \`${command}\` command!`)
            .addField('Error', `\`\`\`js\n${error}\n\`\`\``)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	};
});
