const Discord = require('discord.js');
const config = require('./config.json')
const botData = require('./JSONfiles/botData.json')
const perms = require('./JSONfiles/perms.json')
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN)

client.on("ready", () => {
    console.log("Bot launch successful...")
    client.user.setGame(`!commands`)
    if (client.guilds.size === 1) {
        console.log(`Currently connected to ${client.guilds.size} Discord server`)
    } else {
        console.log(`Currently connected to ${client.guilds.size} Discord Servers`)
    }
});


client.on("message", async message => {

    // Stops bot from 
    if(message.author.bot || !message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    // ----------------------------------
    // General Commands
    // ----------------------------------

    if (message.content.startsWith(config.prefix + 'scrimtimes')) {
        message.reply("Check your DM's :wink:")
        message.author.send("AU Times")
        for (i in botData.h1TimesAU) {
            message.author.send("   " + botData.h1TimesAU[i])
        } 
        message.author.send("NZ Times")
        for (i in botData.h1TimesNZ) {
            message.author.send("   " + botData.h1TimesNZ[i])
        } 
    } else
    //---------------------------------------------------------------
    if (message.content.startsWith(config.prefix + 'scrimremind')) {
        message.delete(1000);
        message.channel.send("<@&380939853635911680> Reminder that there are scrims tonight! use !scrimtimes to get a full list of times.")
    } else
    //---------------------------------------------------------------
    if(message.content.startsWith(config.prefix + 'botinfo')) {
        message.channel.send("Dv8_Bot is the main management bot created for the Team Deviate Discord server. Developed by <@214662509175504896>")
    }
    //---------------------------------------------------------------


    // ----------------------------------
    // Owner and Admin Commands
    // ----------------------------------

    if (message.content.startsWith(config.prefix + 'ping') && message.author.id == config.ownerID) {
        const m = await message.channel.send("Calculating ping...");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    } else if (message.content.startsWith(config.prefix + 'ping') && message.author.id != config.ownerID) {
        message.reply("Sorry! You are not allowed to use that command! Contact MegaGG#5621")
    } else
    //---------------------------------------------------------------
    if (message.content.startsWith(config.prefix + 'say') && message.author.id == config.ownerID || message.member.roles.has()) {
        let text = args.slice(0).join(" ")
        message.delete().catch(O_o=>{});
        message.channel.send(text)
    } else 
    //---------------------------------------------------------------
    if (message.content.startsWith(config.prefix + 'kick')) {
        // This command must be limited to mods and admins. In this example we just hardcode the role names.
        // Please read on Array.some() to understand this bit: 
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
        if(!message.member.hasPermission(perms.kick))
            return message.reply("Sorry, you don't have permissions to use this!");
  
        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        let member = message.mentions.members.first();
        if(!member)
        return message.reply("Please mention a valid member of this server");
        if(!member.kickable) 
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
  
        // slice(1) removes the first part, which here should be the user mention!
        let reason = args.slice(1).join(' ');
        if(!reason)
            return message.reply("Please indicate a reason for the kick!");
  
        // Now, time for a swift kick in the nuts!
        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    }
    //---------------------------------------------------------------

});
