const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const path = require('path');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content.indexOf('vitas') >= 0) {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          // To play a file, we need to give an absolute path to it
          const dispatcher = connection.playFile(path.resolve('./vitasmusic.mp3'));
          dispatcher.on('end', () => {
            // The song has finished
            message.member.voiceChannel.leave();
          });

          dispatcher.on('error', e => {
            // Catch any errors that may arise
            console.log(e);
          });

          dispatcher.setVolume(0.7); // Set the volume back to 100%
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});

client.login(auth.token);