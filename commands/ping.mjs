// commands/ping.js
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping') // コマンド名（小文字のみ）
    .setDescription('pong!と返信します'); // コマンドの説明

export async function execute(interaction) {
    // コマンドが実行されたときの処理
    await interaction.reply('🏓 pong!');
    console.log(`📝 ${interaction.user.tag} が /ping コマンドを使用`);
}