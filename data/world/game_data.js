window.OC_DATA = {
  maxDay: 120,
  storyMax: 30,
  origins: [
    { id: 'tingen', name: '廷根平民', desc: '你熟悉每条后巷，也熟悉面包涨价。', mods: { luck: 1, money: 2 }, flavor: '水仙花街的邻居记得你小时候的样子。' },
    { id: 'backlund', name: '贝克兰德中产', desc: '你读过书，也见过雾里的人怎么消失。', mods: { social: 1, money: 8 }, flavor: '你带着一只旧皮箱来到廷根，箱子里有一本没写完的日记。' },
    { id: 'south', name: '南大陆混血', desc: '你见过死神后裔的葬礼，也见过殖民地的太阳。', mods: { body: 1, spirit: 1 }, flavor: '你的皮肤和口音让你在廷根显眼，但也让你更早学会看人。' },
    { id: 'intis', name: '因蒂斯移民', desc: '你相信罗塞尔的理性，也相信面包比神更实在。', mods: { insight: 1, social: 1 }, flavor: '你在因蒂斯学会打牌，在廷根学会闭嘴。' },
    { id: 'orphan', name: '教会孤儿', desc: '黑夜女神教会养大了你，但没告诉你所有事。', mods: { spirit: 1, humanity: 1 }, flavor: '你熟悉圣赛琳娜教堂的每一块地砖，包括那些不该踩的。' }
  ],
  pathways: [
    { id: 'seer', name: '占卜家', seq: 9, desc: '灵摆、卡牌、灵视；能看见一点命运，但缺乏直接对敌手段。', mods: { insight: 2, spirit: 1 }, ability: '灵摆预知：每天一次，在判定前重掷。', flavor: '你听见命运在耳边翻页。' },
    { id: 'mystery', name: '窥秘人', seq: 9, desc: '神秘学知识全面，能感知隐藏的存在，也容易被它们感知。', mods: { insight: 2, madness: 1 }, ability: '灵视：更容易看穿谎言与气场。', flavor: '知识是门，门后总有东西。' },
    { id: 'corpse', name: '收尸人', seq: 9, desc: '能忍耐死亡气息，看见部分亡灵，了解不死生物的弱点。', mods: { body: 2, spirit: 1 }, ability: '安魂：在墓地/疯人院判定 +2。', flavor: '你身上总有一点冷。' },
    { id: 'sleepless', name: '不眠者', seq: 9, desc: '擅长格斗、射击、攀爬和感应；黑夜是朋友。', mods: { body: 1, spirit: 1, insight: 1 }, ability: '守夜：夜间行动不额外消耗。', flavor: '你很少做梦。' }
  ],
  flaws: [
    { id: 'insomnia', name: '失眠', desc: '每晚疯狂 +1。', mods: { madness: 1 } },
    { id: 'debt', name: '债务', desc: '初始金钱 -10，债主会来找你。', mods: { money: -10 } },
    { id: 'wanted', name: '通缉', desc: '初始恶名 +2，警察会盘问。', mods: { notoriety: 2 } },
    { id: 'tainted', name: '污染', desc: '初始疯狂 +1，灵性 +1。', mods: { madness: 1, spirit: 1 } },
    { id: 'attachment', name: '牵挂', desc: '你有一个必须保护的人，关系判定 +1。', mods: { humanity: 1 } }
  ],
  contacts: [
    { id: 'dunn', name: '值夜者线人', desc: '黑荆棘的邓恩愿意听你说十分钟。', mods: { relations: { dunn: 1 } } },
    { id: 'dealer', name: '地下商人', desc: '码头区有人欠你一个人情。', mods: { money: 10, relations: { dealer: 1 } } },
    { id: 'reporter', name: '报社记者', desc: '《廷根老实人报》有人愿意替你登一条小消息。', mods: { reputation: 1 } },
    { id: 'detective', name: '私家侦探', desc: '他教过你怎么看人，也教过你怎么跑。', mods: { insight: 1 } },
    { id: 'church', name: '教会执事', desc: '圣赛琳娜教堂的侧门为你留过一盏灯。', mods: { relations: { church: 1 }, humanity: 1 } }
  ],
  looks: [
    { id: 'hat', name: '半高礼帽', desc: '体面，但容易在人群里被记住。' },
    { id: 'coat', name: '旧风衣', desc: '挡雨，也挡血。' },
    { id: 'monocle', name: '单片眼镜', desc: '看起来像学者，也像骗子。' },
    { id: 'scar', name: '脸颊疤痕', desc: '你说那是猫抓的，没人信。' },
    { id: 'plain', name: '普通人的脸', desc: '最适合消失在人群里。' }
  ],
  locations: [
    { id: 'home', name: '水仙花街', sub: '租来的房间与热红茶', icon: 'home', color: '#b08a4a' },
    { id: 'blackthorn', name: '黑荆棘安保公司', sub: '佐特兰街 36 号 2 楼', icon: 'archive', color: '#8e2f3c' },
    { id: 'club', name: '豪尔斯占卜俱乐部', sub: '黄水晶房与锡伯红茶', icon: 'club', color: '#c9a35c' },
    { id: 'asylum', name: '廷根疯人院', sub: '铁门、长走廊与绿漆', icon: 'asylum', color: '#5b6f6a' },
    { id: 'docks', name: '码头区', sub: '恶龙酒吧、仓库与潮气', icon: 'factory', color: '#3e6b7a' },
    { id: 'church', name: '圣赛琳娜教堂', sub: '红月亮街与查尼斯门', icon: 'church', color: '#6a536f' }
  ],
  npcs: [
    { id: 'klein', name: '克莱恩·莫雷蒂', role: '值夜者 / 占卜家', color: '#c9a35c', desc: '一个看起来有些疲惫的年轻人。你总觉得他看人的方式不像一个普通的占卜家。' },
    { id: 'dunn', name: '邓恩·史密斯', role: '值夜者队长', color: '#8c9894', desc: '温和、健忘、可靠。你总觉得他身上有一层很薄的疲惫。' },
    { id: 'leonard', name: '伦纳德·米切尔', role: '午夜诗人', color: '#709b7a', desc: '诗人、值夜者、嘴贫。他看你的眼神像在写一首还没押韵的诗。' },
    { id: 'melissa', name: '梅丽莎·莫雷蒂', role: '技术学校学生', color: '#c6a78d', desc: '克莱恩的妹妹。她不知道你是谁，但知道你最近总在夜里出门。' },
    { id: 'christina', name: '克里斯蒂娜', role: '梅高欧丝的姨母', color: '#b38a63', desc: '务实、焦虑、护短。她愿意付钱，也愿意听真话。' },
    { id: 'rosa', name: '罗珊', role: '黑荆棘接待', color: '#c9a35c', desc: '黑荆棘的活地图。只要一杯茶，她什么都能聊。' },
    { id: 'frye', name: '弗莱', role: '收尸人', color: '#7c8189', desc: '话少，手稳。他见过太多尸体，所以对活人反而客气。' }
  ],
  actions: {
    home: [
      { id: 'rest', label: '休息', desc: '睡一会儿，或者假装睡一会儿。', effects: { health: 2, madness: -1 }, text: '你把窗帘拉上。红月从缝隙里漏进来，像一条很细的伤口。' },
      { id: 'read', label: '读报纸与笔记', desc: '整理已知的 canon 事件和传闻。', effects: { insight: 1, reputation: 1 }, text: '你把报纸上的行踪剪下来，贴在笔记本上。有些名字你已经见过。' },
      { id: 'melissa', label: '和梅丽莎说话', desc: '她住在隔壁，总在修一块旧怀表。', effects: { humanity: 1, relations: { melissa: 1 }, madness: -1 }, text: '梅丽莎没有问你去哪。她只把一杯红茶推过来，说：“你看起来像三天没睡。”' },
      { id: 'retire', label: '认真考虑退出非凡世界', desc: '你可以在第 8 天以后选择退休。', effects: {}, text: '你开始算一笔账：房租、面包、花店的门面。非凡世界很远，账单很近。', retire: true }
    ],
    blackthorn: [
      { id: 'dunn', label: '找邓恩聊聊', desc: '值夜者队长愿意听你说十分钟。', effects: { relations: { dunn: 1 }, humanity: 1 }, text: '邓恩给你倒了杯咖啡，然后忘了自己已经倒过一杯。' },
      { id: 'klein', label: '和克莱恩说几句话', desc: '那个年轻人总坐在窗边，像在等一封不会来的信。', effects: { relations: { klein: 1 }, insight: 1, flags: { saw_klein: true } }, text: '克莱恩抬头看了你一眼。他说：“你最近最好别在晚上出门。”你问为什么，他只是笑了一下。' },
      { id: 'archive', label: '查内部档案', desc: '关于 2-049、兰尔乌斯、红烟囱。', check: { attr: 'insight', dc: 9 }, effects: { insight: 1, reputation: 1 }, fail: { madness: 1 }, text: '你在档案室待到眼睛发酸。纸页上有一些被剪掉的名字。' },
      { id: 'lev', label: '找伦纳德', desc: '诗人今天值班，心情不错。', effects: { relations: { leonard: 1 }, insight: 1 }, text: '伦纳德把脚翘在桌上，给你念了一首关于雾的诗。你假装没听懂。' },
      { id: 'board', label: '查看委托板', desc: '教会、私家、地下市场的委托。', effects: {}, openBoard: true, text: '委托板上钉着几张纸，有一张的边角被血粘住了。' }
    ],
    club: [
      { id: 'divine', label: '替人占卜', desc: '赚一点钱，也听一点不该听的事。', check: { attr: 'insight', dc: 8 }, effects: { money: 5, reputation: 1 }, fail: { money: -2, madness: 1 }, text: '黄水晶在纸上转了一圈。客人说你想骗钱，但走的时候还是多给了半便士。' },
      { id: 'christina', label: '见克里斯蒂娜', desc: '她带来梅高欧丝的消息。', effects: { relations: { christina: 1 }, insight: 1 }, text: '克里斯蒂娜把一张照片推过来。照片上的姑娘有一头金发，手放在小腹上。' },
      { id: 'gossip', label: '听俱乐部里的传闻', desc: '关于黑荆棘、码头和红烟囱。', effects: { insight: 1, luck: 1 }, text: '你听见有人说，黑荆棘昨晚又有人抬着担架进去。' }
    ],
    asylum: [
      { id: 'dust', label: '找达斯特', desc: '疯人院医生，知道很多不该知道的事。', effects: { insight: 1, relations: { frye: 1 } }, text: '达斯特说：“你最好别见胡德。他最近总在数拍子。”' },
      { id: 'nightshift', label: '值夜班', desc: '缺人，钱不少，风险也不小。', check: { attr: 'body', dc: 9 }, effects: { money: 6, madness: 1 }, fail: { health: -2, madness: 1 }, text: '走廊尽头有扇门一直在响。你假装没听见。' },
      { id: 'frye', label: '和弗莱说话', desc: '收尸人今天在停尸房。', effects: { relations: { frye: 1 }, humanity: 1 }, text: '弗莱递给你一副手套，说：“别碰第三具。他还没死透。”' }
    ],
    docks: [
      { id: 'work', label: '打零工', desc: '搬货、卸货、被工头骂。', effects: { money: 4, body: 1, health: -1 }, text: '你扛了一下午的箱子。工头说你看起来不像干这行的。' },
      { id: 'market', label: '逛地下市场', desc: '买材料，卖消息，听不该听的价。', effects: { money: -3, insight: 1, notoriety: 1 }, text: '有人卖一枚沾血的黄铜纽扣，开价三镑。你没买，但记住了他的脸。' },
      { id: 'lan', label: '打听兰尔乌斯', desc: '那个骗子最近在码头出现过。', check: { attr: 'social', dc: 9 }, effects: { insight: 1, notoriety: 1 }, fail: { health: -1 }, text: '一个搬运工说，兰尔乌斯上周来过，带着一个金发女人。' },
      { id: 'board', label: '查看委托板', desc: '码头区的委托，报酬高，风险也高。', effects: {}, openBoard: true, text: '委托板被海风吹得发白。上面有几张纸，字迹很潦草。' }
    ],
    church: [
      { id: 'pray', label: '向黑夜女神祈祷', desc: '不祈求胜利，只求少死几个人。', effects: { madness: -1, humanity: 1 }, text: '彩窗把红月滤成碎玻璃。你坐了一会儿，什么也没求。' },
      { id: 'bone', label: '打听圣者骨灰', desc: '查尼斯门后面的事，不该多问。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 1, reputation: 1 }, fail: { madness: 1 }, text: '西迦看了你一眼，说：“有些东西，知道得越少越安全。”' },
      { id: 'board', label: '查看教会委托', desc: '送信、守夜、清理墓园。', effects: {}, openBoard: true, text: '教会委托都很短，像祷告词。' }
    ]
  },
  commissions: [
    { id: 'cat', title: '寻找走失的猫', location: 'club', days: 4, check: { attr: 'social', dc: 8 }, reward: 5, rep: 1, desc: '一位夫人愿意为她的猫付五镑。猫可能只是不想回家。' },
    { id: 'worker', title: '码头失踪工人', location: 'docks', days: 6, check: { attr: 'insight', dc: 10 }, reward: 12, notoriety: 1, desc: '三个搬运工连续失踪。工头说他们只是拿了工钱跑了。' },
    { id: 'letter', title: '替教会送信', location: 'church', days: 3, check: { attr: 'luck', dc: 8 }, reward: 6, relations: { church: 1 }, desc: '一封不能走邮局的信，收件人住在北区。' },
    { id: 'asylum', title: '疯人院夜班', location: 'asylum', days: 5, check: { attr: 'body', dc: 9 }, reward: 8, madness: 1, desc: '缺一个不怕黑的人。上一任夜班说走廊里有第二个人的脚步声。' },
    { id: 'archive', title: '整理黑荆棘旧档', location: 'blackthorn', days: 4, check: { attr: 'insight', dc: 8 }, reward: 7, relations: { dunn: 1 }, desc: '旧档案里有几页被剪掉了。邓恩说“按原样归档就好”。' },
    { id: 'fake', title: '占卜俱乐部的假委托', location: 'club', days: 7, check: { attr: 'insight', dc: 11 }, reward: 15, notoriety: 1, desc: '委托人要你找一个人。你怀疑那个人根本不存在。' },
    { id: 'auction', title: '码头地下拍卖', location: 'docks', days: 8, check: { attr: 'social', dc: 10 }, reward: 20, notoriety: 2, desc: '有人要你混进拍卖会，确认一件“不能描述”的拍品。' },
    { id: 'grave', title: '墓园守夜', location: 'church', days: 5, check: { attr: 'spirit', dc: 9 }, reward: 9, humanity: 1, desc: '墓园最近有动静。教会说是野狗，你知道不是。' }
  ],
  ambient: [
    { id: 'a1', location: 'home', text: '楼下的房东又在骂人，说这个月的瓦斯费涨了。', choices: [{ label: '下去和他吵', effects: { humanity: -1, notoriety: 1 } }, { label: '假装不在家', effects: { luck: 1 } }] },
    { id: 'a2', location: 'home', text: '梅丽莎在门口放了一小袋面包，没有留字条。', choices: [{ label: '收下，敲她的门道谢', effects: { humanity: 1, relations: { melissa: 1 } } }, { label: '收下，什么也不说', effects: { humanity: -1 } }] },
    { id: 'a3', location: 'blackthorn', text: '罗珊压低声音说，昨晚有人看见伦纳德在屋顶上念诗。', choices: [{ label: '去找伦纳德问', effects: { relations: { leonard: 1 }, insight: 1 } }, { label: '当成没听见', effects: {} }] },
    { id: 'a4', location: 'blackthorn', text: '邓恩又在找他的烟斗。这已经是今天第三次。', choices: [{ label: '帮他找', effects: { relations: { dunn: 1 }, humanity: 1 } }, { label: '提醒他昨晚放在档案室', effects: { insight: 1 } }] },
    { id: 'a5', location: 'club', text: '一位客人坚持要占卜“我什么时候死”。', choices: [{ label: '拒接这单', effects: { humanity: 1 } }, { label: '收钱，说一个模糊的答案', effects: { money: 3, notoriety: 1 } }] },
    { id: 'a6', location: 'club', text: '黄水晶房里的灯闪了一下。你听见有人在你耳边念了一个名字。', choices: [{ label: '打开灵视', effects: { madness: 1, insight: 2 } }, { label: '关灯离开', effects: { luck: 1 } }] },
    { id: 'a7', location: 'asylum', text: '走廊尽头的房间里，有人在数拍子。一、二、三……', choices: [{ label: '推门进去', effects: { madness: 1, insight: 2 } }, { label: '叫达斯特', effects: { relations: { frye: 1 } } }] },
    { id: 'a8', location: 'asylum', text: '弗莱正在给一具尸体盖白布。他看了你一眼：“你身上有坟土味。”', choices: [{ label: '告诉他你最近去过墓地', effects: { relations: { frye: 1 }, humanity: 1 } }, { label: '否认', effects: { madness: 1 } }] },
    { id: 'a9', location: 'docks', text: '一个小孩在卖“能看见未来的石头”，只要一便士。', choices: [{ label: '买一块', effects: { money: -1, luck: 1 } }, { label: '告诉他这是骗局', effects: { humanity: 1 } }] },
    { id: 'a10', location: 'docks', text: '仓库后面有人在低声争论“红烟囱”和“孩子”。', choices: [{ label: '靠近偷听', effects: { insight: 1, notoriety: 1 } }, { label: '记住他们的脸，离开', effects: { insight: 1 } }] },
    { id: 'a11', location: 'church', text: '一位老妇人在为死去的丈夫点蜡烛。她说他昨晚回来过。', choices: [{ label: '用灵视看看', effects: { spirit: 1, madness: 1 } }, { label: '陪她坐一会儿', effects: { humanity: 1 } }] },
    { id: 'a12', location: 'church', text: '西迦·特昂在走廊里叫住你：“你最近是不是在查兰尔乌斯？”', choices: [{ label: '承认', effects: { relations: { church: 1 }, insight: 1 } }, { label: '否认', effects: { notoriety: 1 } }] },
    { id: 'a13', location: 'home', text: '你梦见自己站在一片灰雾里，面前有一张青铜长桌。', choices: [{ label: '走向长桌', effects: { madness: 1, insight: 2 } }, { label: '醒来', effects: { health: -1 } }] },
    { id: 'a14', location: 'blackthorn', text: '伦纳德把一张纸条塞给你：“有人在你家门口站了两个小时。”', choices: [{ label: '立刻回家', effects: { notoriety: 1, health: -1 } }, { label: '请伦纳德陪你回去', effects: { relations: { leonard: 1 } } }] },
    { id: 'a15', location: 'club', text: '克里斯蒂娜问你：“你觉得梅高欧丝的孩子还来得及吗？”', choices: [{ label: '说真话', effects: { humanity: 1, relations: { christina: 1 } } }, { label: '说一个善意的谎', effects: { humanity: -1, madness: 1 } }] },
    { id: 'a16', location: 'docks', text: '恶龙酒吧的老板说，昨晚有个金发女人来打听“红烟囱”。', choices: [{ label: '追问细节', effects: { insight: 1, notoriety: 1 } }, { label: '买一杯酒，坐下等', effects: { money: -1, luck: 1 } }] }
  ],
  endings: {
    ordinary: [
      { id: 'flower', title: '花店老板', headline: '《水仙花街新开花店：只卖葬礼白花与深眠花》', cond: { humanity: 6 }, text: '你在水仙花街租下一个小门面。白天卖花，晚上把地下室的门锁好。值夜者偶尔来买葬礼白花，没人知道你曾经差点走进黑夜。' },
      { id: 'mayor', title: '区长', headline: '《新任区长承诺先修黑荆棘门口的路灯》', cond: { reputation: 8 }, text: '你靠举报邪教徒、修下水道和一张会说话的嘴当选区长。第一件事是把黑荆棘门口的路灯修好。你不再碰封印物，但会认真读每一份“瓦斯泄漏”报告。' },
      { id: 'teacher', title: '霍伊大学历史老师', headline: '《历史系新讲师把罗塞尔日记列为课外读物》', cond: { insight: 12 }, text: '你回到霍伊大学，教历史。学生说你什么都懂一点。你把罗塞尔日记放在推荐书单最后一栏，从不解释为什么。' },
      { id: 'detective', title: '私家侦探', headline: '《侦探事务所专找猫、抓奸、查账，不接非凡事件》', cond: { insight: 8 }, text: '你开了一家侦探事务所。找猫、抓奸、查账，偶尔帮人写情书。有人问你要不要接“更刺激的活”，你把价目表翻到背面，上面写着“不接”。' },
      { id: 'editor', title: '报社主编', headline: '《本报头版承诺：本周无异常》', cond: { reputation: 6 }, text: '你成了《廷根老实人报》的主编。头版永远是“本周无异常”。你知道这句话有多假，但你也知道，很多人需要这句话才能睡着。' },
      { id: 'cafe', title: '贝克兰德咖啡馆', headline: '《“愚者特调”走红，店主拒绝解释杯垫为何自己转》', cond: { money: 30 }, text: '你在贝克兰德开了一家咖啡馆。招牌是“愚者特调”。没人知道为什么杯子会自己转，你只说“是蒸汽管道的问题”。' },
      { id: 'priest', title: '小教堂牧师', headline: '《新牧师主持葬礼时从不提“黑夜”二字》', cond: { humanity: 7 }, text: '你成了黑夜女神教会的小牧师，主要工作是主持葬礼和听人抱怨。你从不提自己见过真正的黑夜。' },
      { id: 'farm', title: '南大陆农场', headline: '《南大陆咖啡丰收，工人称每年同一天做同一个梦》', cond: { money: 40 }, text: '你在南大陆种咖啡。收成不错，工人也肯留下。只是每年有一天，所有人都会梦见同一扇门。你从不问门后面是什么。' },
      { id: 'clown', title: '马戏团小丑', headline: '《巡回马戏团小丑：笑是门手艺，也是保命术》', cond: { acting: 3 }, text: '你加入巡回马戏团，成了真正的小丑。你发现扮演法在舞台上意外好用。观众笑的时候，你偶尔会想起红月。' },
      { id: 'librarian', title: '图书馆管理员', headline: '《霍伊大学图书馆“闹鬼”，所有神秘学书籍不翼而飞》', cond: { insight: 15 }, text: '你成了霍伊大学图书馆管理员。所有神秘学书籍都被你“借”走。学生说那里闹鬼，你说是空调。' },
      { id: 'wanted', title: '通缉犯', headline: '《通缉犯自称只是不想加班，警方称其“极度危险”》', cond: { notoriety: 6 }, text: '你成了通缉犯。罪名是冒充警察、扰乱治安、疑似邪教徒。你其实只是不想加班。' },
      { id: 'daily', title: '普通人的日常', headline: '《一个普通人的日常：面包、红茶、和偶尔的怪梦》', cond: {}, text: '你没有拯救世界，也没有失控。你只是活了下来。偶尔在报纸上看到“愚者”的传说，你会把报纸折好，垫在桌脚下。' }
    ],
    core: [
      { id: 'witness', title: '愚者的见证者', headline: '《本报记者称“愚者”只是一个传说》', cond: { flags: ['saw_klein'], humanity: 6 }, text: '你见过克莱恩三次，但从未揭穿他。你活到了最后，成了少数知道“愚者”真的存在的人。你没有登上舞台，只是坐在观众席，替他保留了一个座位。' },
      { id: 'nighthawk', title: '新的值夜者队长', headline: '《黑荆棘安保公司迎来新队长》', cond: { relations: { dunn: 4 } }, text: '你成了黑荆棘的新队长。你继承了邓恩的烟斗，也继承了他的健忘。你每天在黑荆棘门口修路灯。' },
      { id: 'secret', title: '隐秘组织首领', headline: '《警方称某“读书会”与多起失踪案有关》', cond: { notoriety: 6, insight: 12 }, text: '你接管了一个隐秘组织。成员叫你“先生”。你从不让他们看见你的脸，也从不让他们知道，你只是想找一个能安静读书的地方。' },
      { id: 'sacrifice', title: '牺牲者', headline: '《无名氏在廷根灾难中失踪，没有人知道他的名字》', cond: { flags: ['intervened_final'], humanity: 7 }, text: '你在黑荆棘之夜替别人挡下了那一下。你没有留下名字。报纸只写“无名氏”。梅丽莎在你的门口放了一束白花。' },
      { id: 'demigod', title: '半神', headline: '《廷根上空出现第二次红月？气象学会称“光学现象”》', cond: { sequence: 4 }, text: '你成为了半神。你站在红月下，听见很多人的祈祷。你没有回应。你只是想起廷根的面包和红茶。' },
      { id: 'fool_sleep', title: '愚者沉眠', headline: '《“愚者”先生沉眠，塔罗会称聚会继续》', cond: { flags: ['saw_klein'], sequence: 5 }, text: '你活到了“愚者”沉眠的那一天。塔罗会还在，长桌还在。你坐在最末的椅子上，替所有人关上了门。' }
    ],
    bad: [
      { id: 'mad', title: '失控的旧日', headline: '《廷根港出现“雾中怪物”，教会封锁整个街区》', cond: { madness: 10 }, text: '你听见很多个自己在笑。你试图分辨哪一个是真的，却发现自己的手已经不在原来的位置。' },
      { id: 'dead', title: '无名死者', headline: '《码头发现一具无名尸体，随身物品只有一张塔罗牌》', cond: { health: 0 }, text: '你倒在码头的潮气里。最后一个念头是：明天报纸会不会写错我的名字。' },
      { id: 'erased', title: '被 0-08 写掉', headline: '《本报更正：昨日报道中的人物并不存在》', cond: { flags: ['marked_by_08'] }, text: '你记得自己来过廷根。但报纸不记得，档案不记得，连梅丽莎都不记得。只有灰雾里多了一张空椅子。' }
    ]
  }
};
