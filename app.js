/* ============================================================
   《诡秘之主：廷根异闻》— OC AU sandbox
   Local-first. No external services. No source-text upload.
   ============================================================ */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const icon = (n, c = '') => `<svg class="icon ${c}" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
const DATA = window.OC_DATA;
const TINGEN_CANON = (window.CANON_EVENTS || []).filter(e => e.volumeId === 1);
const SAVE_KEY = 'tingen_oc_saves_v1';
const SETTINGS_KEY = 'tingen_oc_settings_v1';
const UNLOCK_KEY = 'tingen_oc_unlocked_endings_v1';

const ATTR_LABEL = { spirit: '灵性', body: '体魄', insight: '洞察', social: '社交', luck: '运气' };
const ATTR_ICON = { spirit: 'moon', body: 'shield', insight: 'eye', social: 'person', luck: 'spark' };
const LOCATION_NPC = {
  home: ['melissa'],
  blackthorn: ['dunn', 'klein', 'leonard', 'rosa'],
  club: ['christina'],
  asylum: ['frye'],
  docks: [],
  church: ['frye']
};

function regionData() {
  if (state && state.region === 'forsaken' && window.OC_FORSAKEN) return window.OC_FORSAKEN;
  if (state && state.region === 'war' && window.OC_WAR) return window.OC_WAR;
  if (state && state.region === 'south' && window.OC_SOUTH) return window.OC_SOUTH;
  if (state && state.region === 'sea' && window.OC_SEA) return window.OC_SEA;
  if (state && state.region === 'backlund' && window.OC_BACKLUND) return window.OC_BACKLUND;
  return DATA;
}
function regionLocations() { return regionData().locations || DATA.locations; }
function regionNPCs() { return regionData().npcs || DATA.npcs; }
function regionNpcLocations() { return regionData().npcLocations || LOCATION_NPC; }
function regionActions() { return regionData().actions || DATA.actions; }
function regionCommissions() { return regionData().commissions || DATA.commissions; }
function regionAmbient() { return regionData().ambient || DATA.ambient; }
function regionCanon() { return regionData().canon || TINGEN_CANON; }
function regionPaper() { return regionData().paper || '廷根老实人报'; }
function paperMast() {
  if (state?.region === 'forsaken') return 'THE SILVER CITY TABLET';
  if (state?.region === 'war') return 'THE WARTIME GAZETTE';
  if (state?.region === 'south') return 'THE SOUTHERN COLONIAL';
  if (state?.region === 'sea') return 'THE SEA HERALD';
  if (state?.region === 'backlund') return 'THE BACKLUND DAILY';
  return 'THE TINGEN HONEST MAN';
}
function regionMaxDay() { return regionData().maxDay || state?.maxDay || 30; }
function regionLabel() { return regionData().name || '廷根'; }
function regionDateLabel() { return regionData().dateLabel || (state?.region === 'backlund' ? '1349 年 9 月' : '1349 年 7 月'); }
function regionEndings() {
  const base = DATA.endings;
  const out = { ordinary: base.ordinary.slice(), core: base.core.slice(), bad: base.bad.slice() };
  for (const key of ['backlund', 'sea', 'south', 'war', 'forsaken']) {
    const d = window[key === 'backlund' ? 'OC_BACKLUND' : key === 'sea' ? 'OC_SEA' : key === 'south' ? 'OC_SOUTH' : key === 'war' ? 'OC_WAR' : 'OC_FORSAKEN'];
    if (d && d.endings) {
      out.ordinary.push(...(d.endings.ordinary || []));
      out.core.push(...(d.endings.core || []));
    }
  }
  return out;
}

let state = null;
let draft = null;
let saves = [];
let unlockedEndings = [];
const ARCHIVE_TAB = { endings: '结局档案', canon: 'canon 总表', people: '人物档案' };
let settings = { textScale: 1, motion: false };
let modalAfter = null;
let activeAmbient = null;
let sessionStart = Date.now();

function freshState() {
  return {
    version: 1,
    screen: 'title',
    region: 'tingen',
    act: 1,
    maxDay: 30,
    day: 1,
    ap: 2,
    player: null,
    relations: {},
    flags: {},
    canonSeen: [],
    canonIntervened: [],
    pendingCanon: [],
    activeCommission: null,
    completedCommissions: [],
    newspaper: [],
    log: [],
    ending: null,
    playtime: 0,
    settings: { textScale: 1, motion: false },
    createdAt: Date.now()
  };
}
function freshDraft() {
  return {
    name: '以利亚·格雷',
    origin: 'tingen',
    pathway: 'seer',
    flaw: 'insomnia',
    contact: 'dunn',
    look: 'plain',
    attrs: { spirit: 1, body: 1, insight: 1, social: 1, luck: 1 },
    points: 8
  };
}

/* ---------- persistence ---------- */
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if (s) settings = Object.assign(settings, s);
  } catch (e) {}
  applySettings();
}
function applySettings() {
  document.documentElement.style.setProperty('--text-scale', String(settings.textScale || 1));
  document.body.dataset.motion = settings.motion ? 'reduced' : '';
}
function persistSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
}
function loadSaves() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter(s => s && s.id && s.snapshot);
  } catch (e) { return []; }
}
function persistSaves() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(saves)); } catch (e) { toast('本地存储空间不足，存档未写入。', 'danger'); }
}
function loadUnlocked() {
  try {
    const a = JSON.parse(localStorage.getItem(UNLOCK_KEY) || '[]');
    return Array.isArray(a) ? a.filter(x => typeof x === 'string') : [];
  } catch (e) { return []; }
}
function unlockEnding(id) {
  if (!id || unlockedEndings.includes(id)) return;
  unlockedEndings.push(id);
  try { localStorage.setItem(UNLOCK_KEY, JSON.stringify(unlockedEndings)); } catch (e) {}
}
function allEndings() {
  const b = (window.OC_BACKLUND && window.OC_BACKLUND.endings) || { ordinary: [], core: [] };
  const s = (window.OC_SEA && window.OC_SEA.endings) || { ordinary: [], core: [] };
  const t = (window.OC_SOUTH && window.OC_SOUTH.endings) || { ordinary: [], core: [] };
  const w = (window.OC_WAR && window.OC_WAR.endings) || { ordinary: [], core: [] };
  const f = (window.OC_FORSAKEN && window.OC_FORSAKEN.endings) || { ordinary: [], core: [] };
  const seen = new Set();
  return [].concat(DATA.endings.ordinary, b.ordinary || [], s.ordinary || [], t.ordinary || [], w.ordinary || [], f.ordinary || [], DATA.endings.core, b.core || [], s.core || [], t.core || [], w.core || [], f.core || [], DATA.endings.bad)
    .filter(e => { if (!e || seen.has(e.id)) return false; seen.add(e.id); return true; });
}
function updatePlaytime() {
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  if (!state) return;
  state.playtime = (state.playtime || 0) + (elapsed - (state._lastTick || 0));
  state._lastTick = elapsed;
}
function snapshot() {
  return {
    version: 1,
    region: state.region,
    act: state.act,
    maxDay: state.maxDay,
    day: state.day,
    ap: state.ap,
    player: JSON.parse(JSON.stringify(state.player)),
    relations: JSON.parse(JSON.stringify(state.relations)),
    flags: JSON.parse(JSON.stringify(state.flags)),
    canonSeen: state.canonSeen.slice(),
    canonIntervened: state.canonIntervened.slice(),
    pendingCanon: state.pendingCanon.slice(),
    activeCommission: JSON.parse(JSON.stringify(state.activeCommission)),
    completedCommissions: state.completedCommissions.slice(),
    newspaper: JSON.parse(JSON.stringify(state.newspaper)),
    log: state.log.slice(0, 40),
    ending: state.ending,
    playtime: state.playtime || 0,
    createdAt: state.createdAt
  };
}
function saveGame(type, slot, name) {
  if (!state || !state.player) { toast('先进入廷根，才能存档。', 'danger'); return; }
  updatePlaytime();
  const id = type === 'auto' ? 'auto' : 'manual-' + slot;
  const old = saves.find(s => s.id === id);
  const p = state.player;
  const rec = {
    id, type,
    name: type === 'auto' ? `${p.name} · 第 ${state.day} 天` : ((name || '').trim() || (old && old.name) || `${p.name} · 第 ${state.day} 天`),
    day: state.day,
    maxDay: state.maxDay,
    region: state.region,
    location: regionLabel(),
    playerName: p.name,
    pathway: p.pathwayName,
    sequence: p.sequence,
    health: p.health,
    madness: p.madness,
    money: p.money,
    updatedAt: Date.now(),
    summary: (state.log[0] || '第 ' + state.day + ' 天，' + regionLabel() + '。').slice(0, 120),
    snapshot: snapshot()
  };
  const idx = saves.findIndex(s => s.id === id);
  if (idx >= 0) saves[idx] = rec; else saves.push(rec);
  persistSaves();
  return rec;
}
function autoSave() { saveGame('auto', 0, null); }
function latestSave() { return saves.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0] || null; }
function saveById(id) { return saves.find(s => s.id === id); }

/* ---------- helpers ---------- */
function toast(text, kind = '') {
  const root = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = `${icon(kind === 'danger' ? 'drop' : kind === 'good' ? 'spark' : 'feather')}<span>${esc(text)}</span>`;
  root.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 240); }, 3200);
}
function openModal(html, after = null) {
  modalAfter = (typeof after === 'function') ? after : null;
  $('#modal-root').innerHTML = `<div class="modal-backdrop" data-act="modal-backdrop">${html}</div>`;
  const f = $('[data-autofocus]', $('#modal-root')) || $('.modal-close', $('#modal-root'));
  if (f) setTimeout(() => { try { f.focus(); } catch (e) {} }, 30);
}
function closeModal() {
  $('#modal-root').innerHTML = '';
  const after = modalAfter;
  modalAfter = null;
  if (typeof after === 'function') after();
}
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function seeded(str) {
  let a = hashStr(str) || 1;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function roll(attr, dc, salt) {
  const rng = seeded(`${state.player.name}:${state.day}:${salt}:${state.ap}`);
  const d6 = 1 + Math.floor(rng() * 6);
  let bonus = 0;
  if (state.player.pathwayId === 'seer' && attr === 'insight') bonus = 1;
  if (state.player.pathwayId === 'corpse' && (salt.includes('asylum') || salt.includes('church') || salt.includes('grave'))) bonus = 2;
  const total = d6 + (state.player.attrs[attr] || 0) + bonus;
  return { d6, bonus, total, dc, success: total >= dc, attr };
}
function attrName(k) { return ATTR_LABEL[k] || k; }
function effectTags(e = {}) {
  const map = { money: '金钱', health: '生命', humanity: '人性', madness: '疯狂', reputation: '声望', notoriety: '恶名', insight: '洞察', body: '体魄', spirit: '灵性', social: '社交', luck: '运气' };
  const out = [];
  for (const k of Object.keys(e)) {
    if (k === 'relations' || k === 'flags') continue;
    if (e[k]) out.push(`${map[k] || k} ${e[k] > 0 ? '+' : ''}${e[k]}`);
  }
  if (e.relations) for (const [k, v] of Object.entries(e.relations)) out.push(`${k} 关系 ${v > 0 ? '+' : ''}${v}`);
  return out.map(x => `<span>${esc(x)}</span>`).join('');
}
function applyEffects(e = {}) {
  if (!state.player) return;
  const p = state.player;
  if (e.money) p.money += e.money;
  if (e.health) p.health = clamp(p.health + e.health, 0, 10);
  if (e.humanity) p.humanity = clamp(p.humanity + e.humanity, 0, 10);
  if (e.madness) p.madness = clamp(p.madness + e.madness, 0, 10);
  if (e.reputation) p.reputation = clamp(p.reputation + e.reputation, 0, 20);
  if (e.notoriety) p.notoriety = clamp(p.notoriety + e.notoriety, 0, 20);
  for (const k of ['spirit', 'body', 'insight', 'social', 'luck']) if (e[k]) p.attrs[k] = clamp(p.attrs[k] + e[k], 0, 10);
  if (e.relations) for (const [k, v] of Object.entries(e.relations)) state.relations[k] = (state.relations[k] || 0) + v;
  if (e.flags) for (const [k, v] of Object.entries(e.flags)) if (v) state.flags[k] = true;
}
function checkFailure() {
  if (!state.player) return false;
  if (state.player.health <= 0) { showEnding('dead'); return true; }
  if (state.player.madness >= 10) { showEnding('mad'); return true; }
  return false;
}
function log(text) {
  if (!state) return;
  state.log.unshift(text);
  state.log = state.log.slice(0, 40);
}

/* ---------- title ---------- */
function renderTitle() {
  state.screen = 'title';
  const latest = latestSave();
  $('#app').innerHTML = `
  <main class="oc-title">
    <div class="oc-moon"></div>
    <div class="oc-fog"></div>
    <div class="oc-skyline"></div>
    <div class="oc-title-inner">
      <div class="oc-copy">
        <p class="eyebrow">A LORD OF THE MYSTERIES OC SANDBOX</p>
        <h1>诡秘之主<span>廷根异闻</span></h1>
        <p class="oc-lede">你是一个在廷根醒来的无名非凡者。<br>报纸会告诉你主角团在哪，但不会告诉你，介入之后会发生什么。</p>
        <div class="oc-actions">
          ${latest ? `<button class="btn primary" data-act="continue">${icon('play')}继续：第 ${latest.day} 天 · ${esc(latest.playerName)}</button>` : `<button class="btn primary" data-act="new">${icon('feather')}捏一个非凡者</button>`}
          <button class="btn" data-act="new">${icon('spark')}新档案</button>
          <button class="btn ghost" data-act="saves">${icon('save')}存档柜</button>
          <button class="btn ghost" data-act="archive">${icon('stack')}档案库</button>
          <button class="btn ghost" data-act="about">${icon('book')}廷根指南</button>
        </div>
        <div class="oc-meta"><span>六段 76 天 · 从廷根到神弃之地</span><span>序列 9 起步</span><span>44 个 canon 锚点</span><span>15+ / 恐怖与死亡</span></div>
      </div>
      <div class="oc-paper-prop paper">
        <div class="prop-head"><span>THE TINGEN HONEST MAN</span><span>1 PENNY</span></div>
        <h3>廷根老实人报</h3>
        <div class="prop-rule"></div>
        <p class="prop-headline">黑荆棘安保公司昨夜灯火通明，居民称“只是加班”</p>
        <p class="prop-body">本报讯：佐特兰街 36 号 2 楼昨夜至凌晨仍有灯光。附近居民表示，最近常有穿黑色风衣的人出入。该公司拒绝评论。</p>
        <div class="prop-small">分类广告：占卜、寻物、保镖、葬礼花圈。价格面议。</div>
      </div>
    </div>
    <div class="oc-footer"><span>原作：爱潜水的乌贼《诡秘之主》</span><span>非官方 · 非商业 · 本地存档</span></div>
  </main>`;
}

/* ---------- creator ---------- */
function renderCreator() {
  state.screen = 'creator';
  if (!draft) draft = freshDraft();
  const origin = DATA.origins.find(o => o.id === draft.origin);
  const pathway = DATA.pathways.find(p => p.id === draft.pathway);
  const flaw = DATA.flaws.find(f => f.id === draft.flaw);
  const contact = DATA.contacts.find(c => c.id === draft.contact);
  const look = DATA.looks.find(l => l.id === draft.look);
  const attrs = Object.keys(draft.attrs).map(k => attrRow(k)).join('');
  $('#app').innerHTML = `
  <main class="creator-shell">
    <header class="oc-hud">
      <button class="oc-brand" data-act="title">${icon('moon')}<span>廷根异闻<small>CHARACTER FILE</small></span></button>
      <div class="oc-hud-meta"><span>新档案</span><span>序列 9</span><span>可分配 ${draft.points} 点</span></div>
      <div class="oc-hud-actions"><button class="icon-btn" data-act="title" title="回到标题">${icon('arrow')}</button></div>
    </header>
    <div class="creator-grid">
      <section class="creator-main">
        <div class="creator-head"><p class="kicker">PERSONNEL FILE · TINGEN</p><h1>先决定你是谁</h1><p class="shelf-lede">你不是克莱恩。你只是廷根另一个在红月下醒来的人。</p></div>
        <div class="creator-block paper">
          <label class="field-label">姓名</label>
          <input id="pc-name" class="text-input" maxlength="20" value="${esc(draft.name)}" autocomplete="off">
          <div class="creator-row">
            <div><label class="field-label">出身</label><div class="mini-grid">${DATA.origins.map(o => `<button class="mini-card ${draft.origin === o.id ? 'on' : ''}" data-act="pick-origin" data-id="${o.id}"><b>${esc(o.name)}</b><small>${esc(o.desc)}</small></button>`).join('')}</div></div>
          </div>
          <div class="creator-row">
            <div><label class="field-label">起始途径（序列 9）</label><div class="mini-grid pathways">${DATA.pathways.map(p => `<button class="mini-card ${draft.pathway === p.id ? 'on' : ''}" data-act="pick-pathway" data-id="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.desc)}</small></button>`).join('')}</div></div>
          </div>
        </div>
        <div class="creator-block paper">
          <div class="creator-block-head"><span class="field-label">属性</span><span class="small">剩余 ${draft.points} 点 · 每项最高 5</span></div>
          <div class="attr-list">${attrs}</div>
          <p class="small muted">判定 = 属性 + d6 + 途径加成。不是点数越高越好，缺陷会跟着你。</p>
        </div>
        <div class="creator-block paper">
          <label class="field-label">缺陷</label>
          <div class="mini-grid">${DATA.flaws.map(f => `<button class="mini-card ${draft.flaw === f.id ? 'on' : ''}" data-act="pick-flaw" data-id="${f.id}"><b>${esc(f.name)}</b><small>${esc(f.desc)}</small></button>`).join('')}</div>
          <label class="field-label" style="margin-top:16px">初始人脉</label>
          <div class="mini-grid">${DATA.contacts.map(c => `<button class="mini-card ${draft.contact === c.id ? 'on' : ''}" data-act="pick-contact" data-id="${c.id}"><b>${esc(c.name)}</b><small>${esc(c.desc)}</small></button>`).join('')}</div>
          <label class="field-label" style="margin-top:16px">外观</label>
          <div class="chip-row">${DATA.looks.map(l => `<button class="term-chip ${draft.look === l.id ? 'on' : ''}" data-act="pick-look" data-id="${l.id}">${esc(l.name)}</button>`).join('')}</div>
        </div>
      </section>
      <aside class="creator-preview">
        <div class="profile-card ink-panel">
          <div class="profile-sigil ${pathway ? 'sig-' + pathway.id : ''}">${icon('mask')}</div>
          <p class="kicker">FILE PREVIEW</p>
          <h2>${esc(draft.name || '无名者')}</h2>
          <p class="profile-sub">${esc(origin ? origin.name : '')} · ${esc(pathway ? pathway.name : '')} · 序列 9</p>
          <div class="rule"></div>
          <div class="preview-line"><span>出身</span><b>${esc(origin ? origin.name : '')}</b></div>
          <div class="preview-line"><span>途径</span><b>${esc(pathway ? pathway.name : '')}</b></div>
          <div class="preview-line"><span>缺陷</span><b>${esc(flaw ? flaw.name : '')}</b></div>
          <div class="preview-line"><span>人脉</span><b>${esc(contact ? contact.name : '')}</b></div>
          <div class="preview-line"><span>外观</span><b>${esc(look ? look.name : '')}</b></div>
          <div class="preview-stats">${Object.keys(draft.attrs).map(k => `<div><b>${draft.attrs[k] + (originMods(origin, k) + pathwayMods(pathway, k))}</b><span>${attrName(k)}</span></div>`).join('')}</div>
          <div class="preview-note">${esc(pathway ? pathway.flavor : '')}</div>
        </div>
        <button class="btn primary wide" data-act="create-start" ${draft.points === 0 ? '' : 'disabled'}>${icon('play')}进入廷根 · 第 1 天</button>
        <p class="small muted" style="text-align:center;margin-top:8px">开始后自动生成第 1 天报纸并存档。</p>
      </aside>
    </div>
  </main>`;
  const nameInput = $('#pc-name');
  if (nameInput) nameInput.addEventListener('input', () => { draft.name = nameInput.value.slice(0, 20); });
}
function originMods(origin, k) { return (origin && origin.mods && origin.mods[k]) || 0; }
function pathwayMods(pathway, k) { return (pathway && pathway.mods && pathway.mods[k]) || 0; }
function attrRow(k) {
  return `<div class="attr-row"><span class="attr-name">${icon(ATTR_ICON[k])}${attrName(k)}</span>
    <div class="attr-pips">${[1,2,3,4,5].map(i => `<i class="${i <= draft.attrs[k] ? 'on' : ''}"></i>`).join('')}</div>
    <div class="attr-btns"><button data-act="attr-minus" data-k="${k}" ${draft.attrs[k] <= 1 ? 'disabled' : ''}>−</button><button data-act="attr-plus" data-k="${k}" ${draft.points <= 0 || draft.attrs[k] >= 5 ? 'disabled' : ''}>+</button></div></div>`;
}
function adjustAttr(k, delta) {
  if (!draft) return;
  if (delta > 0) {
    if (draft.points <= 0 || draft.attrs[k] >= 5) return;
    draft.attrs[k]++; draft.points--;
  } else {
    if (draft.attrs[k] <= 1) return;
    draft.attrs[k]--; draft.points++;
  }
  renderCreator();
}
function buildPlayer() {
  if (!draft || draft.points !== 0) { toast('先把 8 点属性分配完。', 'danger'); return; }
  const name = (draft.name || '').trim() || '无名者';
  const origin = DATA.origins.find(o => o.id === draft.origin);
  const pathway = DATA.pathways.find(p => p.id === draft.pathway);
  const flaw = DATA.flaws.find(f => f.id === draft.flaw);
  const contact = DATA.contacts.find(c => c.id === draft.contact);
  const look = DATA.looks.find(l => l.id === draft.look);
  const attrs = {};
  for (const k of Object.keys(draft.attrs)) attrs[k] = clamp(draft.attrs[k] + originMods(origin, k) + pathwayMods(pathway, k) + ((flaw.mods && flaw.mods[k]) || 0), 0, 10);
  const p = {
    name, originId: origin.id, originName: origin.name,
    pathwayId: pathway.id, pathwayName: pathway.name, ability: pathway.ability,
    sequence: 9, attrs,
    flawId: flaw.id, flawName: flaw.name,
    contactId: contact.id, contactName: contact.name,
    lookId: look.id, lookName: look.name,
    money: 20 + ((origin.mods && origin.mods.money) || 0) + ((flaw.mods && flaw.mods.money) || 0) + ((contact.mods && contact.mods.money) || 0),
    health: 10, humanity: clamp(8 + ((origin.mods && origin.mods.humanity) || 0) + ((flaw.mods && flaw.mods.humanity) || 0) + ((contact.mods && contact.mods.humanity) || 0), 0, 10),
    madness: clamp(((pathway.mods && pathway.mods.madness) || 0) + ((flaw.mods && flaw.mods.madness) || 0), 0, 10),
    reputation: 0, notoriety: (flaw.mods && flaw.mods.notoriety) || 0, acting: 0
  };
  const relations = {};
  const allNpcs = DATA.npcs.concat((window.OC_BACKLUND && window.OC_BACKLUND.npcs) || [], (window.OC_SEA && window.OC_SEA.npcs) || [], (window.OC_SOUTH && window.OC_SOUTH.npcs) || [], (window.OC_WAR && window.OC_WAR.npcs) || [], (window.OC_FORSAKEN && window.OC_FORSAKEN.npcs) || []);
  for (const n of allNpcs) relations[n.id] = 0;
  if (contact.mods && contact.mods.relations) for (const [k, v] of Object.entries(contact.mods.relations)) relations[k] = (relations[k] || 0) + v;
  state = freshState();
  state.player = p;
  state.relations = relations;
  state.screen = 'hub';
  state.day = 1;
  startDay(true);
}
function startDay(first = false) {
  if (!state.player) return;
  state.screen = 'hub';
  state.ap = 2;
  state.ending = null;
  const due = regionCanon().filter(e => e.dayStart === state.day);
  state.pendingCanon = due.map(e => e.id);
  state.newspaper = makeNewspaper(due);
  log(`第 ${state.day} 天开始。`);
  autoSave();
  render();
}
function makeNewspaper(due) {
  const p = state.player;
  const news = [];
  if (due && due.length) {
    news.push({ tag: 'CANON', text: due[0].newspaper, eventId: due[0].id });
  } else {
    news.push({ tag: '本报', text: state.region === 'forsaken'
      ? '白银城昨夜灯火通明；长老会称“只是例行守夜”。'
      : state.region === 'war'
      ? '前线昨夜“大捷”；伤亡数字不便公布。'
      : state.region === 'south'
      ? '拜朗港昨夜有送葬队伍经过；殖民当局称“地方习俗”。'
      : state.region === 'sea'
      ? '罗思德群岛港口昨夜有船无灯入港；港务局称“只是晚归的渔船”。'
      : state.region === 'backlund'
      ? '贝克兰德桥区昨夜发生瓦斯泄漏；东区居民称雾里有人唱歌。'
      : '黑荆棘安保公司称昨夜“只是加班”；佐特兰街居民表示已经习惯了。' });
  }
  if (p.notoriety >= 3) {
    news.push({ tag: '警方', text: `警方正在寻找一名${p.notoriety >= 6 ? '“极度危险”的' : ''}嫌疑人，特征：${p.lookName}，${p.pathwayName}。` });
  } else if (state.log.find(x => !/^夜晚|^第 .*天开始|^canon/.test(x))) {
    const last = state.log.find(x => !/^夜晚|^第 .*天开始|^canon/.test(x));
    news.push({ tag: '市井', text: `据本报线人消息：${last.slice(0, 70)}` });
  } else {
    news.push({ tag: '市井', text: '码头区又有人失踪；工头说他们只是拿了工钱跑了。' });
  }
  if (state.activeCommission) {
    news.push({ tag: '分类广告', text: `悬赏：${state.activeCommission.title}。知情者请与本报联系。` });
  } else if (p.reputation >= 4) {
    news.push({ tag: '社交', text: `本城一位“热心的${p.pathwayName}”最近很活跃；有人称赞，有人警惕。` });
  } else {
    news.push({ tag: '传闻', text: state.region === 'forsaken'
      ? '荒野远征队称看见“第二个太阳”；长老会称“视觉误差”。'
      : state.region === 'war'
      ? '前线士兵称听见祭坛方向传来歌声；军团称“风声”。'
      : state.region === 'south'
      ? '古墓群守墓人集体请假；殖民当局称“劳动力短缺”。'
      : state.region === 'sea'
      ? '水手称风暴眼里有灯；航运公司称“不建议靠近”。'
      : state.region === 'backlund'
      ? '皇后区沙龙称，雾霾只是“天气问题”；东区诊所没有置评。'
      : '占卜俱乐部称，红月最近“只是天气现象”；教会未予置评。' });
  }
  return news.slice(0, 3);
}

/* ---------- hub ---------- */
function hud() {
  const p = state.player;
  if (!p) return '';
  return `<header class="oc-hud">
    <button class="oc-brand" data-act="title">${icon('moon')}<span>${regionLabel()}异闻<small>DAY ${String(state.day).padStart(2, '0')} / ${state.maxDay || 30}</small></span></button>
    <div class="hud-day"><b>${String(state.day).padStart(2, '0')}</b><span>日 / ${state.maxDay || 30}</span></div>
    <div class="hud-res">
      <span class="res"><i>${icon('spark')}</i>行动 ${state.ap}/2</span>
      <span class="res money" title="金钱">${icon('star')}${p.money} 镑</span>
      <span class="res health" title="生命">${icon('heart')}${p.health}/10</span>
      <span class="res madness" title="疯狂">${icon('drop')}${p.madness}/10</span>
    </div>
    <div class="hud-actions">
      <button class="icon-btn" data-act="newspaper" title="今日报纸">${icon('book')}</button>
      <button class="icon-btn" data-act="save" title="存档">${icon('save')}</button>
      <button class="icon-btn" data-act="saves" title="存档柜">${icon('folder')}</button>
      <button class="icon-btn" data-act="settings" title="设置">${icon('settings')}</button>
    </div>
  </header>`;
}
function renderHub() {
  state.screen = 'hub';
  const p = state.player;
  if (!p) { state.screen = 'title'; return renderTitle(); }
  const canonToday = state.pendingCanon.map(id => regionCanon().find(e => e.id === id)).filter(Boolean);
  const npcRows = regionNPCs().map(n => {
    const r = state.relations[n.id] || 0;
    return `<div class="relation-row"><span class="rel-dot" style="--c:${n.color}"></span><span>${esc(n.name)}</span><b>${relLabel(r)}</b></div>`;
  }).join('');
  const locCards = regionLocations().map(loc => {
    const npcs = (regionNpcLocations()[loc.id] || []).map(id => regionNPCs().find(n => n.id === id)).filter(Boolean);
    const canonHere = canonToday.filter(e => canonLocationId(e) === loc.id);
    const activeHere = state.activeCommission && state.activeCommission.location === loc.id;
    return `<button class="loc-card" data-act="open-location" data-id="${loc.id}" style="--loc:${loc.color}">
      <div class="loc-top"><span class="loc-icon">${icon(loc.icon)}</span><span><b>${esc(loc.name)}</b><small>${esc(loc.sub)}</small></span></div>
      <div class="loc-npcs">${npcs.map(n => `<span class="npc-chip" style="--c:${n.color}">${esc(n.name.split('·')[0])}</span>`).join('') || '<span class="muted small">这里没有你认识的人</span>'}</div>
      <div class="loc-foot">
        ${canonHere.length ? `<span class="canon-badge">${icon('eye')}canon 事件</span>` : ''}
        ${activeHere ? `<span class="commission-badge">${icon('star')}委托</span>` : ''}
        <span class="loc-go">进入 ${icon('arrow')}</span>
      </div>
    </button>`;
  }).join('');
  const newspaper = state.newspaper.map(n => `<div class="news-line"><span class="news-tag">${esc(n.tag)}</span><p>${esc(n.text)}</p></div>`).join('');
  const logRows = state.log.slice(0, 4).map(t => `<p class="log-line">${esc(t)}</p>`).join('');
  $('#app').innerHTML = `
  ${hud()}
  <main class="hub-layout">
    <aside class="hub-left">
      <section class="newspaper-card paper">
        <div class="paper-mast"><span>${paperMast()}</span><span>1 PENNY</span></div>
        <h2>${esc(regionPaper())}</h2>
        <div class="paper-date">${regionDateLabel()} · 第 ${state.day} 天</div>
        ${newspaper}
        <button class="btn ghost small wide" data-act="newspaper">${icon('book')}展开今日报纸</button>
      </section>
      ${canonToday.length ? `<section class="canon-card ink-panel">
        <div class="canon-kicker">${icon('eye')}CANON 锚点 · 今日</div>
        ${canonToday.map(e => `<button class="canon-today" data-act="open-canon" data-id="${e.id}"><b>${esc(e.title)}</b><small>${esc(e.dateLabel)} · ${esc(e.location)}</small><span>${esc(e.newspaper)}</span></button>`).join('')}
      </section>` : ''}
      ${state.activeCommission ? `<section class="active-commission ink-panel">
        <div class="kicker">ACTIVE COMMISSION</div>
        <h3>${esc(state.activeCommission.title)}</h3>
        <p>${esc(state.activeCommission.desc)}</p>
        <div class="commission-meta"><span>地点：${locationName(state.activeCommission.location)}</span><span>截止：第 ${state.activeCommission.acceptedDay + state.activeCommission.days} 天</span></div>
        <button class="btn small" data-act="open-commission">${icon('star')}查看委托</button>
      </section>` : `<section class="active-commission ink-panel empty">
        <div class="kicker">COMMISSION</div><p>没有进行中的委托。去黑荆棘、码头或教堂看看委托板。</p>
        <button class="btn small" data-act="open-commission">${icon('search')}查看委托板</button>
      </section>`}
    </aside>
    <section class="hub-center">
      <div class="hub-head"><div><p class="kicker">${regionLabel().toUpperCase()} · DAY ${state.day}</p><h1>今天去哪里？</h1></div><div class="ap-display"><b>${state.ap}</b><span>行动点</span></div></div>
      <div class="map-grid">${locCards}</div>
      <div class="hub-hint">${state.ap > 0 ? '选择一个地点行动。用完 2 个行动点后进入夜晚。' : '行动点用完了。回水仙花街休息，或直接结束今天。'}</div>
      <div class="hub-bottom">
        <button class="btn ghost small" data-act="open-commission">${icon('star')}委托板</button>
        <button class="btn ghost small" data-act="relations">${icon('heart')}关系档案</button>
        <button class="btn ghost small" data-act="canon-list">${icon('eye')}canon 追踪</button>
        <button class="btn ghost small" data-act="archive">${icon('stack')}档案库</button>
        <span class="spacer"></span>
        <button class="btn ${state.ap <= 0 ? 'primary' : 'ghost'} small" data-act="end-day">${icon('moon')}结束今天</button>
      </div>
    </section>
    <aside class="hub-right">
      <section class="profile-mini ink-panel">
        <div class="mini-sigil ${'sig-' + p.pathwayId}">${icon('mask')}</div>
        <div><p class="kicker">${esc(p.pathwayName)} · 序列 ${p.sequence}</p><h2>${esc(p.name)}</h2><p class="small">${esc(p.originName)} · ${esc(p.flawName)}</p></div>
      </section>
      <section class="relations-panel ink-panel">
        <div class="panel-head"><span>关系</span><span>${icon('heart')}</span></div>
        ${npcRows}
        <button class="btn ghost small wide" data-act="relations">查看全部</button>
      </section>
      <section class="log-panel ink-panel">
        <div class="panel-head"><span>最近</span><span>${icon('feather')}</span></div>
        ${logRows || '<p class="small muted">还没有记录。</p>'}
      </section>
    </aside>
  </main>`;
}
function relLabel(r) {
  if (r >= 5) return '可信';
  if (r >= 3) return '熟识';
  if (r >= 1) return '点头';
  if (r <= -3) return '敌意';
  if (r <= -1) return '警惕';
  return '陌生';
}
function locationName(id) { const l = regionLocations().find(x => x.id === id); return l ? l.name : id; }
function canonLocationId(e) {
  const s = (e.location || '') + (e.title || '');
  if (state.region === 'forsaken') {
    if (s.includes('月城')) return 'moon';
    if (s.includes('王庭')) return 'court';
    if (s.includes('荒野')) return 'wild';
    if (s.includes('祭坛') || s.includes('太阳')) return 'altar';
    return 'white';
  }
  if (state.region === 'war') {
    if (s.includes('医院')) return 'hospital';
    if (s.includes('营地') || s.includes('军团')) return 'camp';
    if (s.includes('王庭') || s.includes('后勤')) return 'court';
    if (s.includes('祭坛') || s.includes('神降')) return 'altar';
    return 'front';
  }
  if (state.region === 'south') {
    if (s.includes('庄园')) return 'estate';
    if (s.includes('祭坛') || s.includes('玫瑰')) return 'altar';
    if (s.includes('古墓') || s.includes('墓')) return 'grave';
    if (s.includes('雨林')) return 'jungle';
    return 'port';
  }
  if (state.region === 'sea') {
    if (s.includes('黑市') || s.includes('市场')) return 'market';
    if (s.includes('无人岛') || s.includes('岛')) return 'island';
    if (s.includes('风暴') || s.includes('海眼')) return 'storm';
    if (s.includes('船') || s.includes('复仇者')) return 'ship';
    return 'port';
  }
  if (state.region === 'backlund') {
    if (s.includes('东区') || s.includes('码头') || s.includes('塔索克')) return 'docks';
    if (s.includes('皇后区') || s.includes('西区') || s.includes('沙龙')) return 'west';
    if (s.includes('大学') || s.includes('书库') || s.includes('图书馆')) return 'university';
    if (s.includes('教堂') || s.includes('墓园')) return 'church';
    return 'detective';
  }
  if (s.includes('黑荆棘') || s.includes('佐特兰')) return 'blackthorn';
  if (s.includes('占卜') || s.includes('豪尔斯')) return 'club';
  if (s.includes('疯人院')) return 'asylum';
  if (s.includes('码头') || s.includes('工厂')) return 'docks';
  if (s.includes('教堂') || s.includes('墓园') || s.includes('红烟囱')) return 'church';
  if (s.includes('水仙花') || s.includes('家')) return 'home';
  return 'blackthorn';
}

/* ---------- newspaper / canon list ---------- */
function openNewspaper() {
  const rows = state.newspaper.map(n => `<div class="news-line"><span class="news-tag">${esc(n.tag)}</span><p>${esc(n.text)}</p></div>`).join('');
  openModal(`<div class="modal narrow newspaper-modal">
    <div class="modal-head"><span class="head-icon">${icon('book')}</span><div><h2>${esc(regionPaper())}</h2><p class="modal-sub">${regionDateLabel()} · 第 ${state.day} 天 · 1 便士</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><div class="paper-mast"><span>${paperMast()}</span><span>1 PENNY</span></div>${rows}<div class="prop-small">分类广告：占卜、寻物、保镖、葬礼花圈。价格面议。</div></div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">报纸只写它“知道”的，不写它“猜到”的。</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">收起报纸</button></div>
  </div>`);
}
function openCanonList() {
  const rows = regionCanon().map(e => {
    const seen = state.canonSeen.includes(e.id);
    const inter = state.canonIntervened.includes(e.id);
    return `<div class="canon-row ${seen ? 'seen' : ''} ${inter ? 'intervened' : ''}">
      <span class="canon-day">D${e.dayStart}</span>
      <div><b>${esc(e.title)}</b><small>${esc(e.location)} · ${esc(e.dateLabel)}</small></div>
      <span class="canon-state">${inter ? '已介入' : seen ? '已发生' : '未发生'}</span>
    </div>`;
  }).join('');
  openModal(`<div class="modal wide">
    <div class="modal-head"><span class="head-icon">${icon('eye')}</span><div><h2>canon 追踪</h2><p class="modal-sub">你知道主角团会在哪一天出现在哪里——但你不一定赶得上。</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><div class="canon-table">${rows}</div></div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">介入会改写后续报纸与结局；旁观也会留下记录。</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">收起</button></div>
  </div>`);
}

/* ---------- location / actions ---------- */
function openLocation(id) {
  const loc = regionLocations().find(l => l.id === id);
  if (!loc) return;
  const actions = (regionActions()[id] || []).slice();
  const activeHere = state.activeCommission && state.activeCommission.location === id ? state.activeCommission : null;
  const canonHere = state.pendingCanon.map(eid => regionCanon().find(e => e.id === eid)).filter(e => e && canonLocationId(e) === id);
  const npcs = (regionNpcLocations()[id] || []).map(nid => regionNPCs().find(n => n.id === nid)).filter(Boolean);
  const rows = actions.map(a => {
    const disabled = state.ap <= 0;
    const check = a.check ? `<span class="action-check">${attrName(a.check.attr)} DC ${a.check.dc}</span>` : '';
    return `<button class="action-row" data-act="do-action" data-loc="${id}" data-id="${a.id}" ${disabled ? 'disabled' : ''}>
      <span class="action-name">${esc(a.label)}${check}</span>
      <span class="action-desc">${esc(a.desc)}</span>
      <span class="action-cost">${a.openBoard ? '免费' : '1 行动'}</span>
    </button>`;
  }).join('');
  const extras = [];
  if (canonHere.length) {
    canonHere.forEach(e => extras.push(`<button class="action-row canon-action" data-act="open-canon" data-id="${e.id}" ${state.ap <= 0 ? 'disabled' : ''}>
      <span class="action-name">${icon('eye')}介入：${esc(e.title)}<span class="action-check">canon 锚点</span></span>
      <span class="action-desc">${esc(e.newspaper)}</span><span class="action-cost">1 行动</span>
    </button>`));
  }
  if (activeHere) {
    extras.push(`<button class="action-row commission-action" data-act="resolve-commission" ${state.ap <= 0 ? 'disabled' : ''}>
      <span class="action-name">${icon('star')}处理委托：${esc(activeHere.title)}<span class="action-check">${attrName(activeHere.check.attr)} DC ${activeHere.check.dc}</span></span>
      <span class="action-desc">${esc(activeHere.desc)}</span><span class="action-cost">1 行动</span>
    </button>`);
  }
  const ambient = regionAmbient().filter(a => a.location === id);
  if (ambient.length) extras.push(`<button class="action-row" data-act="wander" data-loc="${id}" ${state.ap <= 0 ? 'disabled' : ''}><span class="action-name">${icon('search')}在附近转转</span><span class="action-desc">不一定发生什么，但廷根从不缺怪事。</span><span class="action-cost">1 行动</span></button>`);
  openModal(`<div class="modal wide location-modal">
    <div class="modal-head"><span class="head-icon" style="border-color:${loc.color};color:${loc.color}">${icon(loc.icon)}</span><div><h2>${esc(loc.name)}</h2><p class="modal-sub">${esc(loc.sub)} · 第 ${state.day} 天 · 剩余 ${state.ap} 行动</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body">
      <div class="loc-hero-line"><div class="loc-hero-sigil" style="--c:${loc.color}">${icon(loc.icon)}</div><div><p class="kicker">${esc(loc.name)}</p><p class="scene-text">${esc(locationFlavor(id))}</p></div></div>
      ${npcs.length ? `<div class="npc-strip">${npcs.map(n => `<button class="npc-card" data-act="npc" data-id="${n.id}" style="--c:${n.color}"><span class="npc-avatar">${esc(n.name[0])}</span><span><b>${esc(n.name)}</b><small>${esc(n.role)}</small></span><em>${relLabel(state.relations[n.id] || 0)}</em></button>`).join('')}</div>` : ''}
      <div class="action-list">${rows}${extras.join('')}</div>
    </div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">行动点 ${state.ap}/2 · 生命 ${state.player.health}/10 · 疯狂 ${state.player.madness}/10</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">先不行动</button></div>
  </div>`, {});
}
function locationFlavor(id) {
  const map = {
    home: '水仙花街的午后很安静。楼下有人在洗衣服，隔壁的留声机卡在同一句歌词上。',
    blackthorn: '黑荆棘的接待厅永远有咖啡味。罗珊在整理文件，邓恩办公室的门半开着，伦纳德在窗边看报纸。',
    club: '黄水晶房里的灯偏暗。安洁莉卡在接待台后面打瞌睡，空气里有红茶和廉价香水的味道。',
    asylum: '疯人院的长走廊今天很安静。安静到你能听见某个房间里有人在数拍子。',
    docks: '码头区的风带着咸味和煤烟。仓库门半开着，有人在里面低声争论。',
    church: '彩窗把红月滤成碎玻璃。大祈祷厅里有人点蜡烛，地底的查尼斯门紧闭着。'
  };
  const backlund = {
    lodging: '东区的出租屋很窄，窗外是永远晾不干的衣服和一层薄雾。',
    detective: '事务所的招牌被雾打湿了。夏洛克在桌边摆弄一副塔罗牌，像在等一个不会准时来的人。',
    west: '皇后区的街道干净得不像贝克兰德。马车经过时，窗帘后面有人看你。',
    docks: '塔索克河的水是灰的。仓库、酒馆和没有灯的船挤在同一个河湾里。',
    church: '黑夜教堂的彩窗把雾滤成灰色。告解室的门半掩着，里面没有声音。',
    university: '贝克兰德大学的旧书库有霉味。管理员说，最里面那排书“不建议借阅”。'
  };
  const sea = {
    port: '罗思德群岛的港口永远湿漉漉的。水手、商人和没有名字的船挤在同一个码头。',
    ship: '幽蓝复仇者号的甲板在夜里发出轻响。船长室的灯亮着，海图铺了一桌。',
    market: '黑市藏在两条巷子之间。这里卖的东西，有一半不该存在。',
    island: '无人岛很小，沙滩上只有脚印，没有离开的痕迹。',
    storm: '风暴眼像一只闭着的眼睛。船身在响，罗盘在转，所有人都很安静。'
  };
  const south = {
    port: '拜朗港的太阳把石头晒得发白。送葬队伍从码头经过，没有人哭。',
    estate: '庄园的白墙爬满棕榈影。餐厅里摆着餐具，主人已经三天没有呼吸。',
    altar: '玫瑰祭坛藏在雨林深处。石槽里的血没有干，空气里有甜味。',
    grave: '古墓群的石棺一排排开着。守墓人说，夜里有人唱歌。',
    jungle: '雨林的藤蔓会自己让路。你总觉得是有人在前面替你拨开。'
  };
  const war = {
    front: '战壕里的泥没过靴子。铁丝网上挂着布条，分不清是军旗还是绷带。',
    camp: '军团营地整夜有号声。红祭司的旗在风里响，像有人在磨刀。',
    hospital: '医院帐篷里没有足够的床。医生把活人和死人放在同一排。',
    court: '王庭后勤处的墙上挂着地图。地图上的箭头比尸体多。',
    altar: '神降祭坛的石阶被火照得发红。士兵排着队，没有人说话。'
  };
  const forsaken = {
    white: '白银城的石墙很高，灯很旧。街上的人走路很轻，像怕把光震灭。',
    moon: '月城没有月亮，只有一块块发光的碎片。使者说话时，碎片会跟着轻轻响。',
    court: '巨人王庭的废墟比想象中安静。王座太大，坐着的人太小。',
    wild: '黑暗荒野没有路。你走出的每一步，都会被黑暗记住。',
    altar: '光之祭坛是全城最后一盏灯。站在这里，你能听见所有人的呼吸。'
  };
  if (state.region === 'forsaken') return forsaken[id] || '';
  if (state.region === 'war') return war[id] || '';
  if (state.region === 'south') return south[id] || '';
  if (state.region === 'sea') return sea[id] || '';
  return (state.region === 'backlund' ? backlund[id] : map[id]) || '';
}
function performAction(locId, actionId) {
  if (!state.player) return;
  if (state.ap <= 0) { toast('今天的行动点用完了。', 'danger'); return; }
  const action = (regionActions()[locId] || []).find(a => a.id === actionId);
  if (!action) return;
  if (action.openBoard) { openCommissionBoard(); return; }
  if (action.retire) {
    const gate = state.region === 'backlund' ? 4 : 8;
    if (state.day < gate) { toast(`你还没有攒够退出的勇气。第 ${gate} 天以后再来。`, 'danger'); return; }
    openRetire(); return;
  }
  state.ap--;
  state._lastLocation = locId;
  let success = true, check = null;
  if (action.check) {
    check = roll(action.check.attr, action.check.dc, `${locId}:${actionId}`);
    success = check.success;
  }
  const effects = success ? (action.effects || {}) : Object.assign({}, action.effects || {}, action.fail || {});
  applyEffects(effects);
  log(`${locationName(locId)}：${action.label}${check ? (success ? '（成功）' : '（失败）') : ''}`);
  const text = success ? action.text : failureText(action, check);
  if (checkFailure()) return;
  autoSave();
  showActionResult(action.label, text, effects, check, () => {
    if (state.ap <= 0) openNight(); else renderHub();
  });
}
function failureText(action, check) {
  if (!check) return action.text;
  if (check.attr === 'body') return '你撑住了，但代价不小。有人在你身后骂了一句，你没听清。';
  if (check.attr === 'social') return '对方没有信你。你看见他的手伸向口袋，又放了回去。';
  if (check.attr === 'insight') return '你漏掉了关键的一行。等反应过来，纸已经被风吹走了。';
  if (check.attr === 'spirit') return '灵性像一根被拉过头的弦。你听见耳鸣，没有听见答案。';
  return '运气没有站在你这边。你只拿到了一半的答案。';
}
function showActionResult(title, text, effects, check, after) {
  const checkHtml = check ? `<div class="check-line ${check.success ? 'ok' : 'fail'}">${icon(check.success ? 'spark' : 'drop')} ${attrName(check.attr)}判定：d6 ${check.d6} + ${state.player.attrs[check.attr]}（+${check.bonus}）= ${check.total} / DC ${check.dc} · ${check.success ? '成功' : '失败'}</div>` : '';
  openModal(`<div class="modal narrow">
    <div class="modal-head"><span class="head-icon">${icon(check && !check.success ? 'drop' : 'feather')}</span><div><h2>${esc(title)}</h2><p class="modal-sub">第 ${state.day} 天 · ${esc(locationName(state._lastLocation || 'home'))}</p></div><button class="modal-close" data-act="close-result">${icon('close')}</button></div>
    <div class="modal-body"><p class="scene-text">${esc(text)}</p>${checkHtml}<div class="effect-tags">${effectTags(effects)}</div><div class="result-note">${state.ap <= 0 ? '行动点用完了。接下来是夜晚。' : `还剩 ${state.ap} 个行动点。`}</div></div>
    <div class="modal-foot"><span class="spacer"></span><button class="btn primary small" data-act="close-result">继续</button></div>
  </div>`, after);
}
function openRetire() {
  const candidates = endingCandidates(true);
  openEndingChooser(candidates, '退休结算', '你可以选择离开非凡世界。这不是失败，是另一种活法。');
}
function openFinal() {
  const candidates = endingCandidates(false);
  let next = null;
  if (state.region === 'tingen') next = { next: 'backlund', label: '前往贝克兰德 · 第二段' };
  else if (state.region === 'backlund') next = { next: 'sea', label: '出海 · 第三段' };
  else if (state.region === 'sea') next = { next: 'south', label: '前往南大陆 · 第四段' };
  else if (state.region === 'south') next = { next: 'war', label: '前往战争 · 第五段' };
  else if (state.region === 'war') next = { next: 'forsaken', label: '前往神弃之地 · 第六段' };
  const titles = { tingen: '廷根结算', backlund: '贝克兰德结算', sea: '海上结算', south: '南大陆结算', war: '战争结算', forsaken: '神弃之地结算' };
  const texts = {
    tingen: '你活到了第 30 天。廷根还在，你也还在。你可以留在这里结算，也可以去贝克兰德继续追因斯。',
    backlund: '贝克兰德的雾还在。你活过了这 14 天。现在，你可以留下结算，也可以登上那条没有灯的船。',
    sea: '海风吹散了雾。你活过了这 10 天。现在，你可以留下结算，也可以去南大陆看看死人怎么生活。',
    south: '拜朗的太阳落下去。你活过了这 8 天。现在，你可以留下结算，也可以去前线看看活人怎么死。',
    war: '炮声停了。你活过了这 8 天。现在，你可以留下结算，也可以去神弃之地看看没有太阳的人怎么活。',
    forsaken: '你活过了这 6 天。白银城的灯还亮着。现在，你要决定自己要不要成为那盏灯。'
  };
  openEndingChooser(candidates, titles[state.region] || '结算', texts[state.region] || '', next);
}
function endingCandidates(retireOnly = false) {
  const p = state.player;
  const list = [];
  for (const e of DATA.endings.bad) {
    if (e.cond.health !== undefined && p.health <= e.cond.health) list.push(e);
    if (e.cond.madness !== undefined && p.madness >= e.cond.madness) list.push(e);
    if (e.cond.flags && e.cond.flags.every(f => state.flags[f])) list.push(e);
  }
  if (list.length) return list;
  const pool = regionEndings();
  for (const e of pool.ordinary) {
    if (e.region && e.region !== state.region) continue;
    if (!e.region && state.region !== 'tingen') continue;
    if (ordinaryOk(e)) list.push(e);
  }
  if (!retireOnly) {
    for (const e of pool.core) {
      if (e.region && e.region !== state.region) continue;
      if (coreOk(e)) list.push(e);
    }
  }
  if (!list.length) {
    const daily = pool.ordinary.find(e => e.id === (state.region === 'backlund' ? 'backlund_daily' : 'daily'));
    list.push(daily || DATA.endings.ordinary.find(e => e.id === 'daily'));
  }
  return list.slice(0, 8);
}
function ordinaryOk(e) {
  const p = state.player, c = e.cond || {};
  if (c.humanity !== undefined && p.humanity < c.humanity) return false;
  if (c.money !== undefined && p.money < c.money) return false;
  if (c.reputation !== undefined && p.reputation < c.reputation) return false;
  if (c.insight !== undefined && p.attrs.insight < c.insight) return false;
  if (c.acting !== undefined && p.acting < c.acting) return false;
  if (c.notoriety !== undefined && p.notoriety < c.notoriety) return false;
  return true;
}
function coreOk(e) {
  const p = state.player, c = e.cond || {};
  if (c.humanity !== undefined && p.humanity < c.humanity) return false;
  if (c.sequence !== undefined && p.sequence > c.sequence) return false;
  if (c.notoriety !== undefined && p.notoriety < c.notoriety) return false;
  if (c.reputation !== undefined && p.reputation < c.reputation) return false;
  if (c.money !== undefined && p.money < c.money) return false;
  if (c.acting !== undefined && p.acting < c.acting) return false;
  if (c.insight !== undefined && p.attrs.insight < c.insight) return false;
  if (c.flags && !c.flags.every(f => state.flags[f])) return false;
  if (c.relations) {
    for (const [k, v] of Object.entries(c.relations)) if ((state.relations[k] || 0) < v) return false;
  }
  return true;
}
function openEndingChooser(candidates, title, text, next = null) {
  const cards = candidates.map(e => `<button class="ending-choice" data-act="pick-ending" data-id="${e.id}"><span class="ending-choice-tag">${e.headline ? '结局' : ''}</span><b>${esc(e.title)}</b><small>${esc(e.headline || '')}</small><p>${esc((e.text || '').slice(0, 80))}…</p></button>`).join('');
  const nextBtn = next ? `<button class="btn primary small" data-act="next-act" data-next="${next.next}">${icon('arrow')}${esc(next.label)}</button>` : '';
  openModal(`<div class="modal wide">
    <div class="modal-head"><span class="head-icon">${icon('star')}</span><div><h2>${esc(title)}</h2><p class="modal-sub">结局由你的选择、关系和${regionLabel()}的状态结算</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><p class="scene-text">${esc(text)}</p><div class="ending-grid">${cards}</div></div>
    <div class="modal-foot">${nextBtn}<span class="small" style="color:#6d5740">结局会写入存档柜；可以重开或回书架。</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">再想想</button></div>
  </div>`);
}

/* ---------- canon ---------- */
function canonChoices(e) {
  if (e.id === 'v1-e12') {
    return [
      { label: '把骨灰盒留在查尼斯门后，先保住邓恩', hint: '反事实分支：不让队长一个人站在最前面。', effects: { humanity: 2, relations: { dunn: 1 } }, flag: 'intervened_final', result: '你和伦纳德在接待厅设伏。邓恩活了下来，但他看你的眼神里多了一个问题。' },
      { label: '按队长的安排，让他带骨灰盒正面迎敌', hint: '原作走向：邓恩会把自己的心脏放进骨灰盒。', effects: { humanity: -1, madness: 1 }, flag: 'canon_final', result: '邓恩把心脏放进骨灰盒。他说：“我们拯救了廷根。”然后倒下去。' },
      { label: '旁观，不改变这一夜', hint: '你只是来见证的。', effects: { madness: 1, insight: 2 }, flag: 'watched_final', result: '你站在街角，看着黑荆棘的灯一盏一盏熄灭。报纸第二天只写了“瓦斯泄漏”。' }
    ];
  }
  if (e.id === 'v1-e08') {
    return [
      { label: '警告克里斯蒂娜，让她带梅高欧丝离开', hint: '救一个还在相信爱情的女人。', effects: { humanity: 2, relations: { christina: 1 } }, flag: 'warned_christina', result: '克里斯蒂娜脸色发白。她抓着梅高欧丝的手，说：“我们走。”但梅高欧丝回头看了一眼红烟囱。' },
      { label: '跟踪梅高欧丝，找到红烟囱', hint: '先知道仪式在哪里。', check: { attr: 'insight', dc: 9 }, effects: { insight: 2 }, flag: 'followed_megose', result: '你跟着她穿过三条街。她在一栋红砖房前停下，手放在肚子上，像在听什么。' },
      { label: '不介入，继续查兰尔乌斯', hint: '你只有 30 天。', effects: { insight: 1 }, result: '你转身离开。身后传来一声很轻的口哨，像婴儿在数拍子。' }
    ];
  }
  if (e.id === 'v1-e10') {
    return [
      { label: '把红烟囱的线索告诉邓恩', hint: '让值夜者去处理。', effects: { relations: { dunn: 1 }, humanity: 1 }, flag: 'told_dunn_redchimney', result: '邓恩听完，沉默了很久：“我会带人去看看。”他看你的眼神里多了一点警惕。' },
      { label: '独自去红烟囱房屋', hint: '你想在值夜者之前看到那本手稿。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 2, madness: 1 }, flag: 'saw_manuscript', result: '你推开红砖房的门。桌上有一本棕色封皮的厚书，羽毛笔自己写着你的名字。' },
      { label: '烧掉你手里的线索，装作不知道', hint: '不把自己写进这一页。', effects: { madness: -1, notoriety: 1 }, result: '你把纸烧了。灰烬落进下水道，像一群很小的黑鸟。' }
    ];
  }
  if (e.id === 'v1-e02') {
    return [
      { label: '主动和邓恩打招呼', hint: '让他记住你的脸。', effects: { relations: { dunn: 1 }, insight: 1 }, flag: 'saw_klein', result: '邓恩和你握了手。他身后的年轻人抬起头，看了你一眼。你认出那是克莱恩·莫雷蒂。' },
      { label: '站在街对面观察', hint: '先知道谁在进出黑荆棘。', effects: { insight: 2 }, flag: 'saw_klein', result: '你在街对面站了一个下午。你看见克莱恩、伦纳德和一个穿黑风衣的男人先后进入黑荆棘。' },
      { label: '离开，不惹麻烦', hint: '值夜者不是你现在该碰的。', effects: { luck: 1 }, result: '你转身走进人群。黑荆棘的铃铛在身后响了一声。' }
    ];
  }
  return [
    { label: '旁观并记录', hint: '先看清楚发生了什么。', effects: { insight: 2 }, result: '你站在人群边缘，把看到的细节记在笔记本上。' },
    { label: '以普通人身份接触', hint: '试着和当事人说一句话。', check: { attr: 'social', dc: 9 }, effects: { relations: state.region === 'backlund' ? { klein: 1 } : { dunn: 1 }, insight: 1 }, result: '你说了一句很普通的话。对方放松了一点，告诉你一个不该告诉外人的细节。' },
    { label: '直接介入', hint: '用非凡者的方式改变事件。', check: { attr: 'spirit', dc: 10 }, effects: { insight: 2, madness: 1 }, flag: 'intervened_' + e.id, result: '你伸出手。事件没有按原定的方向走，你也不知道这是好是坏。' }
  ];
}
function openCanon(id) {
  const e = regionCanon().find(x => x.id === id);
  if (!e) return;
  if (state.ap <= 0) { toast('今天的行动点用完了。', 'danger'); return; }
  if (state.canonIntervened.includes(id)) { toast('这件事已经处理过了。', ''); return; }
  const choices = canonChoices(e);
  openModal(`<div class="modal wide canon-modal">
    <div class="modal-head"><span class="head-icon">${icon('eye')}</span><div><h2>${esc(e.title)}</h2><p class="modal-sub">DAY ${e.dayStart} · ${esc(e.location)} · ${esc(e.dateLabel)}</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body">
      <div class="canon-canon"><span class="kicker">CANON</span><p>${esc(e.canon)}</p></div>
      <div class="canon-news">${icon('book')} ${esc(e.newspaper)}</div>
      <p class="scene-text">你可以介入，也可以只是看着。无论选什么，这件事都会留下记录。</p>
      <div class="choice-list">${choices.map((c, i) => `<button class="oc-choice" data-act="canon-choice" data-id="${id}" data-i="${i}" ${state.ap <= 0 ? 'disabled' : ''}><span>${esc(c.label)}</span><small>${esc(c.hint || '')}</small><em>${effectTags(c.effects)} ${c.check ? `<span class="action-check">${attrName(c.check.attr)} DC ${c.check.dc}</span>` : ''}</em></button>`).join('')}</div>
    </div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">介入消耗 1 行动点 · 剩余 ${state.ap}/2</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">再想想</button></div>
  </div>`);
}
function chooseCanon(id, i) {
  const e = regionCanon().find(x => x.id === id);
  if (!e || state.ap <= 0) return;
  const choices = canonChoices(e);
  const c = choices[i];
  if (!c) return;
  state.ap--;
  let success = true, check = null;
  if (c.check) { check = roll(c.check.attr, c.check.dc, `canon:${id}:${i}`); success = check.success; }
  const effects = success ? (c.effects || {}) : Object.assign({}, c.effects || {}, { madness: 1, notoriety: 1 });
  applyEffects(effects);
  if (c.flag && success) state.flags[c.flag] = true;
  if (!state.canonSeen.includes(id)) state.canonSeen.push(id);
  if (!state.canonIntervened.includes(id)) state.canonIntervened.push(id);
  state.pendingCanon = state.pendingCanon.filter(x => x !== id);
  log(`canon：${e.title} · ${c.label}${check ? (success ? '（成功）' : '（失败）') : ''}`);
  if (checkFailure()) return;
  autoSave();
  const text = success ? c.result : '事情没有按你预想的方向走。你只来得及看见一半，另一半被红月遮住了。';
  showActionResult(e.title, text, effects, check, () => { if (state.ap <= 0) openNight(); else renderHub(); });
}
function resolveCanonPending() {
  for (const id of state.pendingCanon) {
    if (!state.canonSeen.includes(id)) state.canonSeen.push(id);
    const e = regionCanon().find(x => x.id === id);
    log(`canon：${e ? e.title : id} 按原定轨迹发生。`);
    if (e && e.id === 'v1-e12') state.flags.canon_final = true;
  }
  state.pendingCanon = [];
}

/* ---------- commissions ---------- */
function openCommissionBoard() {
  const active = state.activeCommission;
  const rows = regionCommissions().map(c => {
    const done = state.completedCommissions.includes(c.id);
    const isActive = active && active.id === c.id;
    return `<div class="commission-card ${done ? 'done' : ''} ${isActive ? 'active' : ''}">
      <div class="commission-head"><b>${esc(c.title)}</b><span>${esc(locationName(c.location))}</span></div>
      <p>${esc(c.desc)}</p>
      <div class="commission-meta"><span>${attrName(c.check.attr)} DC ${c.check.dc}</span><span>${c.days} 天</span><span>${c.reward} 镑</span></div>
      ${done ? '<span class="commission-done">已完成</span>' : isActive ? '<span class="commission-done">进行中</span>' : `<button class="btn small" data-act="accept-commission" data-id="${c.id}" ${active ? 'disabled' : ''}>接受</button>`}
    </div>`;
  }).join('');
  openModal(`<div class="modal wide">
    <div class="modal-head"><span class="head-icon">${icon('star')}</span><div><h2>${regionLabel()}委托板</h2><p class="modal-sub">${state.region === 'forsaken' ? '白银城 / 月城 / 王庭 / 荒野 / 祭坛' : state.region === 'war' ? '前线 / 军团 / 医院 / 王庭 / 祭坛' : state.region === 'south' ? '港口 / 庄园 / 祭坛 / 古墓 / 雨林' : state.region === 'sea' ? '港口 / 船上 / 黑市' : state.region === 'backlund' ? '侦探所 / 码头 / 大学 / 教堂' : '黑荆棘 / 码头区 / 教会'} · 一次只能接一个</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><div class="commission-grid">${rows}</div></div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">${active ? `进行中：${esc(active.title)}` : '没有进行中的委托'}</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">收起</button></div>
  </div>`);
}
function acceptCommission(id) {
  if (state.activeCommission) { toast('你已经在处理一个委托了。', 'danger'); return; }
  const c = regionCommissions().find(x => x.id === id);
  if (!c) return;
  state.activeCommission = Object.assign({}, c, { acceptedDay: state.day });
  log(`接受委托：${c.title}`);
  autoSave();
  closeModal();
  renderHub();
  toast('委托已接受。去委托地点处理。', 'good');
}
function resolveCommission() {
  const c = state.activeCommission;
  if (!c) return;
  if (state.ap <= 0) { toast('今天的行动点用完了。', 'danger'); return; }
  state.ap--;
  const check = roll(c.check.attr, c.check.dc, `commission:${c.id}`);
  if (check.success) {
    applyEffects({ money: c.reward, reputation: c.rep || 0, notoriety: c.notoriety || 0, relations: c.relations || {}, madness: c.madness || 0, humanity: c.humanity || 0 });
    if (!state.completedCommissions.includes(c.id)) state.completedCommissions.push(c.id);
    log(`完成委托：${c.title}`);
    state.activeCommission = null;
    autoSave();
    if (checkFailure()) return;
    showActionResult(c.title, '委托完成。对方把报酬推过来，没有多问。', { money: c.reward, reputation: c.rep || 0, notoriety: c.notoriety || 0 }, check, () => { if (state.ap <= 0) openNight(); else renderHub(); });
  } else {
    applyEffects({ notoriety: 1, health: -1 });
    log(`委托失败：${c.title}`);
    state.activeCommission = null;
    autoSave();
    showActionResult(c.title, '你没有完成委托。对方没有付钱，还在门外留了一个记号。', { notoriety: 1, health: -1 }, check, () => { if (state.ap <= 0) openNight(); else renderHub(); });
  }
}
function checkCommissionDeadline() {
  const c = state.activeCommission;
  if (!c) return;
  if (state.day - c.acceptedDay > c.days) {
    applyEffects({ notoriety: 1, reputation: -1 });
    log(`委托过期：${c.title}`);
    state.activeCommission = null;
  }
}

/* ---------- night / day ---------- */
function openNight() {
  openModal(`<div class="modal narrow night-modal">
    <div class="modal-head"><span class="head-icon">${icon('moon')}</span><div><h2>第 ${state.day} 天 · 夜晚</h2><p class="modal-sub">红月升起来了。你准备怎么过这一夜？</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body">
      <div class="night-choices">
        <button class="oc-choice" data-act="night-choice" data-id="rest"><span>休息</span><small>生命 +2 · 疯狂 -1</small><em>把门锁好，睡一会儿。</em></button>
        <button class="oc-choice" data-act="night-choice" data-id="act"><span>扮演${esc(state.player.pathwayName)}</span><small>扮演进度 +1 · 疯狂 +1</small><em>做出符合魔药名称的行为，消化它。</em></button>
        <button class="oc-choice" data-act="night-choice" data-id="notes"><span>整理笔记</span><small>洞察 +1 · 声望 +1</small><em>把今天的报纸和传闻整理成线索。</em></button>
      </div>
      <p class="small muted">缺陷「${esc(state.player.flawName)}」会在夜间生效。</p>
    </div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">剩余行动点 ${state.ap}/2 · 结束后进入第 ${state.day + 1} 天</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">再等等</button></div>
  </div>`);
}
function chooseNight(id) {
  const c = { rest: { health: 2, madness: -1 }, act: { acting: 1, madness: 1 }, notes: { insight: 1, reputation: 1 } }[id];
  if (!c) return;
  if (id === 'act') state.player.acting = (state.player.acting || 0) + 1;
  applyEffects(c);
  if (state.player.flawId === 'insomnia') applyEffects({ madness: 1 });
  log(`夜晚：${id === 'rest' ? '休息' : id === 'act' ? '扮演' : '整理笔记'}`);
  resolveCanonPending();
  closeModal();
  if (checkFailure()) return;
  if (state.day >= state.maxDay) { openFinal(); return; }
  state.day++;
  checkCommissionDeadline();
  autoSave();
  startDay();
}
function startAct(region, act, maxDay) {
  state.region = region;
  state.act = act;
  state.maxDay = maxDay;
  state.day = 1;
  state.ap = 2;
  state.activeCommission = null;
  state.pendingCanon = [];
  state.newspaper = [];
  state.ending = null;
  const extra = regionData().npcs || [];
  for (const n of extra) if (state.relations[n.id] === undefined) state.relations[n.id] = 0;
  state.screen = 'hub';
  log(region === 'forsaken' ? '黑暗：你走进了没有太阳的地方。' : region === 'war' ? '前线：炮声从地平线传来。' : region === 'south' ? '南下：拜朗港的太阳落在码头上。' : region === 'sea' ? '出海：罗思德群岛的潮气扑面而来。' : '交通：蒸汽列车抵达贝克兰德。');
  autoSave();
  startDay(true);
  toast(region === 'forsaken' ? '第六段：神弃之地。灯还亮着。' : region === 'war' ? '第五段：战争。红祭司在看着你。' : region === 'south' ? '第四段：南大陆。死人比活人守规矩。' : region === 'sea' ? '第三段：海上。风比雾更硬。' : '第二段：贝克兰德。雾比廷根厚。', 'good');
}
function startBacklund() { startAct('backlund', 2, 14); }
function startSea() { startAct('sea', 3, 10); }
function startSouth() { startAct('south', 4, 8); }
function startWar() { startAct('war', 5, 8); }
function startForsaken() { startAct('forsaken', 6, 6); }

/* ---------- endings ---------- */
function showEnding(id) {
  const e = endingById(id);
  if (!e) return;
  state.ending = id;
  unlockEnding(id);
  state.screen = 'ending';
  updatePlaytime();
  autoSave();
  closeModal();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function endingById(id) {
  const pool = regionEndings();
  return [].concat(pool.ordinary, pool.core, pool.bad).find(x => x.id === id);
}
function renderEnding() {
  const e = endingById(state.ending) || DATA.endings.ordinary.find(x => x.id === 'daily');
  const p = state.player;
  const unlocked = saves.filter(s => s.snapshot && s.snapshot.ending).length;
  $('#app').innerHTML = `
  <main class="ending-screen oc-ending">
    <div class="ending-art"><div class="ending-moon"></div><div class="ending-city"></div></div>
    <section class="ending-card">
      <span class="ending-tag">${icon('star')}结局档案</span>
      <h1>${esc(e.title)}</h1>
      <p class="ending-sub">${esc(e.headline || '')}</p>
      <div class="ending-body"><p>${esc(e.text)}</p>
        <div class="quote">“${esc(endingQuote(e))}”</div>
      </div>
      <div class="ending-stats">
        <span>第 <b>${state.day}</b> 天</span>
        <span>序列 <b>${p.sequence}</b> · ${esc(p.pathwayName)}</span>
        <span>人性 <b>${p.humanity}</b>/10</span>
        <span>疯狂 <b>${p.madness}</b>/10</span>
        <span>金钱 <b>${p.money}</b> 镑</span>
        <span>声望 <b>${p.reputation}</b></span>
      </div>
      <div class="ending-actions">
        <button class="btn primary" data-act="new">${icon('feather')}重新捏人</button>
        <button class="btn" data-act="saves">${icon('save')}存档柜</button>
        <button class="btn ghost" data-act="archive">${icon('stack')}档案库</button>
        <button class="btn ghost" data-act="title">${icon('moon')}回到标题</button>
      </div>
      <div class="small" style="margin-top:14px;color:var(--muted);line-height:1.7">这是 OC AU 结局。原作与设定归爱潜水的乌贼及相关权利方所有。</div>
    </section>
  </main>`;
}
function endingQuote(e) {
  const quotes = {
    flower: '至少花不会问你昨晚去了哪。',
    mayor: '先修路灯。',
    teacher: '历史是一个任人打扮的小姑娘，但考试不是。',
    daily: '普通人的日常，也是一种胜利。',
    mad: '你终于听见了所有人的声音。',
    witness: '你见过他，但你没有说。',
    sacrifice: '没有名字，也算活过。',
    backlund_reporter: '删掉的那一段，才是真的。',
    backlund_detective: '雾里没有真话，只有价码。',
    backlund_cafe: '杯子会转，客人不会问。',
    backlund_scholar: '有些书，最好永远不借出去。',
    backlund_philanthropist: '口罩挡不住雾，但能挡住一点绝望。',
    backlund_socialite: '真事留给自己，在夜里慢慢想。',
    backlund_daily: '雾散了，你还在这里。'
  };
  return quotes[e.id] || '廷根还在，你也还在。';
}

/* ---------- ambient ---------- */
function wander(locId) {
  if (state.ap <= 0) { toast('今天的行动点用完了。', 'danger'); return; }
  const pool = regionAmbient().filter(a => a.location === locId);
  if (!pool.length) { toast('这里暂时没有什么可看的。', ''); return; }
  const rng = seeded(`${state.player.name}:${state.day}:wander:${locId}`);
  const amb = pool[Math.floor(rng() * pool.length)];
  activeAmbient = amb;
  state.ap--;
  state._lastLocation = locId;
  log(`${locationName(locId)}：在附近转转`);
  openModal(`<div class="modal narrow">
    <div class="modal-head"><span class="head-icon">${icon('search')}</span><div><h2>街角见闻</h2><p class="modal-sub">${esc(locationName(locId))} · 第 ${state.day} 天</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><p class="scene-text">${esc(amb.text)}</p><div class="choice-list">${amb.choices.map((c, i) => `<button class="oc-choice" data-act="ambient-choice" data-i="${i}"><span>${esc(c.label)}</span><small>${effectTags(c.effects)}</small></button>`).join('')}</div></div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">行动点 ${state.ap}/2</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">离开</button></div>
  </div>`, () => { if (state.ap <= 0) openNight(); else renderHub(); });
}
function chooseAmbient(i) {
  const amb = activeAmbient;
  if (!amb || !amb.choices[i]) return;
  applyEffects(amb.choices[i].effects || {});
  log(`街角见闻：${amb.choices[i].label}`);
  activeAmbient = null;
  closeModal();
  autoSave();
  if (checkFailure()) return;
  if (state.ap <= 0) openNight(); else renderHub();
}

/* ---------- saves ---------- */
function openSaveDialog() {
  if (!state.player) { toast('先进入廷根，才能存档。', 'danger'); return; }
  const slots = [1, 2, 3].map(n => {
    const s = saveById('manual-' + n);
    return `<button class="save-slot ${s ? 'filled' : ''}" data-act="save-to-slot" data-slot="${n}">
      <span class="slot-no">0${n}</span><span class="slot-info"><b>${s ? esc(s.name) : '空档'}</b><small>${s ? `${esc(s.playerName)} · 第 ${s.day} 天 · ${formatDate(s.updatedAt)}` : '写入当前第 ' + state.day + ' 天'}</small></span><span class="slot-action">${s ? '覆盖' : '保存'}</span>
    </button>`;
  }).join('');
  openModal(`<div class="modal narrow">
    <div class="modal-head"><span class="head-icon">${icon('save')}</span><div><h2>保存到档案柜</h2><p class="modal-sub">自动档每天更新；手动档保留关键时刻</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><p class="scene-text">第 <b>${state.day}</b> 天 · ${esc(state.player.name)} · ${esc(state.player.pathwayName)}</p><div class="save-slots">${slots}</div></div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">自动档：${saveById('auto') ? '已存在' : '尚未生成'}</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">取消</button></div>
  </div>`);
}
function saveToSlot(slot) {
  saveGame('manual', slot, null);
  closeModal();
  toast(`已保存到手动档 ${slot}。`, 'good');
}
function formatDate(ts) {
  try { return new Date(ts).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
}
function formatPlay(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  return `${Math.floor(s / 60)} 分钟`;
}
function renderSaves() {
  state.screen = 'saves';
  const all = saves.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const cards = all.map(s => `<div class="oc-save-card" style="--c:${s.type === 'auto' ? '#8e2f3c' : '#c9a35c'}">
    <div class="oc-save-top"><span>${s.type === 'auto' ? '自动档' : '手动档'}</span><span>${s.region === 'backlund' ? '贝克兰德' : '廷根'} · 第 ${s.day} / ${s.maxDay || 30} 天</span></div>
    <h3>${esc(s.name)}</h3>
    <p class="oc-save-sub">${esc(s.playerName)} · ${esc(s.pathway)} · 序列 ${s.sequence}</p>
    <p class="oc-save-summary">${esc(s.summary)}</p>
    <div class="oc-save-bars"><span>生命 ${s.health}/10</span><span>疯狂 ${s.madness}/10</span><span>${s.money} 镑</span></div>
    <div class="oc-save-time">${formatDate(s.updatedAt)} · ${formatPlay(s.snapshot && s.snapshot.playtime)}</div>
    <div class="oc-save-actions"><button data-act="load-save" data-id="${s.id}">${icon('play')}读取</button><button data-act="delete-save" data-id="${s.id}">${icon('trash')}删除</button></div>
  </div>`).join('');
  const empties = [1, 2, 3].filter(n => !saveById('manual-' + n)).map(n => `<div class="oc-save-card empty"><div class="oc-save-top"><span>手动档</span><span>空</span></div><h3>空档位 ${n}</h3><p class="oc-save-sub">进入廷根后可写入当前进度。</p></div>`).join('');
  $('#app').innerHTML = `
  ${state.player ? hud() : ''}
  <main class="saves-shell">
    <div class="saves-head"><div><p class="kicker">LOCAL ARCHIVE</p><h1>档案柜</h1><p class="shelf-lede">自动档每天更新，手动档保留关键节点。只存在这台设备。</p></div><div><button class="btn ghost small" data-act="export-saves">${icon('download')}导出</button><button class="btn ghost small" data-act="pick-import">${icon('upload')}导入</button><button class="btn ghost small" data-act="title">${icon('arrow')}返回</button></div></div>
    <div class="oc-save-grid">${cards}${empties}${!all.length && !empties ? '<div class="empty-cabinet">还没有存档。开始一局，系统会自动生成第一份档案。</div>' : ''}</div>
    <div class="saves-foot"><span>${all.length} 个存档 · 本地 localStorage</span><span>${state.player ? `当前：第 ${state.day} 天` : '未进入廷根'}</span></div>
  </main>`;
}
async function loadSave(id) {
  const s = saveById(id);
  if (!s) return;
  state = Object.assign(freshState(), JSON.parse(JSON.stringify(s.snapshot)));
  state.maxDay = state.maxDay || (state.region === 'backlund' ? 14 : 30);
  state.screen = state.ending ? 'ending' : 'hub';
  state._lastTick = 0;
  sessionStart = Date.now();
  closeModal();
  if (state.ending) renderEnding(); else renderHub();
  toast('已读取存档。', 'good');
}
function confirmDelete(id) {
  const s = saveById(id);
  if (!s) return;
  openModal(`<div class="modal narrow"><div class="modal-head"><span class="head-icon">${icon('trash')}</span><div><h2>删除存档？</h2><p class="modal-sub">${esc(s.name)}</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div><div class="modal-body"><p class="scene-text">这一页会从档案柜里移除，不能撤销。</p></div><div class="modal-foot"><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">取消</button><button class="btn danger small" data-act="delete-confirm" data-id="${id}">删除</button></div></div>`);
}
function deleteSave(id) {
  saves = saves.filter(s => s.id !== id);
  persistSaves();
  closeModal();
  renderSaves();
  toast('存档已删除。', '');
}
function exportSaves() {
  const blob = new Blob([JSON.stringify({ version: 1, saves }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `廷根异闻-存档-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('存档已导出。', 'good');
}
function importFile(file) {
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      const list = Array.isArray(data) ? data : data.saves;
      if (!Array.isArray(list)) throw new Error('bad');
      let n = 0;
      for (const s of list) {
        if (!s || !s.id || !s.snapshot) continue;
        const i = saves.findIndex(x => x.id === s.id);
        if (i >= 0) saves[i] = s; else saves.push(s);
        n++;
      }
      persistSaves(); renderSaves(); toast(`已导入 ${n} 个存档。`, 'good');
    } catch (e) { toast('导入失败：不是有效的存档 JSON。', 'danger'); }
  };
  r.readAsText(file);
}

/* ---------- settings / about / npc ---------- */
function openSettings() {
  openModal(`<div class="modal narrow">
    <div class="modal-head"><span class="head-icon">${icon('settings')}</span><div><h2>设置</h2><p class="modal-sub">阅读与本地数据</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><div class="settings-grid">
      <div class="setting-row"><div><div class="s-label">字号</div><div class="s-desc">只影响文字，不改变地图布局。</div></div><div class="font-btns">${[1, 1.15, 1.3].map(v => `<button class="${settings.textScale === v ? 'on' : ''}" data-act="font-size" data-size="${v}">${Math.round(v * 100)}%</button>`).join('')}</div></div>
      <div class="setting-row"><div><div class="s-label">减少动效</div><div class="s-desc">关闭长过渡与闪烁。</div></div><button class="switch ${settings.motion ? 'on' : ''}" data-act="toggle-motion"></button></div>
      <div class="setting-row"><div><div class="s-label">存档</div><div class="s-desc">导出 JSON，或从备份导入。</div></div><div style="display:flex;gap:5px"><button class="btn ghost small" data-act="export-saves">${icon('download')}导出</button><button class="btn ghost small" data-act="pick-import">${icon('upload')}导入</button></div></div>
      <div class="setting-row"><div><div class="s-label">版本</div><div class="s-desc">六段 76 天 · 44 个 canon 锚点 · 本地运行</div></div><span class="tag">v0.6</span></div>
    </div></div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">本作是 OC AU 同人；不含原作长段正文。</span><span class="spacer"></span><button class="btn primary small" data-act="close-modal">完成</button></div>
  </div>`, {});
}
function openAbout() {
  openModal(`<div class="modal">
    <div class="modal-head"><span class="head-icon">${icon('moon')}</span><div><h2>六段旅程指南</h2><p class="modal-sub">OC AU · 76 天</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body">
      <p class="scene-text">你是一个原创非凡者。每天有 2 个行动点；读报纸，去地点，接委托，和 NPC 说话。canon 事件会在固定日期发生，你可以旁观、接触或直接介入。廷根第 30 天去贝克兰德，第 14 天出海，第 10 天南下，第 8 天去前线，第 6 天进入神弃之地。</p>
      <div class="help-list">
        <div class="help-item"><span class="h-num">1</span><div><h4>报纸</h4><p>每天早上更新：canon 行踪、玩家影响、市井传闻。报纸可能滞后，也可能撒谎。</p></div></div>
        <div class="help-item"><span class="h-num">2</span><div><h4>判定</h4><p>属性 + d6。失败也会留下后果。占卜家/收尸人有特定判定加成。</p></div></div>
        <div class="help-item"><span class="h-num">3</span><div><h4>canon 事件</h4><p>每个锚点都有“介入”窗口。介入消耗 1 行动点，会改写后续报纸与结局。</p></div></div>
        <div class="help-item"><span class="h-num">4</span><div><h4>结局</h4><p>第 30 天结算。普通人结局不是失败：开花店、当区长、回大学教书，都是活法。</p></div></div>
      </div>
      <div class="scene-note" style="margin-top:12px">非官方、非商业同人。原作权利归爱潜水的乌贼及相关权利方所有。存档只在本机。</div>
    </div>
    <div class="modal-foot"><span class="spacer"></span><button class="btn primary small" data-act="close-modal">进廷根</button></div>
  </div>`);
}
function openNpc(id) {
  const n = regionNPCs().find(x => x.id === id);
  if (!n) return;
  const r = state.relations[id] || 0;
  openModal(`<div class="modal narrow">
    <div class="modal-head"><span class="head-icon" style="border-color:${n.color};color:${n.color}">${icon('person')}</span><div><h2>${esc(n.name)}</h2><p class="modal-sub">${esc(n.role)} · ${relLabel(r)}</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><p class="scene-text">${esc(n.desc)}</p><div class="relation-meter"><i style="width:${Math.min(100, (r + 5) * 10)}%"></i></div><p class="small muted">关系：${r} · 在对应地点行动可以提升。</p></div>
    <div class="modal-foot"><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">收起</button></div>
  </div>`);
}
function openRelations() {
  const rows = regionNPCs().map(n => {
    const r = state.relations[n.id] || 0;
    return `<button class="relation-card" data-act="npc" data-id="${n.id}" style="--c:${n.color}"><span class="rel-avatar">${esc(n.name[0])}</span><span><b>${esc(n.name)}</b><small>${esc(n.role)} · ${relLabel(r)}</small></span><em>${r}</em></button>`;
  }).join('');
  openModal(`<div class="modal">
    <div class="modal-head"><span class="head-icon">${icon('heart')}</span><div><h2>关系档案</h2><p class="modal-sub">他们不知道你的全部，但他们记得你做过什么。</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><div class="relation-grid">${rows}</div></div>
    <div class="modal-foot"><span class="small" style="color:#6d5740">关系来自行动与 canon 介入；负数表示警惕或敌意。</span><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">收起</button></div>
  </div>`);
}

/* ---------- archive ---------- */
function archiveHeader() {
  return `<header class="oc-hud archive-hud">
    <button class="oc-brand" data-act="title">${icon('moon')}<span>档案库<small>THE TINGEN / BACKLUND FILES</small></span></button>
    <div class="archive-hud-title"><b>${ARCHIVE_TAB[state.archiveTab || 'endings']}</b><span>${state.player ? `${regionLabel()} · 第 ${state.day} 天` : '未进入廷根'}</span></div>
    <div class="hud-actions">
      ${state.player ? `<button class="icon-btn" data-act="shelf" title="回到当前">${icon('arrow')}</button>` : ''}
      <button class="icon-btn" data-act="title" title="回到标题">${icon('moon')}</button>
    </div>
  </header>`;
}
function renderArchive() {
  state.screen = 'archive';
  const tab = state.archiveTab || 'endings';
  const counts = { endings: allEndings().filter(e => unlockedEndings.includes(e.id)).length, canon: (window.CANON_EVENTS || []).length, people: allNpcs().length };
  const tabs = Object.keys(ARCHIVE_TAB).map(k => `<button class="archive-tab ${tab === k ? 'active' : ''}" data-act="archive-tab" data-tab="${k}">${ARCHIVE_TAB[k]}<span>${counts[k]}</span></button>`).join('');
  const body = tab === 'canon' ? renderCanonArchive() : tab === 'people' ? renderPeopleArchive() : renderEndingArchive();
  $('#app').innerHTML = `${archiveHeader()}<main class="archive-shell"><div class="archive-tabs">${tabs}</div>${body}</main>`;
}
function endingHint(e) {
  const c = e.cond || {};
  const bits = [];
  if (c.humanity !== undefined) bits.push(`人性≥${c.humanity}`);
  if (c.money !== undefined) bits.push(`金钱≥${c.money}`);
  if (c.reputation !== undefined) bits.push(`声望≥${c.reputation}`);
  if (c.insight !== undefined) bits.push(`洞察≥${c.insight}`);
  if (c.acting !== undefined) bits.push(`扮演≥${c.acting}`);
  if (c.notoriety !== undefined) bits.push(`恶名≥${c.notoriety}`);
  if (c.flags && c.flags.length) bits.push(`关键选择：${c.flags.join('、')}`);
  if (c.relations) bits.push(Object.entries(c.relations).map(([k, v]) => `${k}关系≥${v}`).join('、'));
  return bits.length ? bits.join(' · ') : '完成任意一段并选择退出';
}
function renderEndingArchive() {
  const all = allEndings();
  const b = (window.OC_BACKLUND && window.OC_BACKLUND.endings) || { ordinary: [], core: [] };
  const s = (window.OC_SEA && window.OC_SEA.endings) || { ordinary: [], core: [] };
  const t = (window.OC_SOUTH && window.OC_SOUTH.endings) || { ordinary: [], core: [] };
  const w = (window.OC_WAR && window.OC_WAR.endings) || { ordinary: [], core: [] };
  const f = (window.OC_FORSAKEN && window.OC_FORSAKEN.endings) || { ordinary: [], core: [] };
  const groups = [
    ['普通人的结局', all.filter(e => DATA.endings.ordinary.includes(e) || (b.ordinary || []).includes(e) || (s.ordinary || []).includes(e) || (t.ordinary || []).includes(e) || (w.ordinary || []).includes(e) || (f.ordinary || []).includes(e))],
    ['核心结局', all.filter(e => DATA.endings.core.includes(e) || (b.core || []).includes(e) || (s.core || []).includes(e) || (t.core || []).includes(e) || (w.core || []).includes(e) || (f.core || []).includes(e))],
    ['坏结局', all.filter(e => DATA.endings.bad.includes(e))]
  ];
  const cards = groups.map(([name, list]) => `<section class="archive-section"><div class="archive-section-head"><h2>${name}</h2><span>${list.filter(e => unlockedEndings.includes(e.id)).length} / ${list.length}</span></div><div class="ending-gallery">${list.map(e => {
    const on = unlockedEndings.includes(e.id);
    return `<button class="ending-gallery-card ${on ? 'unlocked' : 'locked'}" data-act="archive-ending" data-id="${e.id}">
      <span class="gallery-state">${on ? '已解锁' : '未解锁'}</span>
      <h3>${on ? esc(e.title) : '？？？'}</h3>
      <p>${on ? esc(e.headline || '') : esc(endingHint(e))}</p>
      ${on ? `<small>${esc((e.text || '').slice(0, 70))}…</small>` : `<small>在${e.region === 'backlund' ? '贝克兰德' : '廷根'}或后续时间线中达成条件</small>`}
    </button>`;
  }).join('')}</div></section>`).join('');
  return `<div class="archive-head"><div><p class="kicker">ENDING MATRIX</p><h1>结局档案</h1><p class="shelf-lede">已解锁 ${unlockedEndings.length} / ${all.length}。普通人结局不是失败，是另一种活法。</p></div><div class="archive-seal">${icon('star')}<b>${unlockedEndings.length}</b><span>UNLOCKED</span></div></div>${cards}`;
}
function renderCanonArchive() {
  const all = window.CANON_EVENTS || [];
  const filter = state.canonFilter || 'all';
  const list = all.filter(e => {
    if (filter === 'seen') return state.canonSeen.includes(e.id);
    if (filter === 'intervened') return state.canonIntervened.includes(e.id);
    if (filter === 'unseen') return !state.canonSeen.includes(e.id);
    return true;
  });
  const vols = [1, 2, 3, 4, 5, 6, 7, 8];
  const groups = vols.map(v => [v, list.filter(e => e.volumeId === v)]).filter(([, a]) => a.length);
  const filters = [['all', '全部'], ['seen', '已发生'], ['unseen', '未发生'], ['intervened', '已介入']].map(([k, v]) => `<button class="archive-filter ${filter === k ? 'on' : ''}" data-act="archive-filter" data-f="${k}">${v}</button>`).join('');
  return `<div class="archive-head"><div><p class="kicker">CANON ANCHORS</p><h1>八部 canon 总表</h1><p class="shelf-lede">${all.length} 个锚点。当前存档只记录已发生的；未发生的不会剧透细节。</p></div><div class="archive-seal">${icon('eye')}<b>${state.canonSeen.length}</b><span>SEEN</span></div></div>
  <div class="archive-filters">${filters}</div>
  ${groups.map(([v, arr]) => `<section class="archive-section"><div class="archive-section-head"><h2>第 ${v} 部 · ${esc(arr[0].volumeTitle)}</h2><span>${arr.length} 个锚点</span></div><div class="canon-archive">${arr.map(e => {
    const seen = state.canonSeen.includes(e.id);
    const inter = state.canonIntervened.includes(e.id);
    return `<div class="canon-archive-row ${seen ? 'seen' : ''} ${inter ? 'intervened' : ''}"><span class="ca-id">${e.id}</span><div><b>${esc(e.title)}</b><small>${esc(e.location)} · ${esc(e.dateLabel)}</small></div><span class="ca-state">${inter ? '已介入' : seen ? '已发生' : '未发生'}</span></div>`;
  }).join('')}</div></section>`).join('')}
  ${!groups.length ? '<div class="empty-cabinet">这个筛选下没有锚点。</div>' : ''}`;
}
function allNpcs() {
  const seen = new Set();
  return [].concat(DATA.npcs, (window.OC_BACKLUND && window.OC_BACKLUND.npcs) || [], (window.OC_SEA && window.OC_SEA.npcs) || [], (window.OC_SOUTH && window.OC_SOUTH.npcs) || [], (window.OC_WAR && window.OC_WAR.npcs) || [], (window.OC_FORSAKEN && window.OC_FORSAKEN.npcs) || []).filter(n => { if (!n || seen.has(n.id)) return false; seen.add(n.id); return true; });
}
function renderPeopleArchive() {
  const rows = allNpcs().map(n => {
    const r = state.player ? (state.relations[n.id] || 0) : null;
    return `<button class="people-card" data-act="archive-npc" data-id="${n.id}" style="--c:${n.color}"><span class="people-avatar">${esc(n.name[0])}</span><span><b>${esc(n.name)}</b><small>${esc(n.role)}</small></span><em>${r === null ? '未建档' : relLabel(r)}</em></button>`;
  }).join('');
  return `<div class="archive-head"><div><p class="kicker">PERSONNEL FILES</p><h1>人物档案</h1><p class="shelf-lede">廷根与贝克兰德的关系网。关系值只在当前存档内变化。</p></div><div class="archive-seal">${icon('person')}<b>${allNpcs().length}</b><span>FILES</span></div></div><div class="people-grid">${rows}</div>`;
}
function openEndingDetail(id) {
  const e = allEndings().find(x => x.id === id);
  if (!e) return;
  if (!unlockedEndings.includes(id)) { toast('这个结局还没解锁。', ''); return; }
  openModal(`<div class="modal narrow">
    <div class="modal-head"><span class="head-icon">${icon('star')}</span><div><h2>${esc(e.title)}</h2><p class="modal-sub">${esc(e.headline || '')}</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><p class="scene-text">${esc(e.text)}</p><div class="result-note">${esc(endingHint(e))}</div></div>
    <div class="modal-foot"><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">收起</button></div>
  </div>`);
}
function openArchiveNpc(id) {
  const n = allNpcs().find(x => x.id === id);
  if (!n) return;
  const r = state.player ? (state.relations[id] || 0) : null;
  openModal(`<div class="modal narrow">
    <div class="modal-head"><span class="head-icon" style="border-color:${n.color};color:${n.color}">${icon('person')}</span><div><h2>${esc(n.name)}</h2><p class="modal-sub">${esc(n.role)}${r === null ? '' : ' · ' + relLabel(r)}</p></div><button class="modal-close" data-act="close-modal">${icon('close')}</button></div>
    <div class="modal-body"><p class="scene-text">${esc(n.desc)}</p></div>
    <div class="modal-foot"><span class="spacer"></span><button class="btn ghost small" data-act="close-modal">收起</button></div>
  </div>`);
}

/* ---------- render / init ---------- */
function render() {
  if (!state) state = freshState();
  document.body.dataset.screen = state.screen;
  if (state.screen === 'creator') return renderCreator();
  if (state.screen === 'hub') return renderHub();
  if (state.screen === 'ending') return renderEnding();
  if (state.screen === 'saves') return renderSaves();
  if (state.screen === 'archive') return renderArchive();
  return renderTitle();
}
function newGame() {
  state = freshState();
  draft = freshDraft();
  state.screen = 'creator';
  render();
}
function continueGame() {
  const s = latestSave();
  if (!s) { newGame(); return; }
  loadSave(s.id);
}
function init() {
  loadSettings();
  saves = loadSaves();
  unlockedEndings = loadUnlocked();
  for (const s of saves) if (s.snapshot && s.snapshot.ending) unlockEnding(s.snapshot.ending);
  state = freshState();
  draft = freshDraft();
  render();
  setInterval(() => { updatePlaytime(); }, 1000);
  window.addEventListener('beforeunload', () => { if (state && state.player) { updatePlaytime(); autoSave(); } });
  window.__OC__ = {
    version: '0.1.0',
    getState: () => JSON.parse(JSON.stringify(state)),
    getSaves: () => JSON.parse(JSON.stringify(saves)),
    getScreen: () => state.screen,
    newGame, render, startDay, openLocation, performAction, openCanon, chooseCanon,
    openCommissionBoard, acceptCommission, resolveCommission, openFinal, showEnding,
    startBacklund, startSea, startSouth, startWar, startForsaken, saveGame, loadSave, day: () => state.day, region: () => state.region
  };
}
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (act === 'modal-backdrop') { if (e.target === el) closeModal(); return; }
  if (act === 'close-modal') { closeModal(); return; }
  if (act === 'close-result') { closeModal(); return; }
  if (act === 'title') { if (state.player) { updatePlaytime(); autoSave(); } state.screen = 'title'; render(); return; }
  if (act === 'new') { newGame(); return; }
  if (act === 'continue') { continueGame(); return; }
  if (act === 'saves') { state.screen = 'saves'; render(); return; }
  if (act === 'archive') { state.screen = 'archive'; state.archiveTab = state.archiveTab || 'endings'; render(); return; }
  if (act === 'archive-tab') { state.archiveTab = el.dataset.tab; render(); return; }
  if (act === 'archive-filter') { state.canonFilter = el.dataset.f; render(); return; }
  if (act === 'archive-ending') { openEndingDetail(el.dataset.id); return; }
  if (act === 'archive-npc') { openArchiveNpc(el.dataset.id); return; }
  if (act === 'about') { openAbout(); return; }
  if (act === 'settings') { openSettings(); return; }
  if (act === 'pick-origin') { draft.origin = el.dataset.id; renderCreator(); return; }
  if (act === 'pick-pathway') { draft.pathway = el.dataset.id; renderCreator(); return; }
  if (act === 'pick-flaw') { draft.flaw = el.dataset.id; renderCreator(); return; }
  if (act === 'pick-contact') { draft.contact = el.dataset.id; renderCreator(); return; }
  if (act === 'pick-look') { draft.look = el.dataset.id; renderCreator(); return; }
  if (act === 'attr-plus') { adjustAttr(el.dataset.k, 1); return; }
  if (act === 'attr-minus') { adjustAttr(el.dataset.k, -1); return; }
  if (act === 'create-start') { buildPlayer(); return; }
  if (act === 'open-location') { openLocation(el.dataset.id); return; }
  if (act === 'do-action') { performAction(el.dataset.loc, el.dataset.id); return; }
  if (act === 'wander') { wander(el.dataset.loc); return; }
  if (act === 'ambient-choice') { chooseAmbient(Number(el.dataset.i)); return; }
  if (act === 'open-canon') { openCanon(el.dataset.id); return; }
  if (act === 'canon-choice') { chooseCanon(el.dataset.id, Number(el.dataset.i)); return; }
  if (act === 'canon-list') { openCanonList(); return; }
  if (act === 'open-commission') { openCommissionBoard(); return; }
  if (act === 'accept-commission') { acceptCommission(el.dataset.id); return; }
  if (act === 'resolve-commission') { resolveCommission(); return; }
  if (act === 'end-day') { openNight(); return; }
  if (act === 'night-choice') { chooseNight(el.dataset.id); return; }
  if (act === 'pick-ending') { showEnding(el.dataset.id); return; }
  if (act === 'go-backlund') { closeModal(); startBacklund(); return; }
  if (act === 'next-act') { closeModal(); if (el.dataset.next === 'sea') startSea(); else if (el.dataset.next === 'south') startSouth(); else if (el.dataset.next === 'war') startWar(); else if (el.dataset.next === 'forsaken') startForsaken(); else startBacklund(); return; }
  if (act === 'save') { openSaveDialog(); return; }
  if (act === 'save-to-slot') { saveToSlot(Number(el.dataset.slot)); return; }
  if (act === 'load-save') { loadSave(el.dataset.id); return; }
  if (act === 'delete-save') { confirmDelete(el.dataset.id); return; }
  if (act === 'delete-confirm') { deleteSave(el.dataset.id); return; }
  if (act === 'export-saves') { exportSaves(); return; }
  if (act === 'pick-import') { $('#import-file').click(); return; }
  if (act === 'npc') { openNpc(el.dataset.id); return; }
  if (act === 'relations') { openRelations(); return; }
  if (act === 'newspaper') { openNewspaper(); return; }
  if (act === 'font-size') { settings.textScale = Number(el.dataset.size); state.settings.textScale = settings.textScale; applySettings(); persistSettings(); openSettings(); return; }
  if (act === 'toggle-motion') { settings.motion = !settings.motion; state.settings.motion = settings.motion; applySettings(); persistSettings(); openSettings(); return; }
});
document.addEventListener('change', (e) => {
  if (e.target && e.target.id === 'import-file') { importFile(e.target.files && e.target.files[0]); e.target.value = ''; }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('#modal-root').innerHTML) { closeModal(); e.preventDefault(); }
});
init();




