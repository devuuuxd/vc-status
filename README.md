# VibeSync

`VibeSync` is a Node.js library to update the status of a Discord voice channel. It simplifies setting and resetting custom status messages for voice channels using the Discord API.

## Installation

Install `VibeSync` with:

```bash
npm install vibesync
```
# Usage
## Import and Initialization
Import the VibeSync class and initialize it with your Discord bot client:
```js
const { Client, GatewayIntentBits } = require('discord.js');
const { VibeSync } = require('vibesync');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const vibeSync = new VibeSync(client);
```
## Set Voice Channel Status
Use setVoiceStatus to set a custom status for a voice channel:
```js
const channelId = 'CHANNEL_ID_HERE';
const status = 'CUSTOM_STATUS_HERE';

vibeSync.setVoiceStatus(channelId, status)
    .then(() => console.log('Voice channel status updated successfully'))
    .catch(err => console.error('Failed to update voice channel status:', err));
```

## Reset Voice Channel Status
Use resetVoiceStatus to reset the status of a voice channel:
```js
const channelId = 'CHANNEL_ID_HERE';

vibeSync.resetVoiceStatus(channelId)
    .then(() => console.log('Voice channel status reset successfully'))
    .catch(err => console.error('Failed to reset voice channel status:', err));
```

# Example
A complete example using VibeSync:
```js
const { Client, GatewayIntentBits } = require('discord.js');
const { VibeSync } = require('vibesync');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const vibeSync = new VibeSync(client);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const CHANNEL_ID = 'CHANNEL_ID_HERE';
    const channel = client.channels.cache.get(CHANNEL_ID);

    if (!channel) {
        await message.reply('❌ Voice channel not found.');
        return;
    }

    if (message.content.startsWith('!vcstatus')) {
        const args = message.content.split(' ').slice(1);
        const status = args.join(' ');

        if (!status) {
            await message.reply('⚠️ Please provide a status message.');
            return;
        }

        try {
            await vibeSync.setVoiceStatus(CHANNEL_ID, status);
            await message.reply('✅ Voice channel status updated.');
        } catch (err) {
            console.error('Failed to update voice channel status:', err);
            await message.reply('❌ Failed to update status. Check console for errors.');
        }
    }
    if (message.content.startsWith('!progressbar')) {
        try {
            await vibeSync.setVoiceStatus(CHANNEL_ID, '▱▱▱▱▱▱');
        } catch (err) {
            console.error('Failed to update voice channel status:', err);
        }
        setTimeout(() => {
            vibeSync.setVoiceStatus(CHANNEL_ID, '▰▱▱▱▱▱');
        }, 1000);
        setTimeout(() => {
            vibeSync.setVoiceStatus(CHANNEL_ID, '▰▰▱▱▱▱');
        }, 2000);
        setTimeout(() => {
            vibeSync.setVoiceStatus(CHANNEL_ID, '▰▰▰▱▱▱');
        }, 3000);
        setTimeout(() => {
            vibeSync.setVoiceStatus(CHANNEL_ID, '▰▰▰▰▱▱');
        }, 4000);
        setTimeout(() => {
            vibeSync.setVoiceStatus(CHANNEL_ID, '▰▰▰▰▰▱');
        }, 5000);
        setTimeout(() => {
            vibeSync.setVoiceStatus(CHANNEL_ID, '▰▰▰▰▰▰');
        }, 6000);
        setTimeout(() => {
            vibeSync.resetVoiceStatus(CHANNEL_ID);
        }, 7000);
    }
    if (message.content === '!vcreset') {
        try {
            await vibeSync.resetVoiceStatus(CHANNEL_ID);
            await message.reply('✅ Voice status reset.');
        } catch (err) {
            console.error('❌ Voice status couldn\'t be reset:', err);
            await message.reply('❌ Voice status couldn\'t be reset.');
        }
    }
});

client.login('TOKEN_HERE');
```

# Error Handling
The setVoiceStatus method distinguishes between:
- API errors: Errors returned by the Discord API.
- No response: Cases where no response is received from the API.
- Request setup errors: Issues with creating the request.
Errors are logged to the console.
  
# Contributing
### Feel free to contribute to `VibeSync` by submitting issues or pull requests. Your contributions are welcome!

# License
### `VibeSync` is licensed under the MIT License. See the LICENSE file for more information.

Feel free to adjust the examples and instructions according to your specific requirements. Let me know if you need any changes or additional details!
Adjust the examples and instructions as needed for your requirements!
