// handlers/chatHandler.js

// ▼▼▼ セリフを増やしたい時はここに追加するだけ！ ▼▼▼
const responseList = [
    { keyword: 'おはよう', reply: 'おはようございます！☀' },
    { keyword: 'きなこもち', reply: 'おいしいですよね！🍡' },
    { keyword: '疲れた', reply: 'お疲れ様です、少し休憩しましょう🍵' },
    { keyword: '好き', reply: '照れますね…///' },
];
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

/**
 * メッセージを受け取って返信を判断する関数
 * @param {import('discord.js').Message} message 
 */
export async function handleMessage(message) {
    // 1. Bot自身の発言は無視（無限ループ防止）
    if (message.author.bot) return;

    // 2. 指定したチャンネル以外は無視
    // (.envの TARGET_CHANNEL_ID と一致しない場合は帰る)
    if (message.channel.id !== process.env.TARGET_CHANNEL_ID) return;

    // 3. メッセージの内容をチェック
    // responseList の中身を順番にチェックして、キーワードが含まれていたら返信する
    for (const item of responseList) {
        // キーワードが含まれているかチェック
        if (message.content.includes(item.keyword)) {
            try {
                await message.reply(item.reply);
                console.log(`💬 反応しました: "${item.keyword}" -> ${message.author.tag}`);
                return; // 1回返信したら終了（重複反応を防ぐため）
            } catch (error) {
                console.error('❌ 返信エラー:', error);
            }
        }
    }
}