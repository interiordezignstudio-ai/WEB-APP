// Interior Dezign Studio — iPhone / iPad Shortcut helper (Google Apps Script)
// Runs in the studio Google account. Lets an iPhone Shortcut read the client list
// and record a payment without opening the app. The app imports the payment on its next sync.
// Setup: script.google.com → New project → paste this → Deploy → New deployment → Web app
//        (Execute as: Me, Who has access: Anyone) → copy the Web app URL into the app.

var FOLDER = 'Interior Dezign Studio OS';
var DATA = 'interior-dezign-studio-data.json';
var INBOX = 'quick-payments-inbox.json';

function filesNamed_(name) {
  var out = [];
  var folders = DriveApp.getFoldersByName(FOLDER);
  while (folders.hasNext()) {
    var it = folders.next().getFilesByName(name);
    while (it.hasNext()) out.push(it.next());
  }
  out.sort(function (a, b) { return b.getLastUpdated() - a.getLastUpdated(); });
  return out;
}
function appData_() {
  var f = filesNamed_(DATA);
  if (!f.length) throw 'the app data was not found in Google Drive (connect Drive in the app first)';
  return JSON.parse(f[0].getBlob().getDataAsString());
}
function text_(t) { return ContentService.createTextOutput(String(t)).setMimeType(ContentService.MimeType.TEXT); }
function checkKey_(d, k) { if (!d.quickKey || String(k || '') !== String(d.quickKey)) throw 'wrong key — copy the links again from the app'; }
function inr_(n) {
  var s = String(Math.round(n)), last3 = s.slice(-3), rest = s.slice(0, -3);
  return '₹' + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + last3;
}

// GET ?k=KEY&list=clients | vendors | test
function doGet(e) {
  try {
    var d = appData_();
    checkKey_(d, e.parameter.k);
    var list = e.parameter.list || 'clients';
    if (list === 'test') return text_('OK');
    if (list === 'vendors') {
      return text_((d.vendors || []).map(function (v) { return v.name; }).filter(String).sort().join('\n'));
    }
    var clients = (d.clients || []).slice().sort(function (a, b) {
      return ((b.status === 'Active') - (a.status === 'Active')) || String(a.name).localeCompare(String(b.name));
    }).map(function (c) { return c.name; }).filter(String);
    clients.push('Office / no project');
    return text_(clients.join('\n'));
  } catch (err) {
    return text_('Error: ' + err);
  }
}

// POST JSON { k, client, type: "Received" | "Paid out", amount, mode, note }
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var p = JSON.parse((e.postData && e.postData.contents) || '{}');
    var d = appData_();
    checkKey_(d, p.k || (e.parameter && e.parameter.k));
    var amount = Number(String(p.amount || '').replace(/[^\d.]/g, ''));
    if (!amount) return text_('Error: the amount is missing');
    var f = filesNamed_(INBOX);
    if (!f.length) return text_('Error: open the app once (Sync & Backup → iPhone Shortcut) to finish setup');
    var file = f[0], box = [];
    try { box = JSON.parse(file.getBlob().getDataAsString()) || []; } catch (x) { box = []; }
    var keepFrom = Date.now() - 120 * 86400000;
    box = box.filter(function (x) { return new Date(x.at).getTime() > keepFrom; });
    var entry = {
      id: 'qs' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
      at: new Date().toISOString(),
      client: String(p.client || ''),
      type: String(p.type || ''),
      amount: amount,
      mode: String(p.mode || ''),
      note: String(p.note || '')
    };
    box.push(entry);
    file.setContent(JSON.stringify(box));
    var received = /receiv/i.test(entry.type);
    return text_('✓ Saved ' + inr_(amount) + (received ? ' received from ' : ' paid out · ') + (entry.client || 'Office') + (entry.mode ? ' (' + entry.mode + ')' : '') + '. It appears in the app within a minute.');
  } catch (err) {
    return text_('Error: ' + err);
  } finally {
    lock.releaseLock();
  }
}
