/* ============================================================
   南大陆 · 拜朗 8 天
   第四段；共享玩家、关系、存档与结局。
   ============================================================ */
(function () {
  const southCanon = [
    { id: 'south-e01', volumeId: 4, volumeTitle: '不死者', index: 1, dayStart: 1, chStart: 1, chEnd: 30, dateLabel: '1350-08 / 第 1–30 章', title: '抵达拜朗', location: '拜朗港', cast: ['阿兹克', '马里奇'], canon: '你从罗思德群岛来到拜朗。港口比廷根热，死人比活人多。', newspaper: '《南大陆殖民报》：拜朗港昨夜有送葬队伍经过，官方称“地方习俗”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'south-e02', volumeId: 4, volumeTitle: '不死者', index: 2, dayStart: 2, chStart: 31, chEnd: 70, dateLabel: '1350-08 / 第 31–70 章', title: '庄园的死者', location: '殖民庄园', cast: ['阿兹克', '玫瑰学派'], canon: '一座殖民庄园的主人死了三天，却还在餐桌旁招待客人。', newspaper: '《南大陆殖民报》：某庄园主“因病缺席”晚宴，客人称他仍在席间。', interventions: ['旁观', '接触', '介入'] },
    { id: 'south-e03', volumeId: 4, volumeTitle: '不死者', index: 3, dayStart: 4, chStart: 71, chEnd: 120, dateLabel: '1350-08 / 第 71–120 章', title: '玫瑰祭坛', location: '玫瑰祭坛', cast: ['玫瑰学派', '马里奇'], canon: '玫瑰学派的祭坛藏在雨林深处，石槽里还有没干的血。', newspaper: '《南大陆殖民报》：雨林深处发现“非法祭祀场所”，当局已封锁。', interventions: ['旁观', '接触', '介入'] },
    { id: 'south-e04', volumeId: 4, volumeTitle: '不死者', index: 4, dayStart: 6, chStart: 121, chEnd: 180, dateLabel: '1350-08 / 第 121–180 章', title: '不死者仪式', location: '古墓', cast: ['阿兹克', '玫瑰学派'], canon: '有人在古墓里举行不死者仪式。阿兹克说，死亡不是终点，遗忘才是。', newspaper: '《南大陆殖民报》：古墓群夜间传出歌声，守墓人拒绝上班。', interventions: ['旁观', '接触', '介入'] },
    { id: 'south-e05', volumeId: 4, volumeTitle: '不死者', index: 5, dayStart: 8, chStart: 181, chEnd: 214, dateLabel: '1350-08 / 第 181–214 章', title: '死神后裔', location: '拜朗港', cast: ['阿兹克', '马里奇'], canon: '死神后裔在港口现身。你终于知道，阿兹克为什么总在找一扇门。', newspaper: '《南大陆殖民报》：港口出现“无影者”，教会称“视觉误差”。', interventions: ['旁观', '接触', '介入'] }
  ];

  window.OC_SOUTH = {
    id: 'south',
    name: '南大陆',
    paper: '南大陆殖民报',
    dateLabel: '1350 年 8 月',
    maxDay: 8,
    intro: '拜朗的太阳很烈，死亡却很慢。你带着海上的潮气上岸，发现这里的死者比活人更守规矩。',
    locations: [
      { id: 'port', name: '拜朗港', sub: '送葬队伍、殖民官员与湿热的码头', icon: 'factory', color: '#b08a4a' },
      { id: 'estate', name: '殖民庄园', sub: '白墙、棕榈与不肯离席的主人', icon: 'home', color: '#8e2f3c' },
      { id: 'altar', name: '玫瑰祭坛', sub: '雨林深处、石槽与没干的血', icon: 'church', color: '#6a536f' },
      { id: 'grave', name: '古墓群', sub: '石棺、黄沙与夜里的歌声', icon: 'asylum', color: '#7c8189' },
      { id: 'jungle', name: '雨林', sub: '藤蔓、虫鸣与不该有的路', icon: 'map', color: '#5f7a52' }
    ],
    npcLocations: {
      port: ['azik', 'maric'],
      estate: ['azik', 'rose'],
      altar: ['rose', 'maric'],
      grave: ['azik'],
      jungle: ['maric', 'rose']
    },
    npcs: [
      { id: 'azik', name: '阿兹克·艾格斯', role: '历史教师 / 死神后裔', color: '#b08a4a', desc: '他温和、博学，像一位真正的历史教师。你总觉得他在等一个已经死了很久的人。' },
      { id: 'maric', name: '马里奇', role: '玫瑰学派叛逃者', color: '#8c9894', desc: '他说话很轻，像怕吵醒地下的东西。他欠阿兹克一条命。' },
      { id: 'rose', name: '玫瑰学派祭司', role: '被缚之神的仆人', color: '#8e2f3c', desc: '她从不背对祭坛。她说死亡是一种“更慢的呼吸”。' },
      { id: 'doctor', name: '殖民地医生', role: '拜朗港诊所', color: '#709b7a', desc: '他同时给活人和死人看病。收费一样。' }
    ],
    actions: {
      port: [
        { id: 'work', label: '在港口找活', desc: '搬货、引路、替殖民官员跑腿。', effects: { money: 5, body: 1, health: -1 }, text: '你替一支送葬队伍引路。队伍里没有人哭，棺材却很轻。' },
        { id: 'azik', label: '和阿兹克喝咖啡', desc: '他今天讲的是拜朗王朝。', effects: { relations: { azik: 1 }, insight: 1 }, text: '阿兹克说：“这里的死者不怕被遗忘，怕被叫错名字。”' },
        { id: 'maric', label: '找马里奇', desc: '他约你在码头尽头见面。', effects: { relations: { maric: 1 }, insight: 1 }, text: '马里奇递给你一枚铜牌：“如果你在祭坛看见我，别叫我的名字。”' },
        { id: 'board', label: '查看委托板', desc: '殖民地的委托，通常和死人有关。', effects: {}, openBoard: true, text: '委托板被太阳晒得发白。' }
      ],
      estate: [
        { id: 'dinner', label: '参加庄园晚宴', desc: '主人已经死了三天，但晚宴照常。', check: { attr: 'social', dc: 9 }, effects: { reputation: 1, insight: 1 }, fail: { madness: 1 }, text: '你坐在长桌末席。主人举杯，杯里的酒是红的，手是冷的。' },
        { id: 'azik', label: '和阿兹克调查庄园', desc: '他想知道主人为什么不肯走。', effects: { relations: { azik: 1 }, insight: 1 }, text: '阿兹克在书房找到一本账册。最后一页写着：“我把名字卖给了玫瑰。”' },
        { id: 'rose', label: '和玫瑰祭司说话', desc: '她站在花园里，像一尊不动的雕像。', effects: { relations: { rose: 1 }, madness: 1 }, text: '她问你：“你怕死，还是怕死后还有人记得你？”' }
      ],
      altar: [
        { id: 'inspect', label: '检查祭坛', desc: '石槽、血、和一些不该存在的名字。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 2, madness: 1 }, fail: { health: -2 }, text: '石槽底部刻着二十二个名字。你认出其中一个，是昨天在港口见过的活人。' },
        { id: 'rose', label: '和祭司做交易', desc: '她可以告诉你祭坛的用途。', effects: { relations: { rose: 1 }, insight: 1, notoriety: 1 }, text: '祭司说：“祭坛不杀人。它只是让人死得慢一点。”' },
        { id: 'maric', label: '找马里奇', desc: '他藏在祭坛后面的雨林里。', effects: { relations: { maric: 1 }, humanity: 1 }, text: '马里奇说：“我背叛他们，不是因为我不信。是因为我信得太晚。”' }
      ],
      grave: [
        { id: 'listen', label: '听墓里的歌声', desc: '守墓人说，夜里有人唱歌。', check: { attr: 'spirit', dc: 9 }, effects: { insight: 2, madness: 1 }, fail: { madness: 1 }, text: '你听见一首拜朗语的葬歌。唱到第三段时，你发现自己在跟着唱。' },
        { id: 'azik', label: '和阿兹克进古墓', desc: '他认识这里的每一块石头。', effects: { relations: { azik: 1 }, insight: 2 }, text: '阿兹克在一口石棺前停下：“这是我以前的家。”' },
        { id: 'dig', label: '打开一口石棺', desc: '不一定是好主意。', check: { attr: 'body', dc: 9 }, effects: { insight: 2, notoriety: 1 }, fail: { health: -2, madness: 1 }, text: '石棺里没有尸体，只有一扇向下的门。' }
      ],
      jungle: [
        { id: 'explore', label: '深入雨林', desc: '找一条不该有的路。', check: { attr: 'body', dc: 9 }, effects: { insight: 2, body: 1 }, fail: { health: -2 }, text: '你沿着一条被踩出来的路走。路的尽头是祭坛。' },
        { id: 'maric', label: '和马里奇同行', desc: '他知道玫瑰学派的暗号。', effects: { relations: { maric: 1 }, insight: 1 }, text: '马里奇教你一句暗号。他说：“如果念错，他们会知道你从海上来。”' },
        { id: 'doctor', label: '找殖民地医生', desc: '他也在雨林里采药。', effects: { relations: { doctor: 1 }, humanity: 1 }, text: '医生说：“这里的病不是疟疾。是有人不愿意让死者走。”' }
      ]
    },
    commissions: [
      { id: 'funeral', title: '送葬队伍的委托', location: 'port', days: 3, check: { attr: 'social', dc: 8 }, reward: 10, humanity: 1, desc: '一支送葬队伍缺一个引路人。他们说死者“不太配合”。' },
      { id: 'estate', title: '庄园的遗嘱', location: 'estate', days: 5, check: { attr: 'insight', dc: 10 }, reward: 16, rep: 1, desc: '庄园主的遗嘱不见了。他的儿子们都不希望它被找到。' },
      { id: 'altar', title: '祭坛的名单', location: 'altar', days: 6, check: { attr: 'spirit', dc: 10 }, reward: 18, notoriety: 1, desc: '有人愿意为石槽底下的名单付钱。名单上可能有活人。' },
      { id: 'grave', title: '守墓人的夜班', location: 'grave', days: 4, check: { attr: 'body', dc: 9 }, reward: 12, madness: 1, desc: '守墓人不敢再上夜班。他说古墓里有人在数他的名字。' },
      { id: 'doctor', title: '诊所的药', location: 'jungle', days: 5, check: { attr: 'luck', dc: 8 }, reward: 9, relations: { doctor: 1 }, desc: '殖民地医生需要一种只长在祭坛附近的药草。' }
    ],
    ambient: [
      { id: 't1', location: 'port', text: '一个殖民官员问你：“你见过死人走路吗？”他问得很认真。', choices: [{ label: '说见过', effects: { notoriety: 1, insight: 1 } }, { label: '说没有', effects: { humanity: 1 } }] },
      { id: 't2', location: 'estate', text: '庄园的仆人说，主人每晚都自己倒酒，但从不喝。', choices: [{ label: '去餐厅看看', effects: { madness: 1, insight: 2 } }, { label: '早点离开', effects: { health: 1 } }] },
      { id: 't3', location: 'altar', text: '祭坛后面的雨林里，有人用拜朗语念你的名字。', choices: [{ label: '回答', effects: { madness: 2, insight: 1 } }, { label: '沉默', effects: { spirit: 1 } }] },
      { id: 't4', location: 'grave', text: '守墓人递给你一杯酒，说：“喝了就不会听见他们唱歌。”', choices: [{ label: '喝', effects: { madness: -1, health: -1 } }, { label: '倒掉', effects: { insight: 1 } }] },
      { id: 't5', location: 'jungle', text: '马里奇说：“南大陆的太阳会让人忘记自己是谁。”', choices: [{ label: '问他怎么记住', effects: { relations: { maric: 1 }, insight: 1 } }, { label: '继续赶路', effects: { body: 1 } }] }
    ],
    endings: {
      ordinary: [
        { id: 'south_estate', title: '庄园主', headline: '《拜朗某庄园易主，新主人称“会继续办晚宴”》', cond: { money: 35 }, region: 'south', text: '你买下了一座庄园。你让仆人每晚摆好餐具，但从不邀请客人。你怕他们发现，餐桌旁还坐着一个不该在的人。' },
        { id: 'south_doctor', title: '殖民地医生', headline: '《拜朗港诊所新增“夜间门诊”，医生拒绝说明病人身份》', cond: { humanity: 7 }, region: 'south', text: '你留在拜朗港的诊所。白天给活人看病，晚上给死人开药。收费一样，疗效另说。' },
        { id: 'south_guide', title: '雨林向导', headline: '《殖民局招募雨林向导，要求“不怕死人”》', cond: { body: 5, insight: 6 }, region: 'south', text: '你成了雨林里最好的向导。你知道哪条路通往祭坛，哪条路通往古墓，哪条路不该走。你只带熟人。' },
        { id: 'south_gravedigger', title: '守墓人', headline: '《古墓群新守墓人称“夜里的歌声只是风”》', cond: { madness: 4 }, region: 'south', text: '你留在了古墓群。每晚点一盏灯，听死者唱歌。你学会了他们的调子，但从不跟着唱。' },
        { id: 'south_daily', title: '南大陆的普通人', headline: '《一个普通拜朗人的日常：太阳、葬礼和偶尔的怪梦》', cond: {}, region: 'south', text: '你没有找到死神后裔的答案，也没有被玫瑰带走。你只是活了下来。每天早上买面包，晚上关窗。偶尔梦见一扇向下的门。' }
      ],
      core: [
        { id: 'south_witness', title: '不死者的见证者', headline: '《本报记者称“死神后裔”只是地方传说》', cond: { flags: ['saw_klein'], insight: 9 }, region: 'south', text: '你见过阿兹克走进古墓，也见过他走出来。他没有变老。你从未问过他是什么。你只是把这件事写进一本不会出版的笔记。' }
      ]
    },
    canon: southCanon
  };
})();
