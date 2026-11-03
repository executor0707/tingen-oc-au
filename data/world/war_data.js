/* ============================================================
   战争 · 红祭司 8 天
   第五段；共享玩家、关系、存档与结局。
   ============================================================ */
(function () {
  const warCanon = [
    { id: 'war-e01', volumeId: 5, volumeTitle: '红祭司', index: 1, dayStart: 1, chStart: 1, chEnd: 40, dateLabel: '1351-02 / 第 1–40 章', title: '战争爆发', location: '前线战壕', cast: ['前线军官', '战地记者'], canon: '战争在三个方向同时爆发。你在战壕里听见神父说，这是“必要的牺牲”。', newspaper: '《战时公报》：前线大捷；伤亡数字“不便公布”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'war-e02', volumeId: 5, volumeTitle: '红祭司', index: 2, dayStart: 2, chStart: 41, chEnd: 80, dateLabel: '1351-02 / 第 41–80 章', title: '军团调动', location: '军团营地', cast: ['前线军官', '军团祭司'], canon: '军团在夜里调动。祭司说，红祭司会保佑冲锋的人。', newspaper: '《战时公报》：军团换防“一切正常”，居民称听见整夜脚步声。', interventions: ['旁观', '接触', '介入'] },
    { id: 'war-e03', volumeId: 5, volumeTitle: '红祭司', index: 3, dayStart: 4, chStart: 81, chEnd: 120, dateLabel: '1351-02 / 第 81–120 章', title: '战地医院', location: '战地医院', cast: ['战地医生', '战地记者'], canon: '医院里没有足够的床位。医生把活人和死人分在同一间帐篷。', newspaper: '《战时公报》：医院“物资充足”；护士称绷带已经洗了三次。', interventions: ['旁观', '接触', '介入'] },
    { id: 'war-e04', volumeId: 5, volumeTitle: '红祭司', index: 4, dayStart: 6, chStart: 121, chEnd: 160, dateLabel: '1351-02 / 第 121–160 章', title: '神降祭坛', location: '神降祭坛', cast: ['军团祭司', '前线军官'], canon: '军团在祭坛上举行神降仪式。祭品不是牛羊，是“自愿”的士兵。', newspaper: '《战时公报》：前线举行“士气仪式”，军官称“没有人员损失”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'war-e05', volumeId: 5, volumeTitle: '红祭司', index: 5, dayStart: 8, chStart: 161, chEnd: 204, dateLabel: '1351-02 / 第 161–204 章', title: '神战前夜', location: '王庭后勤处', cast: ['前线军官', '战地记者'], canon: '神战前夜，王庭把最后一批补给送往前线。你知道那些箱子里不只有子弹。', newspaper: '《战时公报》：王庭宣布“胜利在望”；前线士兵开始写遗书。', interventions: ['旁观', '接触', '介入'] }
  ];

  window.OC_WAR = {
    id: 'war',
    name: '战争',
    paper: '战时公报',
    dateLabel: '1351 年 2 月',
    maxDay: 8,
    intro: '战争把所有人变成棋子。你从南大陆的热风里走进战壕，发现这里比墓地更安静。',
    locations: [
      { id: 'front', name: '前线战壕', sub: '泥、铁丝网和没有名字的死者', icon: 'shield', color: '#8e2f3c' },
      { id: 'camp', name: '军团营地', sub: '帐篷、号声和红祭司的旗', icon: 'archive', color: '#b08a4a' },
      { id: 'hospital', name: '战地医院', sub: '绷带、吗啡和分不清活死的帐篷', icon: 'church', color: '#8c9894' },
      { id: 'court', name: '王庭后勤处', sub: '地图、补给和体面的谎言', icon: 'club', color: '#6a536f' },
      { id: 'altar', name: '神降祭坛', sub: '石阶、火焰和“自愿”的士兵', icon: 'church', color: '#8e2f3c' }
    ],
    npcLocations: {
      front: ['officer', 'reporter'],
      camp: ['officer', 'priest'],
      hospital: ['medic', 'reporter'],
      court: ['officer', 'priest'],
      altar: ['priest', 'officer']
    },
    npcs: [
      { id: 'officer', name: '前线军官', role: '军团上尉', color: '#8e2f3c', desc: '他说话像在念命令。你总觉得他已经把遗书写好了。' },
      { id: 'medic', name: '战地医生', role: '军医', color: '#8c9894', desc: '他同时给敌我双方做手术。他说“血不分国籍”。' },
      { id: 'priest', name: '军团祭司', role: '红祭司的仆人', color: '#c9a35c', desc: '他相信战争是一种祭祀。你问他祭品是什么，他笑而不答。' },
      { id: 'reporter', name: '战地记者', role: '《战时公报》记者', color: '#709b7a', desc: '他写的东西一半被删掉。他把删掉的那一半藏在靴子里。' }
    ],
    actions: {
      front: [
        { id: 'fight', label: '参加一次冲锋', desc: '活下来，或者成为数字。', check: { attr: 'body', dc: 10 }, effects: { reputation: 2, health: -1 }, fail: { health: -3, madness: 1 }, text: '你冲过一片泥地。子弹从头顶过去，像一群看不见的鸟。' },
        { id: 'officer', label: '和上尉说话', desc: '他想知道你为什么来前线。', effects: { relations: { officer: 1 }, insight: 1 }, text: '上尉说：“别信公报。信你身边的人。”' },
        { id: 'reporter', label: '找战地记者', desc: '他有一份被删掉的名单。', effects: { relations: { reporter: 1 }, insight: 1, notoriety: 1 }, text: '记者把名单塞给你：“上面的人，官方说他们‘失踪’了。”' },
        { id: 'wander', label: '在战壕里走走', desc: '听听士兵在说什么。', effects: {}, text: '战壕里有人在赌明天会不会下雨。没有人赌战争什么时候结束。', ambient: true }
      ],
      camp: [
        { id: 'priest', label: '听军团祭司布道', desc: '他讲红祭司，也讲牺牲。', effects: { relations: { priest: 1 }, madness: 1, humanity: -1 }, text: '祭司说：“死亡不是终点。被记住才是。”你看见台下的士兵在发抖。' },
        { id: 'officer', label: '和上尉对地图', desc: '他需要有人送一封不能走军邮的信。', effects: { relations: { officer: 1 }, insight: 1 }, text: '上尉在 map 上画了一条线：“送到这里。别问箱子里是什么。”' },
        { id: 'supply', label: '检查补给', desc: '枪支、罐头、和不该出现的东西。', check: { attr: 'insight', dc: 9 }, effects: { insight: 1, notoriety: 1 }, fail: { health: -1 }, text: '你在一箱“医疗物资”里找到一排没有标签的玻璃瓶。' }
      ],
      hospital: [
        { id: 'medic', label: '帮医生做手术', desc: '活人和死人只有一线之隔。', check: { attr: 'body', dc: 9 }, effects: { humanity: 2, relations: { medic: 1 } }, fail: { health: -2, madness: 1 }, text: '你按住一个士兵的腿，医生把弹片取出来。他咬着皮带，没有叫。' },
        { id: 'reporter', label: '和记者聊伤亡数字', desc: '他有一个和公报不同的版本。', effects: { relations: { reporter: 1 }, insight: 2 }, text: '记者说：“公报写伤亡三百。实际是三千。”' },
        { id: 'rest', label: '在帐篷里睡一会儿', desc: '不做梦就是好觉。', effects: { health: 2, madness: -1 }, text: '你梦见自己在一间没有门的房间里，听见外面有人在数数。' }
      ],
      court: [
        { id: 'bribe', label: '和后勤官做交易', desc: '把补给送到真正需要的地方。', check: { attr: 'social', dc: 10 }, effects: { humanity: 1, money: 8, notoriety: 1 }, fail: { notoriety: 2 }, text: '后勤官收下钱，把两车绷带改道送往前线医院。' },
        { id: 'officer', label: '和上尉见王庭代表', desc: '他们需要一个“体面”的见证人。', effects: { relations: { officer: 1 }, reputation: 1 }, text: '王庭代表说：“战争会结束的。只要死够多的人。”' },
        { id: 'priest', label: '和祭司争论祭品', desc: '你问他，士兵是不是“自愿”的。', effects: { relations: { priest: 1 }, insight: 1, madness: 1 }, text: '祭司说：“每一个被选中的人，都曾经自愿过。”' }
      ],
      altar: [
        { id: 'watch', label: '旁观神降仪式', desc: '火焰、石阶和整齐的脚步声。', effects: { madness: 2, insight: 1 }, text: '士兵们一个接一个走上石阶。没有人回头。' },
        { id: 'stop', label: '阻止仪式', desc: '你知道这会得罪谁。', check: { attr: 'spirit', dc: 11 }, effects: { humanity: 2, notoriety: 2 }, fail: { health: -3, madness: 1 }, text: '你打断了咒文。祭坛上的火熄灭了一瞬，所有人都看向你。' },
        { id: 'priest', label: '问祭司红祭司是什么', desc: '他愿意讲一点。', effects: { relations: { priest: 1 }, insight: 2, humanity: -1 }, text: '祭司说：“红祭司不是神。祂是战争本身。”' }
      ]
    },
    commissions: [
      { id: 'letter', title: '送一封不能走军邮的信', location: 'front', days: 3, check: { attr: 'body', dc: 9 }, reward: 12, relations: { officer: 1 }, desc: '上尉的信不能经过军团审查。他知道你知道。' },
      { id: 'supply', title: '追查失踪的补给', location: 'court', days: 5, check: { attr: 'social', dc: 10 }, reward: 18, notoriety: 1, desc: '两车绷带和一批药品没有到前线。后勤处说“路上损耗”。' },
      { id: 'medic', title: '医院缺吗啡', location: 'hospital', days: 4, check: { attr: 'luck', dc: 8 }, reward: 10, humanity: 1, desc: '医生需要吗啡，不管来源。' },
      { id: 'list', title: '记者的名单', location: 'front', days: 5, check: { attr: 'insight', dc: 10 }, reward: 14, notoriety: 1, desc: '记者需要有人确认名单上的名字还活着。' },
      { id: 'ritual', title: '祭坛的见证人', location: 'altar', days: 6, check: { attr: 'spirit', dc: 10 }, reward: 20, madness: 1, desc: '有人要你记录神降仪式。报酬很高，代价另算。' }
    ],
    ambient: [
      { id: 'w1', location: 'front', text: '一个士兵问你：“你说，战争结束后，会有人记得我们吗？”', choices: [{ label: '说会', effects: { humanity: 1 } }, { label: '说不会', effects: { madness: 1, insight: 1 } }] },
      { id: 'w2', location: 'camp', text: '军团祭司在夜里烧一封信。你看见收件人的名字被涂掉了。', choices: [{ label: '偷看', effects: { insight: 2, notoriety: 1 } }, { label: '走开', effects: { luck: 1 } }] },
      { id: 'w3', location: 'hospital', text: '医生问你：“如果只能救一个，你救敌兵还是自己人？”', choices: [{ label: '救敌兵', effects: { humanity: 2 } }, { label: '救自己人', effects: { reputation: 1 } }] },
      { id: 'w4', location: 'court', text: '王庭代表说：“伤亡数字只是数字。”', choices: [{ label: '反驳他', effects: { notoriety: 1, humanity: 1 } }, { label: '记下来', effects: { insight: 1 } }] },
      { id: 'w5', location: 'altar', text: '石阶上有一枚士兵的狗牌。你听见有人在叫那个名字。', choices: [{ label: '捡起来', effects: { humanity: 1, madness: 1 } }, { label: '走开', effects: { health: 1 } }] }
    ],
    endings: {
      ordinary: [
        { id: 'war_officer', title: '战后军官', headline: '《战后军官拒绝评论“神降仪式”》', cond: { reputation: 8 }, region: 'war', text: '你活到了战争结束。你成了军官，负责写报告。你把“失踪”写成“转移”，把“祭品”写成“志愿者”。你写得很熟练。' },
        { id: 'war_medic', title: '战地医生', headline: '《战地医生获勋章，拒绝出席颁奖礼》', cond: { humanity: 7 }, region: 'war', text: '你留在了医院。战争结束后，你还在做手术。你救过敌兵，也救过自己人。你从不问他们为什么打仗。' },
        { id: 'war_reporter', title: '战地记者', headline: '《战地记者出版回忆录，三分之一内容被涂黑》', cond: { insight: 10 }, region: 'war', text: '你成了一名战地记者。你写的稿子一半被删掉。你把删掉的那一半藏在靴子里，等战争结束再发表。' },
        { id: 'war_deserter', title: '逃兵', headline: '《军方通缉一名“失踪”士兵，罪名：临阵脱逃》', cond: { notoriety: 6 }, region: 'war', text: '你离开了前线。你没有逃回家，而是去了一个没有战争的地方。你偶尔梦见战壕，醒来时还在跑。' },
        { id: 'war_daily', title: '战争里的普通人', headline: '《一个普通士兵的日常：泥、罐头和偶尔的炮声》', cond: {}, region: 'war', text: '你没有成为英雄，也没有成为逃兵。你只是活到了战争结束。你回家时，发现门口的路灯换了新的。' }
      ],
      core: [
        { id: 'war_red_priest', title: '红祭司的见证者', headline: '《本报记者称“红祭司”只是战争宣传》', cond: { flags: ['saw_klein'], insight: 9 }, region: 'war', text: '你见过祭坛上的火，也见过火里的东西。你没有成为红祭司，也没有阻止战争。你只是把那一夜的每一个名字都记了下来。' }
      ]
    },
    canon: warCanon
  };
})();
