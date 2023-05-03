import { getInput, setFailed } from '@actions/core'
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

async function run(): Promise<void> {
  try {
    const TOKEN: string = getInput('discord_token')
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    const CHANNEL_ID: string = getInput('discord_channel')
    const MESSAGE: string = getInput('message')
    await rest.post(Routes.channelMessages(CHANNEL_ID), {
      body: {
        content: MESSAGE,
      },
    });

  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
