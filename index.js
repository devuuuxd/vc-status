// noinspection ExceptionCaughtLocallyJS,JSUnusedGlobalSymbols

const {PermissionsBitField} = require('discord.js');

class VibeSync {
  /**
   * @param {Client} Client
   */
  constructor(Client) {
    if (!Client?.token) throw new Error('Bot-Token is missing. Please provide a valid Discord bot client with a token.');
    this.Client = Client;
  }

  /**
   * Checks if the bot has the required permissions to manage the voice channel.
   * @private
   * @param {String} channelId
   */
  async _checkPermissions(channelId) {
    let channel = this.Client.channels.cache.get(channelId) || await this.Client.channels.fetch(channelId).catch(() => null);
    if (!channel) throw new Error(`Channel ${channelId} not found or could not be fetched.`);
    if (channel.type !== 2) throw new Error(`Channel ${channelId} is not a voice channel.`);
    const permissions = channel.permissionsFor(channel.guild.members.me);
    if (!permissions || !permissions.has(PermissionsBitField.Flags.ManageChannels)) throw new Error('Missing MANAGE_CHANNELS permission.');
  }

  /**
   * Sets the voice status of a channel.
   * @param {String} channelId
   * @param {String} status
   * @returns {Promise<{success: boolean}>}
   */
  async setVoiceStatus(channelId, status = '') {
    await this._checkPermissions(channelId);
    try {
      const response = await this.Client.rest.put(`/channels/${channelId}/voice-status`, {body: {status}});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || 'Unexpected error'}`);
      }
      return {success: true};
    } catch (error) {
      console.error('API Fehler:', error);
      throw new Error(error?.message || 'Unexpected error while setting voice status');
    }
  }

  /**
   * Resets the voice status of a channel.
   * @param {String} channelId
   * @returns {Promise<{success: boolean}>}
   */
  async resetVoiceStatus(channelId) {
    return this.setVoiceStatus(channelId, '');
  }
}

module.exports = {VibeSync};
