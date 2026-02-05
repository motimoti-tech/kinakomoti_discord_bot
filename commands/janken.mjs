import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('janken')
    .setDescription('じゃんけんで勝負！');

export async function execute(interaction) {
    // 1. ボタンを作る
    const rock = new ButtonBuilder()
        .setCustomId('rock')
        .setEmoji('✊')
        .setLabel('グー')
        .setStyle(ButtonStyle.Primary);

    const scissors = new ButtonBuilder()
        .setCustomId('scissors')
        .setEmoji('✌')
        .setLabel('チョキ')
        .setStyle(ButtonStyle.Primary);

    const paper = new ButtonBuilder()
        .setCustomId('paper')
        .setEmoji('✋')
        .setLabel('パー')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(rock, scissors, paper);

    // 2. 最初のメッセージを送信
    const response = await interaction.reply({
        content: 'じゃんけん...',
        components: [row],
    });

    // 3. ボタンの監視を開始（勝負がつくまでループ）
    // 自分(interaction.user.id)しか押せないようにフィルターをかける
    const collector = response.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60000, // 60秒でタイムアウト
    });

    collector.on('collect', async (i) => {
        // --- ここから勝負のロジック ---
        const hands = { rock: 0, scissors: 1, paper: 2 };
        const userHandStr = i.customId;
        const userHandVal = hands[userHandStr];
        const botHandVal = Math.floor(Math.random() * 3); // 0:グー, 1:チョキ, 2:パー
        
        // 絵文字と日本語の準備
        const handEmojis = ['✊', '✌', '✋'];
        
        // 勝敗判定: (Bot - User + 3) % 3 
        // 0=あいこ, 1=ユーザー勝ち, 2=Bot勝ち
        const resultVal = (botHandVal - userHandVal + 3) % 3;

        // 結果テキスト
        let resultMessage = '';
        let isFinish = false;

        if (resultVal === 0) {
            // あいこ
            resultMessage = `You：${handEmojis[userHandVal]} vs もちみや：${handEmojis[botHandVal]}\n\n**あいこで...**`;
        } else if (resultVal === 1) {
            // 勝ち
            resultMessage = `You：${handEmojis[userHandVal]} vs もちみや：${handEmojis[botHandVal]}\n\n**ぷろでゅーしゃーの勝ちだよー！🎉**`;
            isFinish = true;
        } else {
            // 負け
            resultMessage = `You：${handEmojis[userHandVal]} vs もちみや：${handEmojis[botHandVal]}\n\n**わたしの勝ちだよー！😤**`;
            isFinish = true;
        }

        // --- 画面を更新 ---
        
        if (isFinish) {
            // 勝負がついたらボタンを無効化して終了
            const disabledRow = new ActionRowBuilder().addComponents(
                rock.setDisabled(true).setStyle(ButtonStyle.Secondary),
                scissors.setDisabled(true).setStyle(ButtonStyle.Secondary),
                paper.setDisabled(true).setStyle(ButtonStyle.Secondary)
            );
            
            await i.update({
                content: resultMessage,
                components: [disabledRow]
            });
            collector.stop(); // 監視終了
        } else {
            // あいこの場合は、メッセージを更新してもう一度選ばせる
            await i.update({
                content: resultMessage,
                components: [row] // ボタンは有効なまま
            });
            // ここでループ（次のcollectを待つ）
        }
    });

    collector.on('end', collected => {
        // タイムアウト時の処理（ボタンが押されずに終わった場合）
        if (collected.size === 0) {
             interaction.editReply({ content: '時間切れだよー！', components: [] }).catch(() => {});
        }
    });
}