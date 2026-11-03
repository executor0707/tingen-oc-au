/* ============================================================
   海上 · 罗思德群岛 10 天
   第三段；共享玩家、关系、存档与结局。
   ============================================================ */
(function () {
  const seaCanon = [
    { id: 'sea-e01', volumeId: 3, volumeTitle: '旅行家', index: 1, dayStart: 1, chStart: 1, chEnd: 20, dateLabel: '1350-01 / 第 1–20 章', title: '登上幽蓝复仇者号', location: '罗思德群岛港口', cast: ['阿尔杰', '达尼兹', '格尔曼'], canon: '你登上了幽蓝复仇者号。阿尔杰是船长，达尼兹是水手，格尔曼·斯帕罗是船上最安静的人。', newspaper: '《海上新闻报》：幽蓝复仇者号昨夜离港，目的地未申报。', interventions: ['旁观', '接触', '介入'] },
    { id: 'sea-e02', volumeId: 3, volumeTitle: '旅行家', index: 2, dayStart: 2, chStart: 21, chEnd: 50, dateLabel: '1350-01 / 第 21–50 章', title: '风暴眼航线', location: '风暴眼', cast: ['阿尔杰', '格尔曼'], canon: '海图上没有风暴眼的航线。阿尔杰说，愿不愿意比能不能更重要。', newspaper: '《海上新闻报》：一艘渔船称在风暴眼附近看见“第二个月亮”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'sea-e03', volumeId: 3, volumeTitle: '旅行家', index: 3, dayStart: 4, chStart: 51, chEnd: 80, dateLabel: '1350-01 / 第 51–80 章', title: '黑市与植物学家', location: '罗思德群岛黑市', cast: ['弗兰克', '达尼兹'], canon: '弗兰克在黑市卖一些会动的东西。他说自己只是植物学家。', newspaper: '《海上新闻报》：黑市出现一株“会认人”的藤蔓，买家拒绝退货。', interventions: ['旁观', '接触', '介入'] },
    { id: 'sea-e04', volumeId: 3, volumeTitle: '旅行家', index: 4, dayStart: 6, chStart: 81, chEnd: 120, dateLabel: '1350-01 / 第 81–120 章', title: '无人岛石板', location: '无人岛', cast: ['艾德雯娜', '格尔曼'], canon: '无人岛的石板上刻着二十二条路径。艾德雯娜说那不是地图，是名单。', newspaper: '《海上新闻报》：无人岛发现“古代遗迹”，探险队拒绝展示拓片。', interventions: ['旁观', '接触', '介入'] },
    { id: 'sea-e05', volumeId: 3, volumeTitle: '旅行家', index: 5, dayStart: 8, chStart: 121, chEnd: 180, dateLabel: '1350-01 / 第 121–180 章', title: '阿尔杰的祈祷', location: '幽蓝复仇者号', cast: ['阿尔杰', '格尔曼'], canon: '阿尔杰在夜里对着海面祈祷。你听见他念了一个不属于风暴之主的名号。', newspaper: '《海上新闻报》：船长称夜间的“歌声”只是缆绳摩擦。', interventions: ['旁观', '接触', '介入'] },
    { id: 'sea-e06', volumeId: 3, volumeTitle: '旅行家', index: 6, dayStart: 10, chStart: 181, chEnd: 250, dateLabel: '1350-01 / 第 181–250 章', title: '格尔曼的委托', location: '罗思德群岛港口', cast: ['格尔曼', '阿尔杰'], canon: '格尔曼在港口交给你一个委托：找一个“会说话的头骨”。他没有解释用途。', newspaper: '《海上新闻报》：港口出现一名戴金边眼镜的猎人，悬赏一只“会说话的头骨”。', interventions: ['旁观', '接触', '介入'] }
  ];

  window.OC_SEA = {
    id: 'sea',
    name: '海上',
    paper: '海上新闻报',
    dateLabel: '1350 年 1 月',
    maxDay: 180,
    storyMax: 10,
    intro: '罗思德群岛的风带着盐和血。你上了幽蓝复仇者号，海图上的空白比雾更危险。',
    locations: [
      { id: 'port', name: '罗思德群岛港口', sub: '湿漉漉的码头与没有名字的船', icon: 'factory', color: '#3e6b7a' },
      { id: 'ship', name: '幽蓝复仇者号', sub: '甲板、船长室与一张旧海图', icon: 'map', color: '#5e8794' },
      { id: 'market', name: '黑市', sub: '两条巷子之间的交易', icon: 'club', color: '#8e2f3c' },
      { id: 'island', name: '无人岛', sub: '沙滩上的脚印与没有离开的痕迹', icon: 'home', color: '#b08a4a' },
      { id: 'storm', name: '风暴眼', sub: '闭着的眼睛与转个不停的罗盘', icon: 'moon', color: '#6a536f' }
    ],
    npcLocations: {
      port: ['danz'],
      ship: ['alger', 'klein'],
      market: ['frank'],
      island: ['edwina'],
      storm: ['alger', 'klein']
    },
    npcs: [
      { id: 'alger', name: '阿尔杰·威尔逊', role: '船长 / 风暴之主教徒', color: '#5e8794', desc: '他说话像在念航海日志。你总觉得他同时在和另一个看不见的人说话。' },
      { id: 'klein', name: '格尔曼·斯帕罗', role: '猎人 / 占卜家', color: '#c9a35c', desc: '他戴着金边眼镜，枪法很好，笑容很少。你总觉得他认识你。' },
      { id: 'danz', name: '达尼兹', role: '水手 / 海盗', color: '#8c9894', desc: '他自称“烈焰”，实际上大部分时间在躲债。他对罗思德群岛很熟。' },
      { id: 'edwina', name: '艾德雯娜·爱德华兹', role: '探险家 / 学者', color: '#b18bc4', desc: '她对无人岛的兴趣大过对活人的兴趣。她的笔记本里夹着一张不该存在的地图。' },
      { id: 'frank', name: '弗兰克·李', role: '黑市商人', color: '#709b7a', desc: '他卖的每一件东西都有一段不能问的来历。他喜欢别人叫他“植物学家”。' }
    ],
    actions: {
      port: [
        { id: 'work', label: '在码头找活', desc: '搬货、修帆、听水手讲不该讲的事。', effects: { money: 5, body: 1, health: -1 }, text: '你扛了一下午的货。一个老水手说，风暴眼最近“不太安静”。' },
        { id: 'danz', label: '找达尼兹喝酒', desc: '他欠你一杯，也欠你一个消息。', effects: { relations: { danz: 1 }, insight: 1 }, text: '达尼兹喝到第三杯才说：“那艘没有灯的船，昨晚又靠岸了。”' },
        { id: 'gossip', label: '听港口的传闻', desc: '关于风暴眼、黑市和“格尔曼·斯帕罗”。', effects: { insight: 1, luck: 1 }, text: '你听见有人说，格尔曼·斯帕罗在找一个“会说话的头骨”。' },
        { id: 'board', label: '查看委托板', desc: '港口、船上、黑市的活。', effects: {}, openBoard: true, text: '委托板被海风撕掉了一角。' }
      ],
      ship: [
        { id: 'alger', label: '和阿尔杰对海图', desc: '他愿意让你看一部分航线。', effects: { relations: { alger: 1 }, insight: 1 }, text: '阿尔杰用手指点着风暴眼：“这里没有航线。只有愿不愿意。”' },
        { id: 'klein', label: '和格尔曼说话', desc: '他正在擦一把左轮。', effects: { relations: { klein: 1 }, insight: 1, flags: { saw_klein: true } }, text: '格尔曼看了你一眼：“你最好别在风暴眼里撒谎。”你问为什么，他把子弹一颗一颗压进弹巢。' },
        { id: 'chart', label: '研究旧海图', desc: '找一条没人走过的路。', check: { attr: 'insight', dc: 10 }, effects: { insight: 2 }, fail: { madness: 1 }, text: '海图上有一条被墨水涂掉的航线。你顺着它看，发现终点是一座不在图上的岛。' },
        { id: 'board', label: '查看船上委托', desc: '船长需要人做的事。', effects: {}, openBoard: true, text: '船长室的桌上压着几张委托。' }
      ],
      market: [
        { id: 'buy', label: '买一件“有用”的东西', desc: '符咒、材料、或一个不该问的问题。', effects: { money: -6, insight: 1, madness: 1 }, text: '你买了一枚用鲨鱼牙包着的符咒。弗兰克说它能“挡住一次不该来的风”。' },
        { id: 'frank', label: '和弗兰克聊天', desc: '他最近在找一种只在无人岛生长的植物。', effects: { relations: { frank: 1 }, insight: 1 }, text: '弗兰克给你看了一株会动的藤蔓。他说：“别碰。它认人。”' },
        { id: 'sell', label: '卖一点消息', desc: '你知道的比你以为的多。', effects: { money: 8, notoriety: 1 }, text: '你卖了一条关于风暴眼的消息。买家没有还价，这让你有点不安。' }
      ],
      island: [
        { id: 'explore', label: '探索无人岛', desc: '沙滩、岩洞和不该有的脚印。', check: { attr: 'body', dc: 9 }, effects: { insight: 2, body: 1 }, fail: { health: -2 }, text: '你在岩洞里找到一块刻着海浪的石板。石板背面有一个名字：格尔曼。' },
        { id: 'edwina', label: '和艾德雯娜研究石板', desc: '她相信这是一张地图。', effects: { relations: { edwina: 1 }, insight: 2 }, text: '艾德雯娜把石板拓在纸上，说：“这不是地图。这是一份名单。”' },
        { id: 'ritual', label: '在岛上做一次仪式', desc: '向海、向风、向不该回应的地方。', check: { attr: 'spirit', dc: 10 }, effects: { madness: 2, insight: 2 }, fail: { health: -1 }, text: '海面安静了一瞬。你听见水下有人用你的声音说了一句话。' }
      ],
      storm: [
        { id: 'sail', label: '驶入风暴眼', desc: '把船交给阿尔杰，把自己交给运气。', check: { attr: 'luck', dc: 9 }, effects: { insight: 2, reputation: 1 }, fail: { health: -3, madness: 1 }, text: '船穿过风暴眼。罗盘转了三圈，停在一个不该存在的方向上。' },
        { id: 'dive', label: '潜下去看看', desc: '水下有光，像一只闭着的眼睛。', check: { attr: 'body', dc: 10 }, effects: { insight: 3, madness: 1 }, fail: { health: -3 }, text: '你潜到水下。光是从一扇门后面透出来的，门上刻着二十二条路径。' },
        { id: 'klein', label: '问格尔曼看到了什么', desc: '他站在船头，一直没说话。', effects: { relations: { klein: 1 }, insight: 1 }, text: '格尔曼说：“我看到一个我不认识的人，站在我自己的位置上。”' }
      ]
    },
    commissions: [
      { id: 'escort', title: '护送一艘没有灯的船', location: 'port', days: 4, check: { attr: 'body', dc: 9 }, reward: 14, notoriety: 1, desc: '船主不肯说货是什么，只肯付钱。' },
      { id: 'cargo', title: '找回被抢的货', location: 'market', days: 5, check: { attr: 'social', dc: 10 }, reward: 18, rep: 1, desc: '弗兰克的货被另一伙人截了。他希望你“文明地”要回来。' },
      { id: 'sailor', title: '寻找失踪的水手', location: 'port', days: 4, check: { attr: 'insight', dc: 9 }, reward: 10, humanity: 1, desc: '一个水手在无人岛附近失踪。他的同伴说他“走进了海里”。' },
      { id: 'map', title: '补全风暴眼海图', location: 'ship', days: 6, check: { attr: 'insight', dc: 11 }, reward: 20, relations: { alger: 1 }, desc: '阿尔杰需要一张能穿过风暴眼的图。他只有一半。' },
      { id: 'relic', title: '无人岛的石板', location: 'island', days: 7, check: { attr: 'spirit', dc: 10 }, reward: 22, madness: 1, desc: '艾德雯娜愿意为一块石板付大价钱。她说那不是古董，是“钥匙”。' },
      { id: 'debt', title: '达尼兹的债', location: 'port', days: 3, check: { attr: 'social', dc: 9 }, reward: 8, relations: { danz: 1 }, desc: '达尼兹又欠钱了。他保证这次“真的会还”。' }
    ],
    ambient: [
      { id: 's1', location: 'port', text: '一个小孩在卖“风暴眼里的石头”，只要两便士。', choices: [{ label: '买一块', effects: { money: -1, luck: 1 } }, { label: '告诉他这是骗局', effects: { humanity: 1 } }] },
      { id: 's2', location: 'ship', text: '阿尔杰在夜里对着海面说话。你听不清他在向谁祈祷。', choices: [{ label: '走开', effects: { insight: 1 } }, { label: '留下来听', effects: { madness: 1, insight: 2 } }] },
      { id: 's3', location: 'market', text: '弗兰克向你展示一株会动的藤蔓。它朝你伸了一下。', choices: [{ label: '碰它', effects: { madness: 1, insight: 2 } }, { label: '后退', effects: { health: 1 } }] },
      { id: 's4', location: 'island', text: '沙滩上有一行脚印，从海裡走到岛上，没有回去的痕迹。', choices: [{ label: '跟着脚印', effects: { insight: 2, madness: 1 } }, { label: '记下位置，离开', effects: { insight: 1 } }] },
      { id: 's5', location: 'storm', text: '风暴眼里很安静。安静到你能听见自己的心跳。', choices: [{ label: '闭上眼睛听', effects: { madness: 1, insight: 2 } }, { label: '抓住缆绳', effects: { body: 1 } }] },
      { id: 's6', location: 'port', text: '达尼兹说：“你知道吗，格尔曼·斯帕罗不是他的真名。”', choices: [{ label: '追问', effects: { relations: { danz: 1 }, insight: 1 } }, { label: '让他闭嘴', effects: { notoriety: 1 } }] }
    ],
    endings: {
      ordinary: [
        { id: 'sea_captain', title: '船长', headline: '《罗思德群岛新增一条航线，船长拒绝透露姓名》', cond: { reputation: 8, insight: 8 }, region: 'sea', text: '你有了自己的船。船不大，但足够装下几个愿意跟你走的人。你给船起了一个没有意义的名字，只在夜里叫它真名。' },
        { id: 'sea_trader', title: '海上商人', headline: '《黑市商人称“风暴眼只是天气”，拒绝对货物来源置评》', cond: { money: 45 }, region: 'sea', text: '你在罗思德群岛做起了生意。你卖符咒、材料和消息，偶尔也卖一点不该卖的东西。你从不问买家拿它做什么。' },
        { id: 'sea_diver', title: '深海潜水员', headline: '《潜水员称水下有一扇门，教会称“珊瑚礁”》', cond: { body: 6 }, region: 'sea', text: '你成了罗思德群岛最好的潜水员。你下过很多次水，只见过那扇门一次。你再也没有找到它。' },
        { id: 'sea_lighthouse', title: '灯塔守夜人', headline: '《灯塔守夜人称风暴眼里有灯，航运公司称“幻觉”》', cond: { humanity: 7 }, region: 'sea', text: '你留在一座小灯塔上。每晚点灯，每早熄灯。偶尔有船从风暴眼里出来，你会给他们煮一壶茶，不问他们从哪来。' },
        { id: 'sea_daily', title: '海上的普通人', headline: '《一个普通水手的日常：盐、朗姆酒和偶尔的怪梦》', cond: {}, region: 'sea', text: '你没有找到风暴眼里的答案，也没有被海吞掉。你只是活了下来。每天早上擦甲板，晚上看星星。偶尔梦见一扇门。' }
      ],
      core: [
        { id: 'sea_legend', title: '风暴眼的传说', headline: '《“格尔曼·斯帕罗”再次出现，船长称“他只是个猎人”》', cond: { flags: ['saw_klein'], insight: 10 }, region: 'sea', text: '你和格尔曼一起穿过风暴眼。你看见门后的东西，也看见他脸上的表情。你们都没有提那件事。后来，海上多了一个关于“两个猎人”的传说。' }
      ]
    },
    canon: seaCanon
  };
})();
