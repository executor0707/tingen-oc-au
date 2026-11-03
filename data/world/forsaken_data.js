/* ============================================================
   神弃之地 · 白银城 6 天（第六段）
   ============================================================ */
(function () {
  const canon = [
    { id: 'forsaken-e01', volumeId: 6, volumeTitle: '逐光者', index: 1, dayStart: 1, chStart: 1, chEnd: 20, dateLabel: '1351-09 / 第 1–20 章', title: '抵达白银城', location: '白银城', cast: ['戴里克', '科林'], canon: '你穿过黑暗，抵达白银城。城门上的灯很旧，但还亮着。', newspaper: '《白银城石板报》：外乡人入城；守门人称“灯还够用”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'forsaken-e02', volumeId: 6, volumeTitle: '逐光者', index: 2, dayStart: 2, chStart: 21, chEnd: 45, dateLabel: '1351-09 / 第 21–45 章', title: '月城的使者', location: '月城', cast: ['洛薇雅', '戴里克'], canon: '月城派来使者。他们带来一封信，和一份不该存在的礼物。', newspaper: '《白银城石板报》：月城使者称“黑暗正在退去”，长老会未回应。', interventions: ['旁观', '接触', '介入'] },
    { id: 'forsaken-e03', volumeId: 6, volumeTitle: '逐光者', index: 3, dayStart: 4, chStart: 46, chEnd: 75, dateLabel: '1351-09 / 第 46–75 章', title: '巨人王庭', location: '巨人王庭', cast: ['科林', '洛薇雅'], canon: '巨人王庭的废墟里还有光。科林说，那不是神迹，是有人替他们留的。', newspaper: '《白银城石板报》：远征队发现“古代光源”，教会称“需进一步确认”。', interventions: ['旁观', '接触', '介入'] },
    { id: 'forsaken-e04', volumeId: 6, volumeTitle: '逐光者', index: 4, dayStart: 6, chStart: 76, chEnd: 116, dateLabel: '1351-09 / 第 76–116 章', title: '太阳仪式', location: '光之祭坛', cast: ['戴里克', '科林'], canon: '太阳仪式在光之祭坛举行。戴里克站在最前面，像一根还没点燃的蜡烛。', newspaper: '《白银城石板报》：全城熄灯一夜；今晨太阳照常升起。', interventions: ['旁观', '接触', '介入'] }
  ];

  window.OC_FORSAKEN = {
    id: 'forsaken', name: '神弃之地', paper: '白银城石板报', dateLabel: '1351 年 9 月', maxDay: 90, storyMax: 6,
    intro: '这里没有太阳，只有人们自己点的灯。你从战争的烟尘里走进黑暗，发现黑暗并不空。',
    locations: [
      { id: 'white', name: '白银城', sub: '旧灯、石墙与不肯熄灭的人', icon: 'church', color: '#c9a35c' },
      { id: 'moon', name: '月城', sub: '月亮的碎片与沉默的使者', icon: 'moon', color: '#6a536f' },
      { id: 'court', name: '巨人王庭', sub: '废墟、王座与巨大的影子', icon: 'archive', color: '#8c9894' },
      { id: 'wild', name: '黑暗荒野', sub: '没有路，也没有星星', icon: 'map', color: '#3e4a52' },
      { id: 'altar', name: '光之祭坛', sub: '全城最后一盏灯', icon: 'spark', color: '#c9a35c' }
    ],
    npcLocations: { white: ['derek', 'colin'], moon: ['lovia'], court: ['colin'], wild: ['derek'], altar: ['derek', 'colin'] },
    npcs: [
      { id: 'derek', name: '戴里克·伯格', role: '白银城少年 / 太阳信徒', color: '#c9a35c', desc: '他相信光，也相信光会付出代价。他把你当客人，也当可能的见证人。' },
      { id: 'colin', name: '科林·伊利亚特', role: '白银城长老', color: '#8c9894', desc: '他负责让这座城继续亮着。他不太在乎神，只在乎灯油。' },
      { id: 'lovia', name: '洛薇雅', role: '月城使者', color: '#b18bc4', desc: '她说话像月亮一样轻。她带来的礼物，你不敢打开。' },
      { id: 'sun', name: '太阳信徒', role: '光之祭坛守卫', color: '#c9a35c', desc: '他从不摘下兜帽。他说自己在等一个“不会落下的太阳”。' }
    ],
    actions: {
      white: [
        { id: 'derek', label: '和戴里克说话', desc: '他想知道外面的太阳是什么样。', effects: { relations: { derek: 1 }, humanity: 1, insight: 1 }, text: '戴里克问：“外面的太阳，真的会照到每个人吗？”你说会。他笑了，像在听一个很好的故事。' },
        { id: 'colin', label: '找科林要灯油', desc: '城里的灯快不够了。', check: { attr: 'social', dc: 9 }, effects: { relations: { colin: 1 }, humanity: 1 }, fail: { notoriety: 1 }, text: '科林给了你半桶灯油，说：“别浪费。这里的黑暗会记住味道。”' },
        { id: 'board', label: '查看委托板', desc: '白银城需要人做的事。', effects: {}, openBoard: true, text: '委托板是一块石板，字是用刀刻的。' }
      ],
      moon: [
        { id: 'lovia', label: '见月城使者', desc: '她带来一封信和一份礼物。', effects: { relations: { lovia: 1 }, insight: 1, madness: 1 }, text: '洛薇雅把盒子推给你：“别在灯下打开。”' },
        { id: 'gift', label: '检查礼物', desc: '盒子里的东西在动。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 2, madness: 1 }, fail: { health: -2 }, text: '盒子里是一小块月亮。它在你手里慢慢变冷。' },
        { id: 'rest', label: '在月城过夜', desc: '这里的梦比黑暗更深。', effects: { health: 1, madness: 1 }, text: '你梦见自己站在一座没有影子的城里，所有人都抬头看天。' }
      ],
      court: [
        { id: 'colin', label: '和科林探索王庭', desc: '他想找到古代光源的线索。', effects: { relations: { colin: 1 }, insight: 2 }, text: '科林在一座倒塌的王座下找到一盏灯。灯油早就干了，灯芯却是新的。' },
        { id: 'throne', label: '坐上王座', desc: '只是一个动作。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 2, madness: 1 }, fail: { madness: 2 }, text: '你坐下去。王座比你想象的冷。你听见很多人在很远的地方喊一个名字。' },
        { id: 'search', label: '搜索废墟', desc: '找能带走的东西。', effects: { money: 6, insight: 1 }, text: '你找到一枚刻着太阳的铜币。它不属于这个时代。' }
      ],
      wild: [
        { id: 'scout', label: '进入黑暗荒野', desc: '为白银城找一条路。', check: { attr: 'body', dc: 9 }, effects: { insight: 2, body: 1 }, fail: { health: -2 }, text: '你在黑暗里走了很久。回来时，你带回一张怪物的皮和一条新的路。' },
        { id: 'derek', label: '带戴里克一起走', desc: '他想看看城外。', effects: { relations: { derek: 1 }, humanity: 1 }, text: '戴里克一路都在数自己的脚步。他说：“这样就知道回程有多远。”' },
        { id: 'listen', label: '停下来听黑暗', desc: '黑暗里有东西在呼吸。', check: { attr: 'spirit', dc: 9 }, effects: { madness: 2, insight: 2 }, fail: { madness: 1 }, text: '你听见黑暗在模仿你的呼吸。你停下来，它也停下来。' }
      ],
      altar: [
        { id: 'ritual', label: '参加太阳仪式', desc: '把光带回城里。', check: { attr: 'spirit', dc: 10 }, effects: { humanity: 2, insight: 1 }, fail: { health: -2, madness: 1 }, text: '仪式完成了。光只持续了十几秒，但足够让所有人看见，黑暗不是没有边界的。' },
        { id: 'derek', label: '站在戴里克身边', desc: '他看起来太年轻了。', effects: { relations: { derek: 1 }, humanity: 2 }, text: '戴里克没有回头。他说：“如果我点不亮，你替我点。”' },
        { id: 'sun', label: '和太阳信徒说话', desc: '他一直在等一个不会落下的太阳。', effects: { relations: { sun: 1 }, insight: 1, madness: 1 }, text: '信徒说：“太阳不是神。太阳是有人愿意替别人亮着。”' }
      ]
    },
    commissions: [
      { id: 'oil', title: '找灯油', location: 'white', days: 3, check: { attr: 'luck', dc: 8 }, reward: 8, humanity: 1, desc: '白银城的灯油快用完了。长老说“能找多少算多少”。' },
      { id: 'moonletter', title: '月城的信', location: 'moon', days: 4, check: { attr: 'insight', dc: 9 }, reward: 12, relations: { lovia: 1 }, desc: '洛薇雅需要有人把信送到白银城，不能经过长老会。' },
      { id: 'ruin', title: '王庭的灯', location: 'court', days: 5, check: { attr: 'body', dc: 9 }, reward: 15, insight: 1, desc: '科林想找回王庭里的那盏灯。它可能还能亮。' },
      { id: 'wild', title: '荒野的路线', location: 'wild', days: 5, check: { attr: 'body', dc: 10 }, reward: 16, notoriety: 1, desc: '远征队需要一条能避开怪物的路。' },
      { id: 'ritual', title: '仪式的见证人', location: 'altar', days: 6, check: { attr: 'spirit', dc: 9 }, reward: 18, humanity: 1, desc: '戴里克需要一个人在仪式后告诉城里的人：光真的来过。' }
    ],
    ambient: [
      { id: 'f1', location: 'white', text: '一个孩子问你：“外面的太阳会下山吗？”', choices: [{ label: '说会', effects: { humanity: 1 } }, { label: '说不会', effects: { madness: 1 } }] },
      { id: 'f2', location: 'moon', text: '洛薇雅说：“月亮是死的。但它的光还活着。”', choices: [{ label: '问她什么意思', effects: { relations: { lovia: 1 }, insight: 1 } }, { label: '不接话', effects: { spirit: 1 } }] },
      { id: 'f3', location: 'court', text: '王座后面有一行字，被磨得几乎看不清：“光会回来。”', choices: [{ label: '拓下来', effects: { insight: 2 } }, { label: '摸一摸', effects: { madness: 1, humanity: 1 } }] },
      { id: 'f4', location: 'wild', text: '黑暗里有人叫你的名字。声音像戴里克。', choices: [{ label: '回应', effects: { madness: 2 } }, { label: '继续走', effects: { body: 1 } }] },
      { id: 'f5', location: 'altar', text: '太阳信徒把兜帽摘下来。你看见一张和你很像的脸。', choices: [{ label: '问他这是不是真的', effects: { madness: 2, insight: 1 } }, { label: '移开视线', effects: { health: 1 } }] }
    ],
    endings: {
      ordinary: [
        { id: 'forsaken_keeper', title: '守灯人', headline: '《白银城守灯人称“灯比神可靠”》', cond: { humanity: 7 }, region: 'forsaken', text: '你留在白银城，负责给灯添油。你每天检查三次灯芯。城里的人说，你是他们见过最不信神、却最像信徒的人。' },
        { id: 'forsaken_hunter', title: '荒野猎人', headline: '《远征队新增猎人，专杀“会学人呼吸的东西”》', cond: { body: 6 }, region: 'forsaken', text: '你成了黑暗荒野的猎人。你带远征队走安全的路，也带他们看不该看的东西。你从不走同一条路两次。' },
        { id: 'forsaken_scholar', title: '王庭学者', headline: '《巨人王庭研究者称“光是可以被保存的”》', cond: { insight: 11 }, region: 'forsaken', text: '你留在巨人王庭研究那盏灯。你相信光可以被保存，也相信保存光的人会先被光烧掉。' },
        { id: 'forsaken_daily', title: '神弃之地的普通人', headline: '《一个白银城居民的日常：黑面包、灯油和偶尔的太阳》', cond: {}, region: 'forsaken', text: '你没有把太阳带回白银城，也没有被黑暗吞掉。你只是活了下来。每天早上检查灯，晚上听老人讲光的故事。' }
      ],
      core: [
        { id: 'forsaken_light', title: '逐光者', headline: '《本报记者称“太阳仪式”只是集体幻觉》', cond: { flags: ['saw_klein'], humanity: 7 }, region: 'forsaken', text: '你参加了太阳仪式，也看见了光。你不知道那是不是神，但你知道那一刻，全城的人都抬起了头。你后来离开了白银城，带着一小块没有熄灭的灯芯。' }
      ]
    },
    canon
  };
})();
