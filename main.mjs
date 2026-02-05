// main.mjs
import { Client, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';
// 作成したコマンドファイルを読み込み
import * as illuminationCommand from './commands/illumination.mjs';
import * as jankenCommand from './commands/janken.mjs';
import { handleMessage } from './handlers/chatHandler.mjs';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent, // メッセージ内容を取得するために必要
        GatewayIntentBits.GuildMessages, // メッセージの受信に必要
    ],
});

// コマンド登録処理
client.commands = new Collection();
client.commands.set(illuminationCommand.data.name, illuminationCommand);
client.commands.set(jankenCommand.data.name, jankenCommand);

// Botが起動したときの処理
client.once('ready', () => {
    console.log(`🎉 ${client.user.tag} が正常に起動しました！`);
    client.user.setActivity('みんなのことがだいちゅき❤', { 
        type: ActivityType.Custom, 
        state: 'みんなのことがだいちゅき❤'  // ← ここに表示したい文字を入れるのがコツです！
    });
    
    // コマンドをDiscordに登録
    const commands = [
        illuminationCommand.data.toJSON(),
        jankenCommand.data.toJSON()
    ];
    client.application.commands.set(commands)
        .then(() => console.log('✅ スラッシュコマンド (/illumination) を登録しました！'))
        .then(() => console.log('✅ じゃんけんコマンド (/janken) を登録しました！'))
        .catch(console.error);
});

// スラッシュコマンドが使われたときの処理
client.on('interactionCreate', async interaction => {
    // コマンド以外は無視
    if (!interaction.isChatInputCommand()) return;

    // 実行されたコマンドを探す
    const command = client.commands.get(interaction.commandName);

    // 知らないコマンドなら無視
    if (!command) {
        console.error(`${interaction.commandName} というコマンドは見つかりませんでした。`);
        return;
    }

    try {
        // コマンドを実行！
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        // ▼▼▼ ここが重要！エラー処理の強化 ▼▼▼
        // もしすでに「考え中...」や「返信済み」の状態なら、replyではなくfollowUpを使う
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ エラーが発生しました', ephemeral: true }).catch(e => console.error(e));
        } else {
            // まだ何も返信していないなら reply を使う
            await interaction.reply({ content: '❌ エラーが発生しました', ephemeral: true }).catch(e => console.error(e));
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    }
});

// メッセージ受信時の処理 
client.on('messageCreate', (message) => {
    // chatHandler.js で処理
    handleMessage(message);
});

// 以下、Webサーバー設定（Render 用)
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