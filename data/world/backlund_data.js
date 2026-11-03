/* ============================================================
   贝克兰德 · 第二段 14 天
   与廷根共享玩家、关系、存档和结局；不包含原作长段正文。
   ============================================================ */
(function () {
  const v2 = (window.CANON_EVENTS || []).filter(e => e.volumeId === 2);
  const days = [1, 2, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14];
  const backlundCanon = v2.slice(0, 12).map((e, i) => Object.assign({}, e, { dayStart: days[i] }));

  window.OC_BACKLUND = {
    id: 'backlund',
    name: '贝克兰德',
    paper: '贝克兰德日报',
    maxDay: 14,
    intro: '贝克兰德的雾比廷根厚。你换了名字，换了住处，但报纸还是每天送到门口。',
    locations: [
      { id: 'lodging', name: '东区出租屋', sub: '煤气灯、旧地毯与一封没拆的信', icon: 'home', color: '#b08a4a' },
      { id: 'detective', name: '莫里亚蒂侦探事务所', sub: '夏洛克·莫里亚蒂的招牌', icon: 'archive', color: '#8e2f3c' },
      { id: 'west', name: '皇后区', sub: '沙龙、马车与体面的谎言', icon: 'club', color: '#c9a35c' },
      { id: 'docks', name: '贝克兰德码头', sub: '塔索克河、仓库与雾', icon: 'factory', color: '#3e6b7a' },
      { id: 'church', name: '黑夜教堂', sub: '彩窗、长椅与安静的告解室', icon: 'church', color: '#6a536f' },
      { id: 'university', name: '贝克兰德大学', sub: '图书馆、讲厅与旧手稿', icon: 'book', color: '#6f7f68' }
    ],
    npcLocations: {
      lodging: ['klein'],
      detective: ['klein', 'glaint'],
      west: ['audrey', 'tallim'],
      docks: ['forsth'],
      church: ['glaint'],
      university: ['forsth', 'tallim']
    },
    npcs: [
      { id: 'klein', name: '夏洛克·莫里亚蒂', role: '私家侦探 / 占卜家', color: '#c9a35c', desc: '你认识他另一个名字，但他没有主动提。他看你的眼神像在确认一张牌。' },
      { id: 'audrey', name: '奥黛丽·霍尔', role: '霍尔家族小姐', color: '#c9b26d', desc: '她真诚、好奇，且比你想象的更擅长看穿别人。' },
      { id: 'tallim', name: '塔利姆·杜恩', role: '贝克兰德大学学生', color: '#8c9894', desc: '一个总在借钱、总在写诗的年轻人。他把你当朋友，也可能把你当退路。' },
      { id: 'glaint', name: '格莱林特', role: '神秘学爱好者', color: '#709b7a', desc: '他相信所有神秘事件都有解释，并且愿意为解释付钱。' },
      { id: 'forsth', name: '佛尔思·沃尔', role: '作家 / 非凡者', color: '#b18bc4', desc: '她看起来像刚睡醒，稿子却总能按时交。她似乎知道很多不该知道的事。' }
    ],
    actions: {
      lodging: [
        { id: 'rest', label: '休息', desc: '把门反锁，睡到煤气灯自己熄灭。', effects: { health: 2, madness: -1 }, text: '你梦见一条没有尽头的走廊。醒来时，煤气灯还亮着。' },
        { id: 'read', label: '读《贝克兰德日报》', desc: '雾霾、失踪、和一位侦探的广告。', effects: { insight: 1, reputation: 1 }, text: '报纸第三版有一则小广告：莫里亚蒂侦探事务所，承接寻人、寻物、查账。' },
        { id: 'plan', label: '整理下一步', desc: '在贝克兰德，信息比钱更值钱。', effects: { insight: 1 }, text: '你把地名、人名、日期写在纸上。雾从窗缝里渗进来，纸角慢慢变软。' },
        { id: 'retire', label: '认真考虑退出非凡世界', desc: '贝克兰德可以藏住一个人，也可以藏住一个花店。', effects: {}, retire: true, text: '你开始算房租、咖啡豆和一个不需要再躲的名字。', retireOnly: true }
      ],
      detective: [
        { id: 'klein', label: '和夏洛克聊聊', desc: '他今天没有出门，桌上摆着一副塔罗牌。', effects: { relations: { klein: 1 }, insight: 1, flags: { saw_klein: true } }, text: '夏洛克给你倒了杯红茶。他说：“你最近最好少去东区。”你问为什么，他把一张牌翻过来：愚者。' },
        { id: 'investigate', label: '查一桩委托', desc: '寻找失踪者，或至少找到他留下的东西。', check: { attr: 'insight', dc: 9 }, effects: { insight: 1, reputation: 1 }, fail: { madness: 1 }, text: '你在雾里走了三条街，最后在一间当铺找到失踪者的怀表。' },
        { id: 'glaint', label: '见格莱林特', desc: '他又带来一个“绝对真实”的神秘学故事。', effects: { relations: { glaint: 1 }, money: 4 }, text: '格莱林特为你的十分钟付了四镑。他讲的故事一半是假的，另一半你希望是假的。' },
        { id: 'board', label: '查看委托板', desc: '贝克兰德的委托，报酬更高，雾也更厚。', effects: {}, openBoard: true, text: '委托板上钉着一张被雾打湿的纸。' }
      ],
      west: [
        { id: 'audrey', label: '拜访奥黛丽', desc: '霍尔家的小姐对“非凡世界”有太多问题。', effects: { relations: { audrey: 1 }, humanity: 1, insight: 1 }, text: '奥黛丽请你喝茶，问了很多问题。你回答得很谨慎，她却听得很认真。' },
        { id: 'salon', label: '参加沙龙', desc: '在体面人之间打听不体面的事。', check: { attr: 'social', dc: 9 }, effects: { reputation: 2, money: 3 }, fail: { notoriety: 1 }, text: '你在一场沙龙里听到三个名字。其中一个，昨晚刚出现在报纸的失踪版。' },
        { id: 'tallim', label: '找塔利姆', desc: '他欠你钱，也欠你一个人情。', effects: { relations: { tallim: 1 }, insight: 1 }, text: '塔利姆把一叠诗稿推给你，说：“帮我看看，这里面有没有不该出现的东西。”' }
      ],
      docks: [
        { id: 'work', label: '在码头打零工', desc: '搬货、卸货、听水手吹牛。', effects: { money: 4, body: 1, health: -1 }, text: '你扛了一下午的箱子。一个水手说，昨晚雾里有一艘没有灯的船。' },
        { id: 'market', label: '逛地下市场', desc: '买材料，卖消息。', effects: { money: -3, insight: 1, notoriety: 1 }, text: '有人卖一小瓶“雾精华”，开价十镑。你没有买，但记住了卖家的手套。' },
        { id: 'follow', label: '跟踪一个可疑的人', desc: '他刚从一艘没有灯的船上下来。', check: { attr: 'body', dc: 9 }, effects: { insight: 2, notoriety: 1 }, fail: { health: -2 }, text: '你跟着他穿过仓库区。他在一扇铁门前停下，敲了三下。' },
        { id: 'board', label: '查看委托板', desc: '码头区的委托，通常不写在纸上。', effects: {}, openBoard: true, text: '委托板被海风吹得发白。' }
      ],
      church: [
        { id: 'pray', label: '祈祷', desc: '不祈求胜利，只求少死几个人。', effects: { madness: -1, humanity: 1 }, text: '彩窗把雾滤成灰色。你坐了一会儿，什么也没求。' },
        { id: 'archive', label: '查教会档案', desc: '关于大雾霾、因斯和 0-08。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 2 }, fail: { madness: 1 }, text: '档案室的管理员看了你一眼，把一本没有编号的册子推过来。' },
        { id: 'glaint', label: '和格莱林特去告解室', desc: '他坚持自己“看见了一个不该看见的人”。', effects: { relations: { glaint: 1 }, insight: 1 }, text: '格莱林特在告解室里压低声音：“我看见因斯了。他在雾里，没有影子。”' },
        { id: 'board', label: '查看教会委托', desc: '送信、守夜、清理墓园。', effects: {}, openBoard: true, text: '教会委托都很短，像祷告词。' }
      ],
      university: [
        { id: 'research', label: '研究旧手稿', desc: '贝克兰德大学的地下书库有几本不该借出的书。', check: { attr: 'insight', dc: 10 }, effects: { insight: 2, madness: 1 }, fail: { health: -1 }, text: '手稿上有一段被墨水涂掉的文字。你在紫外灯下看见了一个名字：因斯·赞格威尔。' },
        { id: 'forsth', label: '找佛尔思', desc: '她欠出版社一篇稿子，也欠你一个解释。', effects: { relations: { forsth: 1 }, insight: 1 }, text: '佛尔思把一叠稿纸塞给你：“别问结局。结局还没写。”' },
        { id: 'tallim', label: '听塔利姆的诗', desc: '他坚持这首诗写的是“雾里的人”。', effects: { relations: { tallim: 1 }, humanity: 1 }, text: '塔利姆念到第三段时，你听见窗外有人跟着念。' }
      ]
    },
    commissions: [
      { id: 'missing', title: '雾中失踪者', location: 'docks', days: 5, check: { attr: 'insight', dc: 10 }, reward: 14, rep: 1, desc: '一名码头工人连续三天没有回家。他的妻子说她听见他在雾里叫她。' },
      { id: 'manuscript', title: '失窃的手稿', location: 'university', days: 4, check: { attr: 'social', dc: 9 }, reward: 12, rep: 1, desc: '一本没有编号的手稿从地下书库消失。管理员说“它自己走的”。' },
      { id: 'smuggle', title: '没有灯的船', location: 'docks', days: 6, check: { attr: 'body', dc: 10 }, reward: 20, notoriety: 1, desc: '一艘没有灯的船在夜间靠岸。有人要你确认它运了什么。' },
      { id: 'salon', title: '沙龙里的勒索', location: 'west', days: 5, check: { attr: 'social', dc: 10 }, reward: 16, rep: 2, desc: '一位夫人被一封信勒索。信里写着她“不该认识的人”。' },
      { id: 'relic', title: '教堂的遗失圣物', location: 'church', days: 7, check: { attr: 'spirit', dc: 10 }, reward: 18, relations: { church: 1 }, desc: '一件二级圣物在告解室后面失踪。教会不想声张。' },
      { id: 'cough', title: '雾霾中的咳嗽', location: 'lodging', days: 3, check: { attr: 'luck', dc: 8 }, reward: 8, humanity: 1, desc: '东区的孩子咳得越来越厉害。有人说雾里有东西。' },
      { id: 'thesis', title: '塔利姆的论文', location: 'university', days: 4, check: { attr: 'insight', dc: 9 }, reward: 9, relations: { tallim: 1 }, desc: '他需要有人替他证明：那篇关于“雾中仪式”的论文不是胡编的。' },
      { id: 'auction', title: '地下拍卖会', location: 'docks', days: 8, check: { attr: 'social', dc: 11 }, reward: 25, notoriety: 2, desc: '一件“不能描述”的拍品将在码头仓库拍卖。' }
    ],
    ambient: [
      { id: 'b1', location: 'lodging', text: '楼下的房东说，东区昨晚又有人没回来。', choices: [{ label: '下去问细节', effects: { insight: 1, notoriety: 1 } }, { label: '关窗', effects: { health: 1 } }] },
      { id: 'b2', location: 'detective', text: '夏洛克在桌上摆了三张牌：愚者、正义、倒吊人。', choices: [{ label: '问他这是什么意思', effects: { relations: { klein: 1 }, insight: 1 } }, { label: '把自己的牌翻过去', effects: { madness: 1 } }] },
      { id: 'b3', location: 'west', text: '奥黛丽问你：“你觉得非凡者应该救人，还是先救自己？”', choices: [{ label: '先救眼前的人', effects: { humanity: 1, relations: { audrey: 1 } } }, { label: '先活下来', effects: { insight: 1 } }] },
      { id: 'b4', location: 'docks', text: '雾里有人在唱歌。调子像廷根的教堂赞美诗。', choices: [{ label: '循声走过去', effects: { madness: 1, insight: 2 } }, { label: '记住调子，离开', effects: { insight: 1 } }] },
      { id: 'b5', location: 'church', text: '一位老妇人在为雾霾中死去的儿子点蜡烛。', choices: [{ label: '陪她坐一会儿', effects: { humanity: 1 } }, { label: '用灵视看看', effects: { spirit: 1, madness: 1 } }] },
      { id: 'b6', location: 'university', text: '塔利姆说：“我昨晚看见因斯了。他在雾里，没有影子。”', choices: [{ label: '相信他', effects: { relations: { tallim: 1 }, insight: 1 } }, { label: '让他别再提', effects: { notoriety: 1 } }] },
      { id: 'b7', location: 'detective', text: '一个自称“记者”的人想买你关于黑荆棘的故事。', choices: [{ label: '卖一半', effects: { money: 8, notoriety: 1 } }, { label: '拒绝', effects: { humanity: 1 } }] },
      { id: 'b8', location: 'west', text: '格莱林特在沙龙上大声说：“我见过真正的非凡者。”', choices: [{ label: '把他拉走', effects: { relations: { glaint: 1 }, notoriety: 1 } }, { label: '让他说下去', effects: { reputation: 1 } }] }
    ],
    endings: {
      ordinary: [
        { id: 'backlund_reporter', title: '雾霾记者', headline: '《贝克兰德日报》新记者专写雾霾与失踪案', cond: { insight: 10 }, region: 'backlund', text: '你成了《贝克兰德日报》的记者。你写雾霾、失踪和邪教，稿子经常在见报前被删掉一段。你学会了在删掉的那一段里，藏下真正的名字。' },
        { id: 'backlund_detective', title: '莫里亚蒂的合伙人', headline: '《侦探事务所新增合伙人，专接“不方便报警”的委托》', cond: { insight: 8, money: 15 }, region: 'backlund', text: '你成了夏洛克的合伙人。你们接寻人、寻物、查账，偶尔也接一些“不方便报警”的活。你从不问他晚上去哪。' },
        { id: 'backlund_cafe', title: '贝克兰德咖啡馆', headline: '《“愚者特调”走红，店主拒绝解释杯垫为何自己转》', cond: { money: 30 }, region: 'backlund', text: '你在东区开了一家咖啡馆。招牌是“愚者特调”。没人知道为什么杯子会自己转，你只说“是蒸汽管道的问题”。' },
        { id: 'backlund_scholar', title: '大学讲师', headline: '《贝克兰德大学新讲师把神秘学列为选修课》', cond: { insight: 12 }, region: 'backlund', text: '你留在贝克兰德大学教书。学生说你什么都懂一点。你把那本没有编号的手稿锁在办公室抽屉里，从不借人。' },
        { id: 'backlund_philanthropist', title: '东区慈善家', headline: '《东区慈善家捐赠雾霾口罩，拒绝接受采访》', cond: { humanity: 7 }, region: 'backlund', text: '你把钱捐给东区的诊所和学校。报纸叫你“慈善家”，你从不接受采访。你知道雾霾不会因为口罩消失。' },
        { id: 'backlund_socialite', title: '沙龙名人', headline: '《皇后区沙龙常客称“神秘学只是社交谈资”》', cond: { reputation: 8 }, region: 'backlund', text: '你成了皇后区沙龙里最会讲故事的人。你从不讲真事。真事留给自己，在夜里慢慢想。' },
        { id: 'backlund_daily', title: '雾里的普通人', headline: '《一个普通贝克兰德人的日常：雾、红茶、和偶尔的怪梦》', cond: {}, region: 'backlund', text: '你没有拯救贝克兰德，也没有失控。你只是活了下来。每天早上读报，晚上关窗。偶尔在雾里看见一个没有影子的人，你会假装没看见。' }
      ],
      core: [
        { id: 'backlund_witness', title: '愚者的见证者', headline: '《本报记者称“愚者”只是一个传说》', cond: { flags: ['saw_klein'], humanity: 6 }, region: 'backlund', text: '你在贝克兰德见过夏洛克三次，但从未揭穿他。你活到了最后，成了少数知道“愚者”真的存在的人。' },
        { id: 'backlund_secret', title: '雾中的组织', headline: '《警方称某“读书会”与多起失踪案有关》', cond: { notoriety: 6, insight: 10 }, region: 'backlund', text: '你接管了一个在雾里活动的组织。成员叫你“先生”。你从不让他们看见你的脸。' }
      ]
    },
    canon: backlundCanon
  };
})();
