// noinspection ExceptionCaughtLocallyJS,JSUnusedGlobalSymbols

const axios = require('axios');
const {PermissionsBitField} = require('discord.js');

class VibeSync {
  /**
   * @param {Client} Client
   * @param {Object} [options]
   * @param {string} [options.baseURL]
   * @param {number} [options.timeout]
   */
  constructor(Client, options = {}) {
    if (!Client?.token) throw new Error('Bot-Token is missing. Please provide a valid Discord bot client with a token.');
    this.Client = Client;
    this.api = axios.create({
      baseURL: options.baseURL || 'https://discord.com/api/v10',
      headers: {Authorization: `Bot ${Client.token}`},
      timeout: options.timeout || 7000,
    });
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
      const response = await this.api.put(`/channels/${channelId}/voice-status`, {status});
      if (![200, 204].includes(response.status)) throw new Error(`Unexpected status code: ${response.status}`);
      return {success: true};
    } catch (error) {
      console.error('API Fehler:', error);
      throw new Error(error.response?.data?.message ? `API Error: ${error.response.data.message}` : error.request ? 'No response from API.' : `Request Error: ${error.message}`);
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
