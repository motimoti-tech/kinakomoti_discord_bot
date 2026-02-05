// commands/illumination.mjs
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('illumination') // コマンド名（小文字のみ）
    .setDescription('輝きを皆に届けよう！'); // コマンドの説明

export async function execute(interaction) {
    // コマンドが実行されたときの処理
    await interaction.reply('イルミネーション！！スターズ！！✨🌟✨');
    console.log(`📝 ${interaction.user.tag} が /illumination コマンドを使用`);
}