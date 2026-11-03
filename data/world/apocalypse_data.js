/* ============================================================
   倒吊人 · 末日 5 天（第七段）
   ============================================================ */
(function () {
  const canon = [
    { id: 'apoc-e01', volumeId: 7, volumeTitle: '倒吊人', index: 1, dayStart: 1, chStart: 1, chEnd: 25, dateLabel: '1352-03 / 第 1–25 章', title: '末日倒计时', location: '贝克兰德废墟', cast: ['亚当', '奥黛丽'], canon: '末日进入倒计时。贝克兰德的天空裂开一道缝，缝后面没有星星。', newspaper: '《末日纪事》：天空出现“裂缝”；教会称“日蚀”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'apoc-e02', volumeId: 7, volumeTitle: '倒吊人', index: 2, dayStart: 3, chStart: 26, chEnd: 55, dateLabel: '1352-03 / 第 26–55 章', title: '门先生', location: '星界', cast: ['门先生', '亚当'], canon: '门先生在星界等你。祂说，门后有一个位置，一直空着。', newspaper: '《末日纪事》：多名非凡者称梦见“一扇没有把手的门”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'apoc-e03', volumeId: 7, volumeTitle: '倒吊人', index: 3, dayStart: 5, chStart: 56, chEnd: 87, dateLabel: '1352-03 / 第 56–87 章', title: '倒吊人', location: '黑夜教堂', cast: ['亚当', '阿尔杰'], canon: '有人把自己吊在十字架上，替所有人承担了代价。你抬头，看见命运被吊在半空。', newspaper: '《末日纪事》：黑夜教堂出现“倒吊的影子”；教会封锁街区。', interventions: ['旁观', '接触', '介入'] }
  ];

  window.OC_APOCALYPSE = {
    id: 'apocalypse', name: '末日', paper: '末日纪事', dateLabel: '1352 年 3 月', maxDay: 60, storyMax: 5,
    intro: '天空裂开了。你从神弃之地走出来，发现末日不是一场爆炸，而是一扇慢慢打开的门。',
    locations: [
      { id: 'ruins', name: '贝克兰德废墟', sub: '裂缝、灰烬和不肯离开的人', icon: 'factory', color: '#8e2f3c' },
      { id: 'star', name: '星界', sub: '没有重力的门与门后的眼睛', icon: 'moon', color: '#6a536f' },
      { id: 'church', name: '黑夜教堂', sub: '最后的十字架与最后的祈祷', icon: 'church', color: '#8c9894' },
      { id: 'camp', name: '难民营地', sub: '帐篷、哭声和分不完的面包', icon: 'home', color: '#b08a4a' },
      { id: 'door', name: '门后', sub: '一切开始的地方', icon: 'map', color: '#3e4a52' }
    ],
    npcLocations: { ruins: ['adam', 'audrey'], star: ['door', 'adam'], church: ['alger'], camp: ['audrey'], door: ['door', 'adam'] },
    npcs: [
      { id: 'adam', name: '亚当', role: '观众 / 命运的安排者', color: '#c9a35c', desc: '他说话很慢，像在写一个已经写好的剧本。他看你的眼神像在看一个变量。' },
      { id: 'door', name: '门先生', role: '门后的存在', color: '#6a536f', desc: '祂没有脸，但你总觉得祂在笑。祂说门后有一个位置，一直空着。' }
    ],
    actions: {
      ruins: [
        { id: 'help', label: '从废墟里救人', desc: '能救一个是一个。', effects: { humanity: 2, health: -1 }, text: '你从瓦砾下拖出一个人。他问你叫什么，你说了一个假名。' },
        { id: 'adam', label: '和亚当说话', desc: '他在废墟上摆了一盘棋。', effects: { relations: { adam: 1 }, insight: 2 }, text: '亚当说：“你以为你在选择。其实你只是在读我写好的台词。”' },
        { id: 'audrey', label: '找奥黛丽', desc: '她在组织撤离。', effects: { relations: { audrey: 1 }, humanity: 1 }, text: '奥黛丽说：“我不需要你拯救世界。我需要你救这一车人。”' },
        { id: 'wander', label: '在废墟里走走', desc: '听末日里的声音。', effects: {}, ambient: true, text: '废墟里有人在唱歌。调子像廷根的教堂赞美诗。' }
      ],
      star: [
        { id: 'door', label: '和门先生对话', desc: '祂在门后等你。', effects: { relations: { door: 1 }, madness: 2, insight: 2 }, text: '门先生说：“你怕的不是门。你怕的是门后没有人在等你。”' },
        { id: 'adam', label: '问亚当剧本的结局', desc: '他可能不会说实话。', effects: { relations: { adam: 1 }, insight: 1, madness: 1 }, text: '亚当说：“结局已经写了。但你可以选择用什么表情读完。”' },
        { id: 'close', label: '试着关上星界的门', desc: '用你的灵性，换一点时间。', check: { attr: 'spirit', dc: 11 }, effects: { humanity: 2, madness: 1 }, fail: { health: -3, madness: 2 }, text: '你把门推回一条缝。门后传来很多人的声音，其中有一个像你。' }
      ],
      church: [
        { id: 'pray', label: '做最后一次祈祷', desc: '不祈求胜利，只求少死几个人。', effects: { humanity: 2, madness: -1 }, text: '彩窗已经碎了。你坐在碎玻璃里，什么也没求。' },
        { id: 'alger', label: '和阿尔杰说话', desc: '他准备去一个很远的地方。', effects: { relations: { alger: 1 }, insight: 1 }, text: '阿尔杰说：“如果我没回来，塔罗会还在。”' },
        { id: 'cross', label: '走向十字架', desc: '看看谁被吊在上面。', effects: { madness: 2, insight: 2 }, text: '十字架上的人没有脸。你听见自己的声音在说：“还不到时候。”' }
      ],
      camp: [
        { id: 'food', label: '帮忙分面包', desc: '面包不够，但队伍很长。', effects: { humanity: 2, money: -5 }, text: '你把自己的那份掰成两半。没有人问你为什么不吃。' },
        { id: 'audrey', label: '和奥黛丽安排撤离', desc: '她需要一个人维持秩序。', effects: { relations: { audrey: 1 }, reputation: 1 }, text: '奥黛丽把名单交给你。你看见上面有很多你认识的名字。' },
        { id: 'rest', label: '在帐篷里坐一会儿', desc: '末日也需要睡觉。', effects: { health: 2, madness: -1 }, text: '你梦见源堡。青铜长桌上有一张空椅子。' }
      ],
      door: [
        { id: 'open', label: '打开门', desc: '门后没有光，只有更多的门。', check: { attr: 'spirit', dc: 12 }, effects: { insight: 3, madness: 3 }, fail: { health: -4, madness: 2 }, text: '门开了。你看见一座灰雾中的宫殿，和一张写着“愚者”的椅子。' },
        { id: 'door', label: '问门先生要什么', desc: '祂一直在等这句话。', effects: { relations: { door: 1 }, insight: 2, madness: 1 }, text: '门先生说：“我要一个愿意替我关门的人。”' },
        { id: 'adam', label: '让亚当先走', desc: '你不确定他会不会回来。', effects: { relations: { adam: 1 }, humanity: 1 }, text: '亚当看了你一眼，走进门里。门没有关。' }
      ]
    },
    commissions: [
      { id: 'rescue', title: '废墟救援', location: 'ruins', days: 2, check: { attr: 'body', dc: 9 }, reward: 10, humanity: 2, desc: '废墟下还有人。救援队需要一双不怕灰的手。' },
      { id: 'star', title: '星界观测', location: 'star', days: 3, check: { attr: 'insight', dc: 11 }, reward: 15, madness: 1, desc: '有人要你记录星界裂缝的变化。' },
      { id: 'camp', title: '难民营的面包', location: 'camp', days: 2, check: { attr: 'social', dc: 9 }, reward: 8, humanity: 1, desc: '面包不够。你需要让队伍不失控。' },
      { id: 'cross', title: '教堂的十字架', location: 'church', days: 4, check: { attr: 'spirit', dc: 10 }, reward: 18, insight: 1, desc: '十字架上出现了一个不该出现的影子。' }
    ],
    ambient: [
      { id: 'a1', location: 'ruins', text: '一个孩子问你：“世界会结束吗？”', choices: [{ label: '说不会', effects: { humanity: 1 } }, { label: '说会', effects: { madness: 1, insight: 1 } }] },
      { id: 'a2', location: 'star', text: '门先生在你耳边说：“你可以不选。”', choices: [{ label: '偏要选', effects: { madness: 1, insight: 2 } }, { label: '沉默', effects: { spirit: 1 } }] },
      { id: 'a3', location: 'church', text: '十字架下有一封没写完的信。收件人是你。', choices: [{ label: '读完', effects: { humanity: 1, madness: 1 } }, { label: '烧掉', effects: { health: 1 } }] },
      { id: 'a4', location: 'camp', text: '奥黛丽说：“如果只能救一半的人，你救哪一半？”', choices: [{ label: '救孩子', effects: { humanity: 2 } }, { label: '救能干活的人', effects: { reputation: 1, humanity: -1 } }] }
    ],
    endings: {
      ordinary: [
        { id: 'apoc_rescuer', title: '末日救援者', headline: '《废墟救援队称“还能听见敲击声”》', cond: { humanity: 8 }, region: 'apocalypse', text: '你在废墟里救了很多人。末日结束后，你没有接受采访。你只是继续在废墟里走，听有没有人敲墙。' },
        { id: 'apoc_witness', title: '末日的见证者', headline: '《本报记者出版〈末日手记〉，三分之一内容被涂黑》', cond: { insight: 11 }, region: 'apocalypse', text: '你记录下末日里每一个名字。书出版时被删掉很多页。你把原稿藏在源堡的灰雾里。' },
        { id: 'apoc_daily', title: '末日里的普通人', headline: '《一个普通幸存者的日常：面包、灰烬和偶尔的太阳》', cond: {}, region: 'apocalypse', text: '你没有阻止末日，也没有成为英雄。你只是活了下来。末日结束后，你回到贝克兰德，发现家门口的路灯还亮着。' }
      ],
      core: [
        { id: 'apoc_hanged', title: '倒吊人的见证者', headline: '《教会称“倒吊的影子”只是光学现象》', cond: { flags: ['saw_klein'], humanity: 6 }, region: 'apocalypse', text: '你看见有人把自己吊在十字架上。你没有拍照，也没有祈祷。你只是记住了那张脸。末日结束后，你每年都会点一根蜡烛。' }
      ]
    },
    canon
  };
})();
