// Google Apps Script: stores newsletter subscribers in the bound Google Sheet.
// Setup: see README section "Newsletter (Google Sheets)".

const SHEET_NAME = "Suscriptores";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "").slice(0, 200);
    if (!EMAIL_RE.test(email)) return respond({ ok: false, error: "invalid_email" });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(["Fecha", "Email", "Origen"]);

      const last = sheet.getLastRow();
      const existing = last > 1 ? sheet.getRange(2, 2, last - 1, 1).getValues().flat() : [];
      if (existing.indexOf(email) === -1) {
        sheet.appendRow([new Date(), email, source]);
      }
    } finally {
      lock.releaseLock();
    }
    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: "bad_request" });
  }
}

function respond(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
