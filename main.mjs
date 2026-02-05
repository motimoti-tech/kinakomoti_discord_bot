// main.mjs
import { Client, GatewayIntentBits, Collection } from 'discord.js'; // Collectionを追加
import dotenv from 'dotenv';
import express from 'express';
// 作成したコマンドファイルを読み込み
import * as pingCommand from './commands/ping.mjs';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

// コマンドを管理する「箱」を用意
client.commands = new Collection();

// pingコマンドを「箱」に登録
client.commands.set(pingCommand.data.name, pingCommand);

client.once('ready', () => {
    console.log(`🎉 ${client.user.tag} が正常に起動しました！`);
    
    // ★ここでコマンドをDiscordに登録します（重要）
    const commands = [pingCommand.data.toJSON()];
    client.application.commands.set(commands)
        .then(() => console.log('✅ スラッシュコマンド (/ping) を登録しました！'))
        .catch(console.error);
});

// スラッシュコマンドが使われたときの処理
client.on('interactionCreate', async interaction => {
    // コマンド以外は無視
    if (!interaction.isChatInputCommand()) return;

    // 実行されたコマンドを探す
    const command = client.commands.get(interaction.commandName);

    // 知らないコマンドなら無視
    if (!command) return;

    try {
        // コマンドを実行！
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ エラーが発生しました', ephemeral: true });
    }
});

// --- 以下、Webサーバー設定（変更なし） ---
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        status: 'Bot is running! 🤖',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`🌐 Web サーバーがポート ${port} で起動しました`);
});

// ログイン
client.login(process.env.DISCORD_TOKEN);