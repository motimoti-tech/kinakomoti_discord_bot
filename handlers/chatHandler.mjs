// ▼▼▼ セリフを増やしたい時はここに追加するだけ！ ▼▼▼
const responseList = [
    { keyword: 'おはよう', reply: 'おはよう！☀' },
    { keyword: 'おやすみ', reply: '...zzz' },
    { keyword: 'よしよし', reply: 'よちよち❤' },
    { keyword: 'めぐりゅ', reply: 'ば～ぶ❤' },
    { keyword: 'めぐる', reply: 'もちみやめぐりゅ　でちゅ！' },
    { keyword: 'もち', reply: 'もちみや～～～' },
    { keyword: 'ぎゅ', reply: 'ぎゅーだよー！！' },
    { keyword: '悲', reply: 'やだよぉ...' },
    { keyword: ['疲れた', 'おつかれ', 'お疲れ'], reply: '今日はもうおちまい！' },
    { keyword: ['ねむい', '眠い'], reply: 'うとうと…' },
    { keyword: ['かわいい','可愛い'], reply: 'えへへへ～！' },
    { keyword: ['おかし','おやつ','お菓子'], reply: 'やったよ！ー！！' },
    { keyword: ['好き', 'すき'], reply: 'だいちゅき❤' },
    { keyword: ['応援', 'おうえん'], reply: 'フレ！フレ！がんばれ！君ならできりゅ！' }
];
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

/**
 * メッセージを受け取って返信を判断する関数
 * @param {import('discord.js').Message} message 
 */
export async function handleMessage(message) {
    // Bot自身の発言は無視
    if (message.author.bot) return;

    // ▼▼▼ 反応するチャンネルIDをここに全部書く！ ▼▼▼
    const allowedChannels = [
        '1468953901721063446',  
        '1271671804448084008'   
    ];

    // 「許可リスト」の中に、メッセージが投稿されたチャンネルIDが含まれていなければ無視
    if (!allowedChannels.includes(message.channel.id)) return;
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    for (const item of responseList) {
        // ... (以下、返信ロジックはそのまま) ...
        let isMatch = false;

        if (Array.isArray(item.keyword)) {
            isMatch = item.keyword.some(k => message.content.includes(k));
        } else {
            isMatch = message.content.includes(item.keyword);
        }

        if (isMatch) {
            try {
                await message.reply(item.reply);
                console.log(`💬 反応しました: "${item.keyword}" -> ${message.author.tag}`);
                return;
            } catch (error) {
                console.error('❌ 返信エラー:', error);
            }
        }
    }
}