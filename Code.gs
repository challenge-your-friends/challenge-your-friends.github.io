/**
 * Workout-Coach – Backend (Google Apps Script)
 * Speichert Benutzer + Fortschritt in einer Google-Tabelle und
 * schickt Erinnerungs-Mails (Mo–Sa) – jede/r wählt in der App: keine, 1 (18 Uhr) oder 2 (7 + 18 Uhr).
 *
 * Einrichtung: einmal die Funktion setup() ausführen, dann
 * "Bereitstellen > Neue Bereitstellung > Web-App", Ausführen als: Ich,
 * Zugriff: Jeder. Die Web-App-URL in index.html bei API_URL eintragen.
 */
// alle Mails zeigen auf die neue Adresse (Umzug am 23.11.2026 vorgezogen)
const APP_LINK = 'https://challenge-your-friends.github.io/';
const PLAN = {1:'Tag A', 2:'Kurztag', 3:'Tag B', 4:'Kurztag', 5:'Tag A', 6:'Kurztag'};
// A und B wechseln wöchentlich (Woche ab 23.11.2026: A-B-A, danach B-A-B usw.)
function planName_(t) { const n = PLAN[dow_(t)]; if (!n || n === 'Kurztag') return n; const wk = Math.round((new Date(weekKey_(t) + 'T12:00:00Z') - new Date('2026-11-23T12:00:00Z')) / 6048e5); return (((wk % 2) + 2) % 2 === 1) ? (n === 'Tag A' ? 'Tag B' : 'Tag A') : n; }
const CH_START = '2026-12-01', CH_END = '2026-12-31';
// Schummel-Schutz: Workouts zählen nur mit Start-/End-Meldung und Mindestdauer
const MIN_SEC = { A: 600, B: 680, K: 320, C: 100 }; // 25.11.2026: Plank 60 s, kürzere Pausen
const CH_P = { d: 2, w: 5 };
function dstr_(v) { return (v instanceof Date) ? Utilities.formatDate(v, 'Europe/Berlin', 'yyyy-MM-dd') : String(v || ''); }
function weekKey_(k) { return addDays_(k, -((dow_(k) + 6) % 7)); }
function parseData_(o) { let d = {}; try { d = JSON.parse(o.data || '{}'); } catch (e) {} d.days = d.days || {}; d.ch = d.ch || {}; d.ms = d.ms || []; return d; }
function xmas_(k) { return k >= '2026-12-24' && k <= '2026-12-26'; }
function wdOk_(d, k) { const e = d.ch['wd:' + k]; return !!(e && !e.failed); }
function finish_(d, start0, s, t, easy) {
  const y = addDays_(t, -1);
  let start = start0 || '2026-11-23';
  if (t >= CH_START && start < CH_START) start = CH_START;
  if (s.w === 'C') {
    const id = String(s.c || ''), n = String(s.n || '').slice(0, 40);
    // Easter Egg: Dauer-Plank für Gestörte – keine Punkte, nur Abzeichen (zählt immer, auch in der Testphase)
    if (id === 'e:' + t) {
      if (d.ch[id] && !d.ch[id].failed) return 'dup';
      d.ch[id] = { p: 0, n: n, at: t }; return 'egg';
    }
    if (id === 'd:' + t) {
      if (d.ch[id] && !d.ch[id].failed) return 'dup';
      d.ch[id] = { p: CH_P.d, n: n, at: t }; return 'chal';
    }
    if (id === 'w:' + weekKey_(t)) {
      // heute zählen; ist heute schon erledigt: 1x pro Woche den verpassten Vortag nachholen
      const wk = weekKey_(t);
      if (!wdOk_(d, t)) d.ch['wd:' + t] = { p: 0, at: t };
      else {
        let used = false; for (let i = 0; i < 7; i++) { const e = d.ch['wd:' + addDays_(wk, i)]; if (e && e.mk && !e.failed) used = true; }
        if (weekKey_(y) === wk && y >= start && !wdOk_(d, y) && !used) d.ch['wd:' + y] = { p: 0, at: t, mk: 1 };
        else return 'dup';
      }
      let cnt = 0; for (let i = 0; i < 7; i++) { const e = d.ch['wd:' + addDays_(weekKey_(t), i)]; if (e && !e.failed) cnt++; }
      if (cnt >= 7 && !(d.ch[id] && !d.ch[id].failed)) { d.ch[id] = { p: CH_P.w, n: n, at: t }; return 'week'; }
      return 'weekday';
    }
    return 'badchal';
  }
  if (t < start) return 'probe';
  const D = () => easy ? { done: true, at: t, w: s.w, e: 1 } : { done: true, at: t, w: s.w };
  if (!(d.days[t] && d.days[t].done)) { d.days[t] = D(); return 'today'; }
  if (dow_(y) !== 0 && y >= start && !(d.days[y] && d.days[y].done)) { d.days[y] = D(); return 'nach'; }
  return 'extra';
}
const HEAD = ['name','nameKey','pinHash','salt','token','email','start','data','created','updated'];

function sheet_() {
  const p = PropertiesService.getScriptProperties();
  let id = p.getProperty('SHEET_ID');
  let ss;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create('Workout-Coach Daten');
    p.setProperty('SHEET_ID', ss.getId());
  }
  let sh = ss.getSheetByName('Users');
  if (!sh) { sh = ss.getSheets()[0]; sh.setName('Users'); sh.getRange(1,1,1,HEAD.length).setValues([HEAD]); sh.setFrozenRows(1); }
  return sh;
}

function setup() {
  sheet_();
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dailyReminder').timeBased().everyDays(1).atHour(18).nearMinute(0).inTimezone('Europe/Berlin').create();
  ScriptApp.newTrigger('morningReminder').timeBased().everyDays(1).atHour(7).nearMinute(0).inTimezone('Europe/Berlin').create();
  ScriptApp.newTrigger('weeklySummary').timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(18).nearMinute(0).inTimezone('Europe/Berlin').create();
  Logger.log('Fertig. Tabelle: ' + SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getUrl());
}

function hash_(pin, salt) {
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + pin, Utilities.Charset.UTF_8);
  return b.map(x => ('0' + (x & 255).toString(16)).slice(-2)).join('');
}
function rows_() {
  const sh = sheet_();
  const v = sh.getDataRange().getValues();
  return { sh, rows: v.slice(1).map((r, i) => { const o = Object.fromEntries(HEAD.map((h, j) => [h, r[j]])); o.start = dstr_(o.start); return { row: i + 2, o: o }; }) };
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function today_() { return Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd'); }
function validEmail_(e) { return !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function doGet() { return out_({ ok: true, app: 'workout-coach' }); }

function doPost(e) {
  // Ranking nur lesen – braucht keine Sperre (sonst hängt das Ranking, wenn gerade ein anderer Vorgang läuft)
  let q0 = {}; try { q0 = JSON.parse(e.postData.contents || '{}'); } catch (x) {}
  // Schnellweg für Online-Status & Anfeuern (ohne die ganze Tabelle zu lesen)
  if (q0.a === 'ping' || q0.a === 'cheer') {
    const c0 = CacheService.getScriptCache(), m0 = q0.token ? c0.get('tk_' + q0.token) : null;
    if (m0 && c0.get('allk')) { const l0 = LockService.getScriptLock(); if (!l0.tryLock(8000)) return out_({ ok: false, err: 'beschäftigt' }); try { return out_(live_(JSON.parse(m0), q0)); } finally { l0.releaseLock(); } }
  }
  const lock = LockService.getScriptLock();
  if (q0.a !== 'list' && !lock.tryLock(25000)) return out_({ ok: false, err: 'Server gerade beschäftigt – bitte gleich nochmal versuchen' });
  try {
    const q = JSON.parse(e.postData.contents || '{}');
    const { sh, rows } = rows_();
    const byToken = t => rows.find(r => t && r.o.token === t);
    const key = String(q.name || '').trim().toLowerCase();
    CacheService.getScriptCache().put('allk', JSON.stringify(rows.map(r => r.o.nameKey)), 21600);
    if (q.a === 'ping' || q.a === 'cheer') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      const me = { k: r.o.nameKey, n: r.o.name };
      CacheService.getScriptCache().put('tk_' + q.token, JSON.stringify(me), 21600);
      return out_(live_(me, q));
    }

    if (q.a === 'register') {
      const name = String(q.name || '').trim().slice(0, 20);
      const pin = String(q.pin || '');
      const email = String(q.email || '').trim().slice(0, 100);
      if (name.length < 2) return out_({ ok: false, err: 'Benutzername zu kurz' });
      if (!/^\d{4}$/.test(pin)) return out_({ ok: false, err: 'PIN muss 4 Ziffern haben' });
      if (!validEmail_(email)) return out_({ ok: false, err: 'E-Mail ungültig' });
      if (rows.some(r => r.o.nameKey === key)) return out_({ ok: false, err: 'Benutzername ist schon vergeben' });
      const salt = Utilities.getUuid(), token = Utilities.getUuid();
      const t = today_();
      const start = t < '2026-11-23' ? '2026-11-23' : t;
      const data = JSON.stringify({ days: {}, ms: [], ch: {} });
      sh.appendRow([name, key, hash_(pin, salt), salt, token, email, start, data, new Date(), new Date()]);
      return out_({ ok: true, token, name, email, start, data: JSON.parse(data) });
    }
    if (q.a === 'login') {
      const r = rows.find(x => x.o.nameKey === key);
      if (!r || hash_(String(q.pin || ''), r.o.salt) !== r.o.pinHash) return out_({ ok: false, err: 'Name oder PIN falsch' });
      return out_({ ok: true, v: 2, token: r.o.token, name: r.o.name, email: r.o.email, start: dstr_(r.o.start), data: parseData_(r.o) });
    }
    if (q.a === 'me') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      return out_({ ok: true, v: 2, name: r.o.name, email: r.o.email, start: dstr_(r.o.start), data: parseData_(r.o) });
    }
    if (q.a === 'save') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      // Nur Meilensteine, Spitzenreiter-Ansage und "nicht geschafft" dürfen vom Handy kommen.
      // Trainingstage und Challenge-Punkte setzt ausschließlich der Server (Aktion finish).
      const d = q.data || {}, cd = d.ch || {}, cur = parseData_(r.o), t = today_();
      if (Array.isArray(d.ms)) cur.ms = d.ms.slice(0, 60).map(x => String(x).slice(0, 10));
      if (typeof d.bx === 'number' && isFinite(d.bx)) cur.bx = Math.max(0, Math.min(30, Math.round(d.bx)));
      if (d.g === 'w' || d.g === 'm') cur.g = d.g; // Wertung: Frauen bekommen auf "Leicht" die vollen Punkte
      if (cd.msg && cd.msg.t) cur.ch.msg = { p: 0, t: String(cd.msg.t).slice(0, 140), ts: String(cd.msg.ts || new Date().toISOString()).slice(0, 30) };
      else delete cur.ch.msg;
      // Krank / Pause: Liste [Start, Ende] (Ende leer = läuft noch)
      const okD = v => /^\d{4}-\d\d-\d\d$/.test(String(v || ''));
      if (Array.isArray(cd.pz)) cur.ch.pz = cd.pz.filter(z => Array.isArray(z) && okD(z[0])).slice(-10).map(z => [String(z[0]), okD(z[1]) ? String(z[1]) : '']);
      else delete cur.ch.pz;
      Object.keys(cd).forEach(k => { const v = cd[k]; if (k !== 'msg' && v && v.failed && v.at === t) cur.ch[k] = { p: 0, n: String((cur.ch[k] || {}).n || v.n || '').slice(0, 40), at: t, failed: true }; });
      // Rekorde & Fitness-Test (freiwillig, keine Punkte) – nur Zahlen übernehmen
      const n_ = x => Math.max(0, Math.min(99999, Math.round(+x || 0))), d_ = x => String(x || '').slice(0, 10);
      if (cd.rec && typeof cd.rec === 'object') { const o = {}; Object.keys(cd.rec).slice(0, 80).forEach(k => { const v = cd.rec[k]; if (!/^[a-z0-9]{1,12}$/i.test(k) || !v) return;
        o[k] = { b: n_(v.b), bd: d_(v.bd), f: n_(v.f), fd: d_(v.fd), n: n_(v.n), t: n_(v.t), h: (Array.isArray(v.h) ? v.h : []).slice(-8).map(x => [d_(x && x[0]), n_(x && x[1])]) }; }); cur.ch.rec = o; }
      if (cd.tst && typeof cd.tst === 'object') { const o = {}; ['t0', 't1'].forEach(p => { const v = cd.tst[p]; if (!v) return; const w = { d: d_(v.d), k: v.k ? 1 : 0 }; ['pu', 'plank', 'wallsit', 'hollow'].forEach(e => { if (v[e] !== undefined) w[e] = n_(v[e]); }); o[p] = w; }); cur.ch.tst = o; }
      const clean = JSON.stringify(Object.assign({ days: cur.days, ms: cur.ms, ch: cur.ch, bx: cur.bx || 0 }, cur.g ? { g: cur.g } : {}, cur.mp === 0 || cur.mp === 1 ? { mp: cur.mp } : {}));
      if (clean.length > 45000) return out_({ ok: false, err: 'zu groß' });
      sh.getRange(r.row, HEAD.indexOf('data') + 1).setValue(clean);
      sh.getRange(r.row, HEAD.indexOf('updated') + 1).setValue(new Date());
      return out_({ ok: true });
    }
    if (q.a === 'begin') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      const w = String(q.w || '');
      if (!MIN_SEC[w]) return out_({ ok: false, err: 'Workout unbekannt' });
      const sid = Utilities.getUuid();
      CacheService.getScriptCache().put('s_' + sid, JSON.stringify({ u: r.o.nameKey, w: w, t: Date.now(), c: String(q.c || '').slice(0, 20), n: String(q.n || '').slice(0, 40) }), 21600);
      return out_({ ok: true, sid: sid });
    }
    if (q.a === 'finish') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      const cache = CacheService.getScriptCache(), raw = cache.get('s_' + q.sid);
      if (!raw) return out_({ ok: false, err: 'abgelaufen' });
      const s = JSON.parse(raw);
      if (s.u !== r.o.nameKey) return out_({ ok: false, err: 'auth' });
      if ((Date.now() - s.t) / 1000 < MIN_SEC[s.w]) return out_({ ok: false, err: 'zu schnell' });
      cache.remove('s_' + q.sid);
      const d = parseData_(r.o), kind = finish_(d, dstr_(r.o.start), s, today_(), !!q.easy);
      sh.getRange(r.row, HEAD.indexOf('data') + 1).setValue(JSON.stringify(d));
      sh.getRange(r.row, HEAD.indexOf('updated') + 1).setValue(new Date());
      return out_({ ok: true, kind: kind, data: d });
    }
    if (q.a === 'email') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      const email = String(q.email || '').trim().slice(0, 100);
      if (!validEmail_(email)) return out_({ ok: false, err: 'E-Mail ungültig' });
      sh.getRange(r.row, HEAD.indexOf('email') + 1).setValue(email);
      // Mails pro Tag: 0 = keine, 1 = nur 18 Uhr (falls offen), 2 = 7 + 18 Uhr (Standard)
      const mp = Number(q.mp);
      if (mp === 0 || mp === 1 || mp === 2) {
        const d = parseData_(r.o); if (mp === 2) delete d.mp; else d.mp = mp;
        sh.getRange(r.row, HEAD.indexOf('data') + 1).setValue(JSON.stringify(d));
      }
      return out_({ ok: true, email, mp: (mp === 0 || mp === 1) ? mp : 2 });
    }
    if (q.a === 'list') {
      return out_({ ok: true, users: rows.map(r => {
        let d = {}; try { d = JSON.parse(r.o.data || '{}'); } catch (e) {}
        return { name: r.o.name, start: dstr_(r.o.start), days: d.days || {}, ch: d.ch || {}, bx: +d.bx || 0, g: d.g || '' };
      }), rx: rxList_(rows), du: duelList_() });
    }
    if (q.a === 'react') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      return out_(react_(r.o, rows, q));
    }
    if (q.a === 'duel') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      return out_(duel_(r, rows, sh, q));
    }
    if (q.a === 'feedback') {
      const r = byToken(q.token);
      if (!r) return out_({ ok: false, err: 'auth' });
      return out_(feedback_(r.o, q));
    }
    return out_({ ok: false, err: 'unbekannte Aktion' });
  } catch (err) {
    return out_({ ok: false, err: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function addDays_(k, n) {
  const d = new Date(k + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function dow_(k) { return new Date(k + 'T12:00:00Z').getUTCDay(); }

// gleiche Punkte-Logik wie in der App
function compute_(o, tt) {
  const t = tt > CH_END ? CH_END : tt;
  let data = {}; try { data = JSON.parse(o.data || '{}'); } catch (e) {}
  const days = data.days || {}, ch = data.ch || {};
  let start = o.start || '2026-11-23';
  if (tt >= CH_START && start < CH_START) start = CH_START;
  let pts = 0, streak = 0, total = 0, weekRun = 0, owed = false, cbWk = '';
  for (let k = start; k <= t; k = addDays_(k, 1)) {
    const d = days[k], rest = dow_(k) === 0, past = k < t;
    let st = 'open';
    if (d && d.done) { total++; const ez = d.e && data.g !== 'w' ? 1 : 0; pts += rest ? 1 : (d.at === k) ? (3 - ez) * (xmas_(k) ? 2 : 1) : 1 - ez; st = 'done'; if (!rest) { streak++; weekRun++; if (owed && streak >= 3) { owed = false; const wk = weekKey_(k); if (wk !== cbWk) { cbWk = wk; pts += 3; } } } }
    else if (rest) st = 'rest';
    else if (past) { pts -= 3; streak = 0; weekRun = 0; st = 'miss'; owed = true; }
    if (dow_(k) === 6) { if (weekRun >= 6 && st !== 'open') pts += 3; weekRun = 0; }
  }
  Object.keys(ch).forEach(x => { const c = ch[x]; if (c && (c.at || '') >= start && (c.at || '') <= CH_END) pts += (c.p || 0) * (x.slice(0, 2) === 'd:' && xmas_(c.at) ? 2 : 1); });
  return { pts, streak, total, bx: +data.bx || 0, mp: (data.mp === 0 || data.mp === 1) ? data.mp : 2, done: !!(days[tt] && days[tt].done), days, ch, cbOn: owed, cbN: Math.min(streak, 3) };
}

// ---------- Aktive Gruppe (ab 1.12.) – gleiche Regeln wie in der App ----------
// dabei = ab 1.12. mind. 1 Workout · >7 Tage ohne Training: zählt nicht bei "Wer fehlt"/Gruppenpunkt · >14 Tage: raus (außer Krank/Pause)
function actKeys_(days) { return Object.keys(days || {}).filter(k => k >= CH_START && days[k] && days[k].done).sort(); }
function lastAct_(days, k) { let l = ''; actKeys_(days).forEach(x => { if (x <= k) l = x; }); return l; }
function dd_(a, b) { return Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5); }
function paused_(days, ch, k) {
  const z = ch && ch.pz; if (!Array.isArray(z)) return false; const a = actKeys_(days);
  return z.some(r => Array.isArray(r) && r[0] && r[0] <= k && (!r[1] || k <= r[1]) && !a.some(d => d > r[0] && d <= k));
}
function grp_(days, ch, t) {
  if (t < CH_START) return { inn: true, idle: 0, pz: false, cnt: true };
  const l = lastAct_(days, t); if (!l) return { inn: false, idle: -1, pz: false, cnt: false, never: true };
  const idle = dd_(l, t), pz = paused_(days, ch, t);
  return { inn: pz || idle <= 14, idle: idle, pz: pz, cnt: !pz && idle <= 7 };
}
function groupPts_(rank, t) {
  if (t < CH_START) return 0; let n = 0; const end = t > CH_END ? CH_END : t;
  for (let k = CH_START; k <= end; k = addDays_(k, 1)) {
    if (dow_(k) === 0) continue;
    const m = rank.filter(r => { const l = lastAct_(r.days, k); return l && dd_(l, k) <= 7 && !paused_(r.days, r.ch, k); });
    if (m.length >= 2 && m.every(r => r.days[k] && r.days[k].done && r.days[k].at === k)) n++;
  }
  return n;
}
function ranking_(rows, t) {
  return rows.filter(r => r.o.name).map(r => { const c = compute_(r.o, t); return Object.assign({ row: r }, c, { name: r.o.name, G: grp_(c.days, c.ch, t) }); })
    .sort((a, b) => b.pts - a.pts || b.bx - a.bx || b.streak - a.streak);
}
// Zusatzzeilen für alle Mails: Platz, Wer fehlt, Comeback, Warnung
function list_(a, max) { return a.slice(0, max).join(', ') + (a.length > max ? ' +' + (a.length - max) : ''); }
function placeTxt_(me, act) {
  const i = act.indexOf(me);
  if (i < 0) return me.G.never ? 'Du bist noch nicht im Ranking – mach dein erstes Workout, dann bist du dabei.\n' : 'Du bist gerade nicht im Ranking (' + me.G.idle + ' Tage ohne Training). Mit dem nächsten Workout bist du sofort wieder drin.\n';
  return 'Du: Platz ' + (i + 1) + ' von ' + act.length + ' mit ' + me.pts + ' Punkten' + (me.streak >= 3 ? ', Serie 🔥 ' + me.streak : '') + '.\n' +
    (i > 0 ? 'Bis Platz ' + i + ' fehlen dir ' + (act[i - 1].pts - me.pts + 1) + ' Punkte.\n' : '');
}
function whoTxt_(me, rank, t) {
  if (dow_(t) === 0) return '';
  const cnt = rank.filter(r => r.G.cnt); if (cnt.length < 2) return '';
  const done = cnt.filter(r => r.done), miss = cnt.filter(r => !r.done && r !== me).map(r => r.name);
  return '\n👥 Heute durch: ' + done.length + ' von ' + cnt.length + (miss.length ? ' – es fehlen noch: ' + list_(miss, 8) : '') + '\n' +
    (t >= CH_START ? '🏅 Gruppenpunkt gibt\'s nur, wenn alle durch sind.\n' : '');
}
function extraTxt_(me, t) {
  let s = '';
  if (me.cbOn && t >= (me.row.o.start || '')) s += '🔁 Comeback-Mission: ' + me.cbN + ' von 3 – noch ' + (3 - me.cbN) + ' Workout' + (3 - me.cbN === 1 ? '' : 's') + ' in Folge, dann gibt\'s +3 zurück.\n';
  if (t >= CH_START && me.G.inn && !me.G.pz && me.G.idle > 7) s += '⚠️ ' + me.G.idle + ' Tage ohne Training! Noch ' + (15 - me.G.idle) + ' Tag' + (15 - me.G.idle === 1 ? '' : 'e') + ', dann fliegst du aus Ranking und Gruppe. Krank? In der App unter „Mehr“ → „Krank / Pause“ drücken.\n';
  return s;
}

function dailyReminder() {
  const t = today_();
  const dow = dow_(t);
  if (dow === 0 || t > CH_END) return; // Sonntag Ruhetag / Challenge vorbei
  const y = addDays_(t, -1);
  const { rows } = rows_();
  const rank = ranking_(rows, t), act = rank.filter(r => r.G.inn);
  const medal = ['🥇', '🥈', '🥉'];
  rank.forEach(me => {
    const o = me.row.o;
    if (!o.email || me.mp < 1 || !o.start || t < o.start || me.done || me.G.pz) return;
    const missedY = dow_(y) !== 0 && y >= o.start && !(me.days[y] && me.days[y].done) && !(t >= CH_START && y < CH_START);
    let body = 'Hey ' + o.name + ',\n\n' +
      'dein Workout für heute (' + planName_(t) + ') ist noch offen! 😢\n' +
      (t < CH_START ? '🧪 Testphase – ab 1.12. zählt\'s richtig.\n' : 'Ausreden gibt\'s keine – sonst morgen −3 Punkte.\n');
    if (missedY) body += '\nGestern hast du auch verpasst. Heute nachholen holt 4 Punkte zurück (2 Einheiten machen).\n';
    const ex = extraTxt_(me, t); if (ex) body += '\n' + ex;
    body += whoTxt_(me, rank, t);
    if (act.length) {
      body += '\n🏆 Ranking\n';
      act.slice(0, 3).forEach((r, j) => { body += medal[j] + ' ' + r.name + ' – ' + r.pts + ' Punkte' + (r.streak >= 3 ? ' (🔥 ' + r.streak + ')' : '') + (r.done ? ' ✓ heute' : '') + '\n'; });
    }
    body += '\n' + placeTxt_(me, act);
    body += '\nZum Coach: ' + APP_LINK + '\n\nZieh durch! 💪';
    MailApp.sendEmail({ to: o.email, subject: '😢 ' + o.name + ', vergiss nicht dein Workout!', body: body, name: 'Workout-Coach' });
  });
  archiveCopies_();
}

function weeklySummary() {
  const t = today_();
  if (t > addDays_(CH_END, 1)) return;
  const { rows } = rows_();
  const rank = ranking_(rows, t), act = rank.filter(r => r.G.inn);
  const medal = ['🥇', '🥈', '🥉'];
  const mon = addDays_(t, -6), gp = groupPts_(rank, t);
  let table = '';
  act.forEach((r, j) => { table += (medal[j] || (j + 1) + '.') + ' ' + r.name + ' – ' + r.pts + ' Punkte (' + (r.streak >= 3 ? '🔥 ' + r.streak + ', ' : '') + r.total + (r.total === 1 ? ' Workout' : ' Workouts') + (r.G.pz ? ', ⏸ Pause' : '') + ')\n'; });
  rank.forEach(me => {
    const o = me.row.o;
    if (!o.email || me.mp === 0) return;
    let week = 0; for (let k = mon; k <= t; k = addDays_(k, 1)) if (me.days[k] && me.days[k].done) week++;
    const i = act.indexOf(me);
    let body = 'Hey ' + o.name + ',\n\nhier deine Wochenübersicht 💪\n\n' +
      (t < CH_START ? '🧪 Testphase – ab 1.12. startet die Challenge, dann beginnen alle bei 0 Punkten.\n\n' : '') +
      'Diese Woche: ' + week + ' Workouts\n' + placeTxt_(me, act) +
      (i === 0 ? 'Du führst! Verteidige Platz 1. 🏆\n' : '') + extraTxt_(me, t) +
      (t >= CH_START ? '\n🏅 Gruppenpunkte bisher: ' + gp + ' (Tage, an denen alle Aktiven durch waren)\n' : '') +
      (table ? '\n🏆 Gesamt-Ranking\n' + table : '') + '\nNeue Woche, neue Chance: ' + APP_LINK + '\n\nZieh durch! 💪';
    MailApp.sendEmail({ to: o.email, subject: '🏆 Workout-Challenge: deine Wochenübersicht', body: body, name: 'Workout-Coach' });
  });
  archiveCopies_();
}

function morningReminder() {
  const t = today_();
  const dow = dow_(t);
  if (dow === 0 || t > CH_END) return;
  const { rows } = rows_();
  const rank = ranking_(rows, t), act = rank.filter(r => r.G.inn);
  rank.forEach(me => {
    const o = me.row.o;
    if (!o.email || me.mp < 2 || !o.start || t < o.start || me.G.pz) return;
    const body = 'Guten Morgen ' + o.name + '! ☀️\n\nDenk an dein Workout heute: ' + planName_(t) + ' (max. 15 Minuten).\n' +
      placeTxt_(me, act) + extraTxt_(me, t) +
      (t < CH_START ? '🧪 Testphase – ab 1.12. zählt\'s richtig.\n' : '') +
      '\nJetzt starten: ' + APP_LINK + '\n\nZieh durch! 💪';
    MailApp.sendEmail({ to: o.email, subject: '☀️ Denk an dein Workout heute, ' + o.name + '!', body: body, name: 'Workout-Coach' });
  });
  archiveCopies_();
}

// Kopien der Mails an andere landen (weil über Max' Gmail verschickt) in seinem Postfach (Gesendet) – die kommen in den Papierkorb (30 Tage wiederherstellbar).
const OWNER = 'm.spitthoff@googlemail.com'; // Max – Absender aller Mails
function normMail_(s) {
  const m = String(s || '').match(/<([^>]+)>/); let a = (m ? m[1] : String(s || '')).trim().toLowerCase();
  const p = a.split('@'); if (p.length !== 2) return a;
  let dom = p[1] === 'googlemail.com' ? 'gmail.com' : p[1], loc = p[0];
  if (dom === 'gmail.com') loc = loc.split('+')[0].replace(/\./g, '');
  return loc + '@' + dom;
}
function archiveCopies_(tage) {
  try {
    if (!tage) { Utilities.sleep(30000); planAufraeumen_(); } // 26.11.2026: länger warten + 2. Durchgang
    const me = normMail_(OWNER);
    GmailApp.search('in:sent subject:(Workout OR CYF) newer_than:' + (tage || 2) + 'd -in:trash', 0, 200).forEach(t => {
      const forOthers = t.getMessages().every(m => String(m.getTo()).split(',').every(x => normMail_(x) !== me));
      if (forOthers) t.moveToTrash();
    });
  } catch (e) { Logger.log('Archivieren fehlgeschlagen: ' + e); }
}

// 2. Aufräum-Durchgang 15 Min. nach jeder Mailrunde (fängt Kopien ab, die Gmail beim 1. Mal noch nicht gefunden hat)
function planAufraeumen_() {
  try {
    ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'aufraeumenNach').forEach(t => ScriptApp.deleteTrigger(t));
    ScriptApp.newTrigger('aufraeumenNach').timeBased().after(15 * 60 * 1000).create();
  } catch (e) { Logger.log('Aufräum-Trigger fehlgeschlagen: ' + e); }
}
function aufraeumenNach() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'aufraeumenNach').forEach(t => ScriptApp.deleteTrigger(t));
  archiveCopies_(1);
}

// ---------- Online-Status & Anfeuern (nur im Cache, nichts wird dauerhaft gespeichert) ----------
function live_(me, q) {
  const c = CacheService.getScriptCache(), now = Date.now();
  if (q.a === 'ping') {
    c.put('on_' + me.k, JSON.stringify({ s: q.st === 'run' ? 'run' : 'app', t: now, n: me.n }), 120);
    let ch = []; const raw = c.get('ch_' + me.k);
    if (raw) { try { ch = JSON.parse(raw); } catch (e) {} c.remove('ch_' + me.k); }
    let keys = []; try { keys = JSON.parse(c.get('allk') || '[]'); } catch (e) {}
    const got = keys.length ? c.getAll(keys.map(k => 'on_' + k)) : {}, on = {};
    Object.keys(got).forEach(k => { try { const o = JSON.parse(got[k]); if (now - o.t < 75000) on[o.n] = o.s; } catch (e) {} });
    return { ok: true, ch: ch, on: on };
  }
  const to = String(q.to || '').trim().toLowerCase();
  if (to === me.k) return { ok: false, err: 'Selbst anfeuern zählt nicht 😉' };
  let o = null; try { o = JSON.parse(c.get('on_' + to) || 'null'); } catch (e) {}
  if (!o || o.s !== 'run' || now - o.t > 75000) return { ok: false, err: 'Trainiert gerade nicht mehr' };
  const lk = 'cl_' + me.k + '_' + to; if (c.get(lk)) return { ok: false, err: 'Schon angefeuert – in ein paar Minuten wieder' };
  c.put(lk, '1', 600);
  let ch = []; try { ch = JSON.parse(c.get('ch_' + to) || '[]'); } catch (e) {}
  ch.push({ von: me.n, t: now }); c.put('ch_' + to, JSON.stringify(ch.slice(-20)), 3600);
  return { ok: true };
}

// ---------- Duelle (Blatt "Duelle") ----------
// Wer herausfordert, legt vor. Der Gegner hat 24 Std. zum Kontern. Höherer Wert gewinnt, gleicher Wert = unentschieden.
// Sind beide punktgleich, geht es um +1 Extrapunkt (1× pro Woche pro Paar). Ablehnen geht; beim Punkt-Duell kann man stattdessen einen Münzwurf vorschlagen, dem der Herausforderer zustimmen muss.
const DU_H = ['id', 'zeit', 'von', 'vonName', 'an', 'anName', 'ex', 'exName', 'art', 'v1', 'v2', 'status', 'sieger', 'extra', 'woche', 'fertig', 'sspAn', 'sspVon', 'runde'];
const SSP_ = { s: 'Schere', t: 'Stein', p: 'Papier' }, SSP_WIN_ = { s: 'p', t: 's', p: 't' };
function duSheet_() {
  const ss = sheet_().getParent(); let s = ss.getSheetByName('Duelle');
  if (!s) { s = ss.insertSheet('Duelle'); s.appendRow(DU_H); s.setFrozenRows(1); }
  else if (s.getLastColumn() < DU_H.length) s.getRange(1, 1, 1, DU_H.length).setValues([DU_H]);
  return s;
}
function duRows_(s) {
  const now = Date.now();
  return s.getDataRange().getValues().slice(1).map((r, i) => {
    const o = { row: i + 2 }; DU_H.forEach((h, j) => o[h] = r[j]);
    o.ms = o.zeit instanceof Date ? o.zeit.getTime() : (Date.parse(o.zeit) || 0);
    if (o.status === 'open' && now - o.ms > 864e5) o.status = 'expired';
    if (o.status === 'coin' && now - o.ms > 2 * 864e5) o.status = 'declined';
    if (o.status === 'ssp' && now - o.ms > 3 * 864e5) o.status = 'declined';
    return o;
  });
}
function duSet_(s, o, vals) { Object.keys(vals).forEach(k => s.getRange(o.row, DU_H.indexOf(k) + 1).setValue(vals[k])); }
function duPoint_(sh, rows, key, id, t, n) {
  const r = rows.find(x => x.o.nameKey === key); if (!r) return;
  const d = parseData_(r.o); d.ch['du:' + id] = { p: 1, at: t, n: String(n).slice(0, 40) };
  sh.getRange(r.row, HEAD.indexOf('data') + 1).setValue(JSON.stringify(d));
  sh.getRange(r.row, HEAD.indexOf('updated') + 1).setValue(new Date());
}
function duel_(r, rows, sh, q) {
  const t = today_(), s = duSheet_(), D = duRows_(s), me = r.o, mk = me.nameKey;
  const pair = (x, a, b) => (x.von === a && x.an === b) || (x.von === b && x.an === a);
  if (q.do === 'new') {
    const to = String(q.to || '').trim().toLowerCase(), o = rows.find(x => x.o.nameKey === to);
    if (!o || to === mk) return { ok: false, err: 'Gegner nicht gefunden' };
    const ex = String(q.ex || '').slice(0, 20), exn = String(q.exn || '').slice(0, 40), art = ['h', 'r', 'st'].indexOf(q.art) >= 0 ? q.art : 'h', v = Math.round(+q.v || 0);
    if (!/^[a-z0-9]+$/.test(ex) || !(v > 0 && v < 100000)) return { ok: false, err: 'Ungültiger Wert' };
    if (D.some(x => x.status === 'open' && pair(x, mk, to))) return { ok: false, err: 'Zwischen euch läuft schon ein Duell' };
    if (D.filter(x => x.status === 'open' && x.von === mk).length >= 3) return { ok: false, err: 'Du hast schon 3 offene Duelle' };
    const wk = 'w' + weekKey_(t), pa = compute_(me, t).pts, pb = compute_(o.o, t).pts;
    const tie = pa === pb && !D.some(x => +x.extra && x.woche === wk && x.status !== 'expired' && pair(x, mk, to));
    const id = Utilities.getUuid().slice(0, 8);
    s.appendRow([id, new Date(), mk, me.name, to, o.o.name, ex, exn, art, v, '', 'open', '', tie ? 1 : 0, wk, '']);
    return { ok: true, id: id, tie: tie };
  }
  const d = D.find(x => String(x.id) === String(q.id || ''));
  if (!d) return { ok: false, err: 'Duell nicht gefunden' };
  if (q.do === 'answer') {
    if (d.an !== mk) return { ok: false, err: 'Das Duell ist nicht für dich' };
    if (d.status !== 'open') return { ok: false, err: d.status === 'expired' ? 'Zu spät – das Duell ist abgelaufen' : 'Das Duell ist schon entschieden' };
    const v = Math.round(+q.v || 0); if (!(v >= 0 && v < 100000)) return { ok: false, err: 'Ungültiger Wert' };
    const w = v > +d.v1 ? mk : v < +d.v1 ? d.von : '', wn = w === mk ? me.name : w === d.von ? d.vonName : '';
    duSet_(s, d, { v2: v, status: 'done', sieger: wn, fertig: new Date() });
    if (w && +d.extra) duPoint_(sh, rows, w, d.id, t, 'Duell-Extrapunkt (' + d.exName + ')');
    return { ok: true, sieger: wn, v1: +d.v1, v2: v, extra: !!(+d.extra) };
  }
  if (q.do === 'decline') {
    if (d.an !== mk || d.status !== 'open') return { ok: false, err: 'Geht nicht mehr' };
    const coin = !!q.coin && !!(+d.extra), ssp = !coin && !!(+d.extra) && !!SSP_[q.ssp];
    duSet_(s, d, ssp ? { status: 'ssp', sspAn: q.ssp, sspVon: '', runde: 1, fertig: new Date() } : { status: coin ? 'coin' : 'declined', fertig: new Date() });
    return { ok: true, coin: coin, ssp: ssp };
  }
  if (q.do === 'ssp') {
    const isV = d.von === mk, isA = d.an === mk;
    if ((!isV && !isA) || d.status !== 'ssp') return { ok: false, err: 'Geht nicht mehr' };
    if (isV && !q.ok) { duSet_(s, d, { status: 'declined' }); return { ok: true }; }
    if (!SSP_[q.h]) return { ok: false, err: 'Schere, Stein oder Papier wählen' };
    if ((isV && d.sspVon) || (isA && d.sspAn)) return { ok: false, err: 'Du hast schon gewählt – warte auf den anderen' };
    const a = isA ? q.h : String(d.sspAn), v = isV ? q.h : String(d.sspVon);
    if (!a || !v) { duSet_(s, d, isV ? { sspVon: q.h } : { sspAn: q.h }); return { ok: true, wait: true }; }
    if (a === v && (+d.runde || 1) >= 2) {
      const cw = Math.random() < 0.5 ? d.von : d.an, cwn = cw === d.von ? d.vonName : d.anName;
      duSet_(s, d, { sspAn: a, sspVon: v, status: 'sspcoin', sieger: cwn, fertig: new Date() });
      duPoint_(sh, rows, cw, d.id, t, 'Münzwurf-Extrapunkt (nach 2× SSP)');
      return { ok: true, draw: true, coin: true, h: a, sieger: cwn };
    }
    if (a === v) { duSet_(s, d, { sspAn: '', sspVon: '', runde: (+d.runde || 1) + 1 }); return { ok: true, draw: true, h: a }; }
    const w = SSP_WIN_[v] === a ? d.von : d.an, wn = w === d.von ? d.vonName : d.anName;
    duSet_(s, d, { sspAn: a, sspVon: v, status: 'sspdone', sieger: wn, fertig: new Date() });
    duPoint_(sh, rows, w, d.id, t, 'Schere-Stein-Papier-Extrapunkt');
    return { ok: true, sieger: wn, a: a, v: v };
  }
  if (q.do === 'coin') {
    if (d.von !== mk || d.status !== 'coin') return { ok: false, err: 'Geht nicht mehr' };
    if (!q.ok) { duSet_(s, d, { status: 'declined' }); return { ok: true }; }
    const w = Math.random() < 0.5 ? d.von : d.an, wn = w === d.von ? d.vonName : d.anName;
    duSet_(s, d, { status: 'coindone', sieger: wn, fertig: new Date() });
    duPoint_(sh, rows, w, d.id, t, 'Münzwurf-Extrapunkt');
    return { ok: true, sieger: wn };
  }
  return { ok: false, err: 'unbekannt' };
}
function duelList_() {
  const s = sheet_().getParent().getSheetByName('Duelle'); if (!s) return [];
  return duRows_(s).slice(-120).map(x => ({ id: String(x.id), z: x.ms, von: String(x.vonName), an: String(x.anName), ex: String(x.ex), exn: String(x.exName), art: String(x.art), v1: +x.v1, v2: x.v2 === '' ? null : +x.v2, st: String(x.status), w: String(x.sieger || ''), tie: !!(+x.extra), sa: /^ssp(done|coin)$/.test(x.status) ? String(x.sspAn) : !!x.sspAn, sv: /^ssp(done|coin)$/.test(x.status) ? String(x.sspVon) : !!x.sspVon, rd: +x.runde || 0 }));
}

// ---------- Reaktionen & Kommentare auf die Ansage vom Spitzenreiter (Blatt "Reaktionen") ----------
const RX_EMO = ['👍', '🔥', '😂', '💪', '💀', '👑'], ADMIN_KEY = 'machermax';
function rxSheet_() {
  const ss = sheet_().getParent(); let s = ss.getSheetByName('Reaktionen');
  if (!s) { s = ss.insertSheet('Reaktionen'); s.appendRow(['id', 'zeit', 'an', 'ansage', 'von', 'vonKey', 'art', 'text']); s.setFrozenRows(1); }
  return s;
}
function react_(me, rows, q) {
  const to = String(q.to || '').trim().toLowerCase(), ts = String(q.ts || ''), tk = 'ts:' + ts;
  const own = rows.find(r => r.o.nameKey === to); if (!own) return { ok: false, err: 'Ansage nicht gefunden' };
  const d = parseData_(own.o); if (!d.ch.msg || d.ch.msg.ts !== ts) return { ok: false, err: 'Die Ansage ist nicht mehr aktuell' };
  const c = CacheService.getScriptCache(), ck = 'rx_' + me.nameKey, n = +(c.get(ck) || 0);
  if (n >= 80) return { ok: false, err: 'Heute schon sehr viel reagiert – morgen wieder 🙂' };
  c.put(ck, String(n + 1), 21600);
  const sh = rxSheet_(), v = sh.getDataRange().getValues();
  if (q.kind === 'e') {
    const e = String(q.e || ''); if (RX_EMO.indexOf(e) < 0) return { ok: false, err: 'Emoji unbekannt' };
    for (let i = v.length - 1; i >= 1; i--) if (v[i][2] === to && String(v[i][3]) === tk && v[i][5] === me.nameKey && v[i][6] === 'e' && v[i][7] === e) { sh.deleteRow(i + 1); return { ok: true, off: true }; }
    sh.appendRow([Utilities.getUuid(), new Date(), to, tk, me.name, me.nameKey, 'e', e]); return { ok: true };
  }
  if (q.kind === 'c') {
    let t = String(q.t || '').replace(/\s+/g, ' ').trim().slice(0, 140); if (!t) return { ok: false, err: 'Bitte etwas schreiben' };
    if (/^[=+\-@]/.test(t)) t = '\u200b' + t;
    sh.appendRow([Utilities.getUuid(), new Date(), to, tk, me.name, me.nameKey, 'c', t]); return { ok: true };
  }
  if (q.kind === 'd') {
    const id = String(q.id || '');
    for (let i = 1; i < v.length; i++) if (v[i][0] === id && (v[i][5] === me.nameKey || me.nameKey === ADMIN_KEY)) { sh.deleteRow(i + 1); return { ok: true }; }
    return { ok: false, err: 'Nicht gefunden' };
  }
  return { ok: false, err: 'unbekannt' };
}
function rxList_(rows) {
  const s = sheet_().getParent().getSheetByName('Reaktionen'); if (!s) return [];
  const cur = {};
  rows.forEach(r => { let d = {}; try { d = JSON.parse(r.o.data || '{}'); } catch (e) {} if (d.ch && d.ch.msg && d.ch.msg.ts) cur[r.o.nameKey] = { tk: 'ts:' + d.ch.msg.ts, name: r.o.name }; });
  return s.getDataRange().getValues().slice(1).filter(x => cur[x[2]] && cur[x[2]].tk === String(x[3])).slice(-300)
    .map(x => ({ id: String(x[0]), o: cur[x[2]].name, von: String(x[4]), a: String(x[6]), t: String(x[7]).replace(/^\u200b/, ''), z: x[1] instanceof Date ? x[1].toISOString() : String(x[1]) }));
}

// Feedback-Button & Umfrage: landet in der Tabelle (Blatt "Feedback") und als Mail bei Max (Antworten gehen direkt an die Person)
const FB_KIND = { frage: '❓ Frage', idee: '💡 Idee', problem: '🐞 Problem', lob: '👍 Lob', umfrage: '📝 Umfrage Testphase' };
function feedback_(o, q) {
  const kind = FB_KIND[q.kind] ? q.kind : 'idee';
  const text = String(q.text || '').trim().slice(0, 2000);
  const s = (q.survey && typeof q.survey === 'object') ? q.survey : null;
  const lst = v => (Array.isArray(v) ? v : []).slice(0, 40).map(x => String(x).slice(0, 60));
  const sv = s ? { note: Math.max(0, Math.min(5, Math.round(+s.note || 0))), geschafft: String(s.geschafft || '').slice(0, 30), umfang: String(s.umfang || '').slice(0, 30), schwer: lst(s.schwer), leicht: lst(s.leicht), app: String(s.app || '').slice(0, 1000) } : null;
  if (!text && !sv) return { ok: false, err: 'Bitte etwas schreiben' };
  const c = CacheService.getScriptCache(), ck = 'fb_' + o.nameKey, n = +(c.get(ck) || 0);
  if (n >= 15) return { ok: false, err: 'Heute schon sehr viel Feedback – morgen wieder 🙂' };
  c.put(ck, String(n + 1), 21600);
  const ss = sheet_().getParent();
  let fs = ss.getSheetByName('Feedback');
  if (!fs) { fs = ss.insertSheet('Feedback'); fs.appendRow(['Zeit', 'Name', 'E-Mail', 'Art', 'Text', 'Note (1–5)', 'Workouts geschafft', 'Umfang', 'Zu schwer', 'Zu leicht', 'App/Anmerkungen']); fs.setFrozenRows(1); }
  fs.appendRow([new Date(), o.name, o.email || '', FB_KIND[kind], text, sv ? sv.note || '' : '', sv ? sv.geschafft : '', sv ? sv.umfang : '', sv ? sv.schwer.join(', ') : '', sv ? sv.leicht.join(', ') : '', sv ? sv.app : '']);
  let body = FB_KIND[kind] + ' von ' + o.name + (o.email ? ' (' + o.email + ')' : ' (keine E-Mail hinterlegt)') + '\n\n';
  if (sv) body += 'Note für die App: ' + (sv.note ? '⭐'.repeat(sv.note) + ' (' + sv.note + '/5)' : '–') + '\nWorkouts geschafft: ' + (sv.geschafft || '–') + '\nUmfang: ' + (sv.umfang || '–') +
    '\nZu schwer: ' + (sv.schwer.join(', ') || '–') + '\nZu leicht: ' + (sv.leicht.join(', ') || '–') + '\nApp / Anmerkungen: ' + (sv.app || '–') + '\n\n';
  if (text) body += text + '\n\n';
  body += (o.email ? 'Einfach auf diese Mail antworten – die Antwort geht direkt an ' + o.name + '.\n' : '') + 'Alles gesammelt im Blatt „Feedback“: ' + ss.getUrl();
  const m = { to: OWNER, subject: '💬 CYF-Feedback: ' + FB_KIND[kind] + ' von ' + o.name, body: body, name: 'CYF Feedback' };
  if (o.email) m.replyTo = o.email;
  try { MailApp.sendEmail(m); } catch (e) { Logger.log('Feedback-Mail fehlgeschlagen: ' + e); }
  return { ok: true };
}

// Einmalige Info an alle: neue Adresse der App, Verknüpfung neu anlegen
const NEW_LINK = 'https://challenge-your-friends.github.io/';
function linkNotice() {
  const { rows } = rows_();
  rows.forEach(r => {
    const o = r.o; if (!o.email || !o.name) return;
    const body = 'Hey ' + o.name + ',\n\nkleine Korrektur: Deine Verknüpfung zeigt noch auf die alte Adresse. CYF läuft ab sofort hier:\n👉 ' + NEW_LINK + (o.token ? '#t=' + o.token : '') + '\n\n' +
      'Damit bist du direkt angemeldet (falls nicht: Name + PIN wie bisher). Danach:\n' +
      '1. Android/Chrome: Menü ⋮ → „Zum Startbildschirm hinzufügen“. iPhone/Safari: Teilen → „Zum Home-Bildschirm“.\n' +
      '2. Die alte Verknüpfung löschen.\nDeine Punkte und dein Konto bleiben erhalten.\n\n' +
      'Kurze Bitte: Sag mir, ob du über den Link reinkommst – einfach auf diese Mail antworten oder in der App unter „Mehr“ → „💬 Feedback & Fragen“.\n\n' +
      'Und: Mach diese Woche bitte 1–2 Test-Workouts. So sehen wir vor dem Start am 1.12., ob die Intensität für alle passt: zu schwer, zu leicht oder genau richtig? Auch das gern per Feedback.\n\n' +
      'Ab 1.12. zählt\'s – zieh durch! 💪\nMax';
    MailApp.sendEmail({ to: o.email, subject: '📲 CYF: Bitte neuen Link nutzen – und 1–2 Test-Workouts diese Woche', body: body, name: 'CYF Challenge' });
  });
  archiveCopies_();
}
// einmalig: alte Kopien der letzten 14 Tage aufräumen
function aufraeumen() { archiveCopies_(14); }
// Umzug vorgezogen: Mail jetzt senden und den geplanten Termin am 30.11. entfernen
function umzugJetzt() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'linkNotice').forEach(t => ScriptApp.deleteTrigger(t));
  linkNotice();
}
// einmal im Editor ausführen: plant linkNotice für Mo 30.11.2026, 9 Uhr
function planLinkNotice() {
  ScriptApp.newTrigger('linkNotice').timeBased().at(new Date('2026-11-30T09:00:00+01:00')).create();
}

// Test: zeigt die Mail im Ausführungsprotokoll, ohne etwas zu senden
function testMailVorschau() {
  const t = today_();
  const rank = ranking_(rows_().rows, t);
  Logger.log(rank.map((r, i) => (i + 1) + '. ' + r.name + ' ' + r.pts + ' Pkt, Serie ' + r.streak).join('\n') || 'noch keine Benutzer');
}
