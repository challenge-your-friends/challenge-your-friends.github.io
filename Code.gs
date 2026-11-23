/**
 * Workout-Coach – Backend (Google Apps Script)
 * Speichert Benutzer + Fortschritt in einer Google-Tabelle und
 * schickt Erinnerungs-Mails (Mo–Sa) – jede/r wählt in der App: keine, 1 (18 Uhr) oder 2 (7 + 18 Uhr).
 *
 * Einrichtung: einmal die Funktion setup() ausführen, dann
 * "Bereitstellen > Neue Bereitstellung > Web-App", Ausführen als: Ich,
 * Zugriff: Jeder. Die Web-App-URL in index.html bei API_URL eintragen.
 */
// ab 30.11.2026 zeigen alle Mails auf die neue Adresse
const APP_LINK = Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd') >= '2026-11-30' ? 'https://challenge-your-friends.github.io/' : 'https://bobby983983.github.io/workout-coach/';
const PLAN = {1:'Tag A', 2:'Kurztag', 3:'Tag B', 4:'Kurztag', 5:'Tag A', 6:'Kurztag'};
// A und B wechseln wöchentlich (Woche ab 23.11.2026: A-B-A, danach B-A-B usw.)
function planName_(t) { const n = PLAN[dow_(t)]; if (!n || n === 'Kurztag') return n; const wk = Math.round((new Date(weekKey_(t) + 'T12:00:00Z') - new Date('2026-11-23T12:00:00Z')) / 6048e5); return (((wk % 2) + 2) % 2 === 1) ? (n === 'Tag A' ? 'Tag B' : 'Tag A') : n; }
const CH_START = '2026-12-01', CH_END = '2026-12-31';
// Schummel-Schutz: Workouts zählen nur mit Start-/End-Meldung und Mindestdauer
const MIN_SEC = { A: 810, B: 780, K: 360, C: 100 };
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
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const q = JSON.parse(e.postData.contents || '{}');
    const { sh, rows } = rows_();
    const byToken = t => rows.find(r => t && r.o.token === t);
    const key = String(q.name || '').trim().toLowerCase();

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
      if (cd.msg && cd.msg.t) cur.ch.msg = { p: 0, t: String(cd.msg.t).slice(0, 140), ts: String(cd.msg.ts || new Date().toISOString()).slice(0, 30) };
      else delete cur.ch.msg;
      Object.keys(cd).forEach(k => { const v = cd[k]; if (k !== 'msg' && v && v.failed && v.at === t) cur.ch[k] = { p: 0, n: String((cur.ch[k] || {}).n || v.n || '').slice(0, 40), at: t, failed: true }; });
      const clean = JSON.stringify(Object.assign({ days: cur.days, ms: cur.ms, ch: cur.ch, bx: cur.bx || 0 }, cur.mp === 0 || cur.mp === 1 ? { mp: cur.mp } : {}));
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
        return { name: r.o.name, start: dstr_(r.o.start), days: d.days || {}, ch: d.ch || {}, bx: +d.bx || 0 };
      }) });
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
  let pts = 0, streak = 0, total = 0, weekRun = 0;
  for (let k = start; k <= t; k = addDays_(k, 1)) {
    const d = days[k], rest = dow_(k) === 0, past = k < t;
    let st = 'open';
    if (d && d.done) { total++; const ez = d.e ? 1 : 0; pts += rest ? 1 : (d.at === k) ? (3 - ez) * (xmas_(k) ? 2 : 1) : 1 - ez; st = 'done'; if (!rest) { streak++; weekRun++; } }
    else if (rest) st = 'rest';
    else if (past) { pts -= 3; streak = 0; weekRun = 0; st = 'miss'; }
    if (dow_(k) === 6) { if (weekRun >= 6 && st !== 'open') pts += 3; weekRun = 0; }
  }
  Object.keys(ch).forEach(x => { const c = ch[x]; if (c && (c.at || '') >= start && (c.at || '') <= CH_END) pts += (c.p || 0) * (x.slice(0, 2) === 'd:' && xmas_(c.at) ? 2 : 1); });
  return { pts, streak, total, bx: +data.bx || 0, mp: (data.mp === 0 || data.mp === 1) ? data.mp : 2, done: !!(days[tt] && days[tt].done), days };
}

function ranking_(rows, t) {
  return rows.filter(r => r.o.name).map(r => Object.assign({ row: r }, compute_(r.o, t), { name: r.o.name }))
    .sort((a, b) => b.pts - a.pts || b.bx - a.bx || b.streak - a.streak);
}

function dailyReminder() {
  const t = today_();
  const dow = dow_(t);
  if (dow === 0 || t > CH_END) return; // Sonntag Ruhetag / Challenge vorbei
  const y = addDays_(t, -1);
  const { rows } = rows_();
  const rank = ranking_(rows, t);
  const medal = ['🥇', '🥈', '🥉'];
  rank.forEach((me, i) => {
    const o = me.row.o;
    if (!o.email || me.mp < 1 || !o.start || t < o.start || me.done) return;
    const missedY = dow_(y) !== 0 && y >= o.start && !(me.days[y] && me.days[y].done);
    let body = 'Hey ' + o.name + ',\n\n' +
      'dein Workout für heute (' + planName_(t) + ') ist noch offen! 😢\n' +
      (t < CH_START ? '🧪 Testphase – ab 1.12. zählt\'s richtig.\n' : 'Ausreden gibt\'s keine – sonst morgen −3 Punkte.\n');
    if (missedY) body += '\nGestern hast du auch verpasst. Heute nachholen holt 4 Punkte zurück (2 Einheiten machen).\n';
    body += '\n🏆 Ranking\n';
    rank.slice(0, 3).forEach((r, j) => { body += medal[j] + ' ' + r.name + ' – ' + r.pts + ' Punkte (🔥 ' + r.streak + ')' + (r.done ? ' ✓ heute' : '') + '\n'; });
    body += '\nDu: Platz ' + (i + 1) + ' von ' + rank.length + ' mit ' + me.pts + ' Punkten.\n';
    if (i > 0) body += 'Bis Platz ' + i + ' fehlen dir ' + (rank[i - 1].pts - me.pts + 1) + ' Punkte.\n';
    body += '\nZum Coach: ' + APP_LINK + '\n\nZieh durch! 💪';
    MailApp.sendEmail({ to: o.email, subject: '😢 ' + o.name + ', vergiss nicht dein Workout!', body: body, name: 'Workout-Coach' });
  });
  archiveCopies_();
}

function weeklySummary() {
  const t = today_();
  if (t > addDays_(CH_END, 1)) return;
  const { rows } = rows_();
  const rank = ranking_(rows, t);
  const medal = ['🥇', '🥈', '🥉'];
  const mon = addDays_(t, -6);
  let table = '';
  rank.forEach((r, j) => { table += (medal[j] || (j + 1) + '.') + ' ' + r.name + ' – ' + r.pts + ' Punkte (🔥 ' + r.streak + ', ' + r.total + ' Workouts)\n'; });
  rank.forEach((me, i) => {
    const o = me.row.o;
    if (!o.email || me.mp === 0) return;
    let week = 0; for (let k = mon; k <= t; k = addDays_(k, 1)) if (me.days[k] && me.days[k].done) week++;
    let body = 'Hey ' + o.name + ',\n\nhier deine Wochenübersicht 💪\n\n' +
      (t < CH_START ? '🧪 Testphase – ab 1.12. startet die Challenge, dann beginnen alle bei 0 Punkten.\n\n' : '') +
      'Diese Woche: ' + week + ' Workouts\nDu: Platz ' + (i + 1) + ' von ' + rank.length + ' mit ' + me.pts + ' Punkten, Serie 🔥 ' + me.streak + '\n' +
      (i > 0 ? 'Bis Platz ' + i + ' fehlen dir ' + (rank[i - 1].pts - me.pts + 1) + ' Punkte.\n' : 'Du führst! Verteidige Platz 1. 🏆\n') +
      '\n🏆 Gesamt-Ranking\n' + table + '\nNeue Woche, neue Chance: ' + APP_LINK + '\n\nZieh durch! 💪';
    MailApp.sendEmail({ to: o.email, subject: '🏆 Workout-Challenge: deine Wochenübersicht', body: body, name: 'Workout-Coach' });
  });
  archiveCopies_();
}

function morningReminder() {
  const t = today_();
  const dow = dow_(t);
  if (dow === 0 || t > CH_END) return;
  const { rows } = rows_();
  const rank = ranking_(rows, t);
  rank.forEach((me, i) => {
    const o = me.row.o;
    if (!o.email || me.mp < 2 || !o.start || t < o.start) return;
    const body = 'Guten Morgen ' + o.name + '! ☀️\n\nDenk an dein Workout heute: ' + planName_(t) + ' (max. 15 Minuten).\n' +
      'Aktuell: Platz ' + (i + 1) + ' von ' + rank.length + ' mit ' + me.pts + ' Punkten, Serie 🔥 ' + me.streak + '.\n' +
      (t < CH_START ? '🧪 Testphase – ab 1.12. zählt\'s richtig.\n' : '') +
      '\nJetzt starten: ' + APP_LINK + '\n\nZieh durch! 💪';
    MailApp.sendEmail({ to: o.email, subject: '☀️ Denk an dein Workout heute, ' + o.name + '!', body: body, name: 'Workout-Coach' });
  });
  archiveCopies_();
}

// Kopien der Mails an andere landen (weil über Max' Gmail verschickt) auch in seinem Posteingang – die werden archiviert.
function normMail_(s) {
  const m = String(s || '').match(/<([^>]+)>/); let a = (m ? m[1] : String(s || '')).trim().toLowerCase();
  const p = a.split('@'); if (p.length !== 2) return a;
  let dom = p[1] === 'googlemail.com' ? 'gmail.com' : p[1], loc = p[0];
  if (dom === 'gmail.com') loc = loc.split('+')[0].replace(/\./g, '');
  return loc + '@' + dom;
}
function archiveCopies_() {
  try {
    Utilities.sleep(8000);
    const me = normMail_(Session.getEffectiveUser().getEmail());
    GmailApp.search('in:inbox from:me subject:(Workout OR CYF) newer_than:2d', 0, 100).forEach(t => {
      const forOthers = t.getMessages().every(m => String(m.getTo()).split(',').every(x => normMail_(x) !== me));
      if (forOthers) t.moveToArchive();
    });
  } catch (e) { Logger.log('Archivieren fehlgeschlagen: ' + e); }
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
  const m = { to: Session.getEffectiveUser().getEmail(), subject: '💬 CYF-Feedback: ' + FB_KIND[kind] + ' von ' + o.name, body: body, name: 'CYF Feedback' };
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
    const body = 'Hey ' + o.name + ',\n\nkurze Info vor dem Start der Challenge am 1.12.: CYF hat eine neue Adresse 🎉\n\n👉 ' + NEW_LINK + (o.token ? '#t=' + o.token : '') + '\n\n' +
      'Bitte leg die Verknüpfung auf deinem Startbildschirm einmal neu an:\n' +
      '1. Den Link oben öffnen – damit bist du direkt angemeldet (falls nicht: Name + PIN wie bisher).\n' +
      '2. Android/Chrome: Menü ⋮ → „Zum Startbildschirm hinzufügen“. iPhone/Safari: Teilen-Symbol → „Zum Home-Bildschirm“.\n' +
      '3. Die alte Verknüpfung kannst du löschen.\n\nDeine Punkte und dein Konto bleiben erhalten.\n\nAb morgen zählt\'s – zieh durch! 💪';
    MailApp.sendEmail({ to: o.email, subject: '📲 CYF: neue Adresse – bitte Verknüpfung neu anlegen', body: body, name: 'CYF Challenge' });
  });
  archiveCopies_();
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
