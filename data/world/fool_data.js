/* ============================================================
   愚者 · 源堡 5 天（第八段）
   ============================================================ */
(function () {
  const canon = [
    { id: 'fool-e01', volumeId: 8, volumeTitle: '愚者', index: 1, dayStart: 1, chStart: 1, chEnd: 15, dateLabel: '1352-09 / 第 1–15 章', title: '最后一战', location: '源堡', cast: ['克莱恩', '奥黛丽', '阿尔杰'], canon: '源堡的门开着。灰雾里有很多人，有的你认识，有的你只在报纸上见过。', newspaper: '《源堡无报》：灰雾之上传来钟声；教会称“没有异常”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'fool-e02', volumeId: 8, volumeTitle: '愚者', index: 2, dayStart: 3, chStart: 16, chEnd: 30, dateLabel: '1352-09 / 第 16–30 章', title: '“愚者”的委托', location: '青铜长桌', cast: ['克莱恩', '奥黛丽'], canon: '克莱恩坐在青铜长桌尽头。他说：“我将进入沉眠。”', newspaper: '《源堡无报》：塔罗会宣布“聚会继续”，未说明主持人去向。', interventions: ['旁观', '接触', '介入'] },
    { id: 'fool-e03', volumeId: 8, volumeTitle: '愚者', index: 3, dayStart: 5, chStart: 31, chEnd: 41, dateLabel: '1352-09 / 第 31–41 章', title: '沉眠', location: '门后', cast: ['克莱恩', '伦纳德'], canon: '门缓缓合上。你听见很多人的声音，从很远的地方喊你的名字。', newspaper: '《源堡无报》：今日无新闻。', interventions: ['旁观', '接触', '介入'] }
  ];

  window.OC_FOOL = {
    id: 'fool', name: '愚者', paper: '源堡无报', dateLabel: '1352 年 9 月', maxDay: 45, storyMax: 5,
    intro: '你走到了最后一页。源堡的门开着，灰雾很轻，像有人替你留了一盏灯。',
    locations: [
      { id: 'sefirah', name: '源堡', sub: '灰雾、钟声与看不见的台阶', icon: 'castle', color: '#c9a35c' },
      { id: 'fog', name: '灰雾', sub: '很多人的声音与一张空椅子', icon: 'fog', color: '#79b4b7' },
      { id: 'table', name: '青铜长桌', sub: '二十二张高背椅与一场还没有结束的聚会', icon: 'club', color: '#c9a35c' },
      { id: 'door', name: '门后', sub: '没有光，只有更多的门', icon: 'moon', color: '#6a536f' },
      { id: 'city', name: '贝克兰德', sub: '雾散了，路灯还亮着', icon: 'home', color: '#b08a4a' }
    ],
    npcLocations: { sefirah: ['klein', 'audrey'], fog: ['klein'], table: ['audrey', 'alger', 'leonard'], door: ['klein'], city: ['leonard'] },
    npcs: [
      { id: 'klein', name: '克莱恩·莫雷蒂', role: '愚者', color: '#c9a35c', desc: '他看起来像一个普通的年轻人。你总觉得他已经在很多地方死过很多次。' },
      { id: 'audrey', name: '奥黛丽·霍尔', role: '正义', color: '#c9b26d', desc: '她长大了。她仍然相信人，但不再轻易相信神。' },
      { id: 'alger', name: '阿尔杰·威尔逊', role: '倒吊人', color: '#5e8794', desc: '他站在长桌另一头，像一个终于不再需要撒谎的人。' },
      { id: 'leonard', name: '伦纳德·米切尔', role: '星星', color: '#709b7a', desc: '他还在写诗。他说最后一首还没写完。' }
    ],
    actions: {
      sefirah: [
        { id: 'klein', label: '和克莱恩说话', desc: '他坐在台阶上，像在等一个人。', effects: { relations: { klein: 1 }, insight: 2, flags: { saw_klein: true } }, text: '克莱恩说：“你从廷根走到这里，已经不再是一个人了。”' },
        { id: 'audrey', label: '和奥黛丽说话', desc: '她准备留下来。', effects: { relations: { audrey: 1 }, humanity: 1 }, text: '奥黛丽说：“塔罗会还在。我会等下一次聚会。”' },
        { id: 'steps', label: '走上台阶', desc: '源堡的台阶没有尽头。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 2, madness: 1 }, fail: { madness: 2 }, text: '你走上一级台阶。灰雾退开一点，露出更多的台阶。' }
      ],
      fog: [
        { id: 'listen', label: '听灰雾里的声音', desc: '有很多人在叫你的名字。', effects: { madness: 1, insight: 2 }, text: '你听见邓恩、梅丽莎、班森、伦纳德、奥黛丽、阿尔杰……你一个一个辨认。' },
        { id: 'chair', label: '找一张空椅子', desc: '长桌尽头有一张椅子。', effects: { insight: 1, humanity: 1 }, text: '你把手放在椅背上。椅子是温的，像有人刚离开。' },
        { id: 'rest', label: '在灰雾里坐一会儿', desc: '这里没有时间。', effects: { health: 2, madness: -1 }, text: '你闭上眼睛。灰雾像一条很轻的毯子。' }
      ],
      table: [
        { id: 'meeting', label: '参加最后一次塔罗会', desc: '所有人都到齐了。', effects: { relations: { audrey: 1, alger: 1, leonard: 1 }, insight: 1 }, text: '奥黛丽、阿尔杰、伦纳德依次坐下。没有人先开口。' },
        { id: 'leonard', label: '和伦纳德说话', desc: '他还在写诗。', effects: { relations: { leonard: 1 }, humanity: 1 }, text: '伦纳德说：“最后一首还没写完。你替我记着。”' },
        { id: 'alger', label: '和阿尔杰说话', desc: '他终于不再撒谎。', effects: { relations: { alger: 1 }, insight: 1 }, text: '阿尔杰说：“我这一生做过很多错事。但坐在这里，不算错。”' }
      ],
      door: [
        { id: 'open', label: '打开最后一扇门', desc: '门后没有光。', effects: { madness: 2, insight: 3 }, text: '门后是一片灰雾。你听见有人在里面说：“还不到时候。”' },
        { id: 'klein', label: '问克莱恩门后有什么', desc: '他可能不会回答。', effects: { relations: { klein: 1 }, insight: 1 }, text: '克莱恩说：“门后是下一个故事。但那个故事不一定需要我。”' },
        { id: 'close', label: '把门关上', desc: '让故事停在这里。', effects: { humanity: 2, madness: -1 }, text: '你合上门。灰雾退去，露出贝克兰德的天空。' }
      ],
      city: [
        { id: 'walk', label: '在贝克兰德走走', desc: '雾散了，路灯还亮着。', effects: { humanity: 2 }, text: '你走过东区、皇后区、码头。有人卖花，有人卖报，有人赶着上班。' },
        { id: 'leonard', label: '和伦纳德告别', desc: '他要去下一个地方。', effects: { relations: { leonard: 1 }, insight: 1 }, text: '伦纳德把一首没写完的诗塞给你：“如果我不回来，你替我写完。”' },
        { id: 'home', label: '回廷根看看', desc: '水仙花街还在。', effects: { humanity: 1, madness: -1 }, text: '你回到廷根。水仙花街的房东换了人，但门口的路灯还是旧的。' }
      ]
    },
    commissions: [
      { id: 'last', title: '最后一次聚会', location: 'table', days: 3, check: { attr: 'social', dc: 9 }, reward: 10, relations: { audrey: 1 }, desc: '塔罗会需要一个人确认：下一次聚会还会不会有人来。' },
      { id: 'letter', title: '给梅丽莎的信', location: 'city', days: 4, check: { attr: 'social', dc: 9 }, reward: 8, humanity: 1, desc: '有人要你把一封信送到水仙花街。收件人叫梅丽莎。' },
      { id: 'fog', title: '灰雾里的钟声', location: 'fog', days: 5, check: { attr: 'spirit', dc: 10 }, reward: 14, insight: 1, desc: '源堡的钟声多响了一下。有人要你去看。' }
    ],
    ambient: [
      { id: 'z1', location: 'sefirah', text: '克莱恩问你：“你后悔走到这里吗？”', choices: [{ label: '不后悔', effects: { humanity: 1 } }, { label: '后悔', effects: { madness: 1, insight: 1 } }] },
      { id: 'z2', location: 'fog', text: '灰雾里有一个声音在叫你的真名。', choices: [{ label: '回应', effects: { madness: 2 } }, { label: '沉默', effects: { spirit: 1 } }] },
      { id: 'z3', location: 'table', text: '长桌上多了一张空椅子。没有人知道是谁的。', choices: [{ label: '坐下来', effects: { humanity: 1, insight: 1 } }, { label: '把椅子推开', effects: { madness: 1 } }] },
      { id: 'z4', location: 'city', text: '一个孩子问你：“你是非凡者吗？”', choices: [{ label: '说不是', effects: { humanity: 1 } }, { label: '说是', effects: { reputation: 1 } }] }
    ],
    endings: {
      ordinary: [
        { id: 'fool_bookseller', title: '书店老板', headline: '《贝克兰德新开书店，店主称“只卖普通人的故事”》', cond: { humanity: 6 }, region: 'fool', text: '你在贝克兰德开了一家书店。你只卖普通人的故事。偶尔有人问起“愚者”，你说那是一个传说。' },
        { id: 'fool_teacher', title: '历史老师', headline: '《历史老师把“愚者”写进课外读物，被家长投诉》', cond: { insight: 10 }, region: 'fool', text: '你回大学教历史。你把“愚者”写进课外读物，被家长投诉。你坚持不删。' },
        { id: 'fool_flower', title: '廷根花店', headline: '《水仙花街花店重新开张，只卖葬礼白花》', cond: { money: 20 }, region: 'fool', text: '你回到廷根，重新开了一家花店。你只卖葬礼白花。每年春天，你会留一束给一个不会来的人。' },
        { id: 'fool_daily', title: '普通人的日常', headline: '《一个普通贝克兰德人的日常：面包、红茶和偶尔的怪梦》', cond: {}, region: 'fool', text: '你没有登上源堡，也没有成为愚者。你只是活了下来。每天早上读报，晚上关窗。偶尔梦见一张青铜长桌。' }
      ],
      core: [
        { id: 'fool_human', title: '人性的锚', headline: '《“愚者”只是传说；廷根花店老板拒绝采访》', cond: { humanity: 8, flags: ['saw_klein'] }, region: 'fool', text: '你站在源堡门口，念出每一个还活着的人的名字。门没有关。你回到廷根，开了一家花店。你仍然是“愚者”的见证者，但你先是一个人。' },
        { id: 'fool_sleep', title: '愚者的沉眠', headline: '《“愚者”先生沉眠，塔罗会称聚会继续》', cond: { flags: ['saw_klein'], humanity: 5 }, region: 'fool', text: '你走进源堡，替克莱恩关上了门。灰雾、青铜长桌、二十二张椅子，都退进黑暗。你坐下来，等下一次聚会。' },
        { id: 'fool_madness', title: '失控的旧日', headline: '《源堡方向出现“灰雾中的眼睛”，教会封锁街区》', cond: { madness: 9 }, region: 'fool', text: '你听见很多个自己在笑。你试图分辨哪一个是真的，却发现自己的手已经不在原来的位置。源堡的门没有关。' }
      ]
    },
    canon
  };
})();
