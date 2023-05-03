import { readFile } from 'fs/promises';
import { getInput, setFailed } from '@actions/core';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

async function run(): Promise<void> {
  try {
    const TOKEN: string = getInput('discord_token');
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    const CHANNEL_ID: string = getInput('discord_channel');
    let message: string = "";
    if (process.env.GITHUB_EVENT_PATH) {
      const data = await readFile(process.env.GITHUB_EVENT_PATH, 'utf8')
      const issue = JSON.parse(data)['issue'];
      message = `Issue: ${issue.title}\nCreated By: ${issue.user.login}\n${issue.url}`;
    } else {
      message = getInput('message');
    }
    if (!message) {
      setFailed('No issue or message');
      return;
    }
    await rest.post(Routes.channelMessages(CHANNEL_ID), {
      body: {
        content: message,
      },
    });

  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run()
