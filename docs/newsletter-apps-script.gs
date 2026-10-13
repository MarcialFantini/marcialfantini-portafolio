/**
 * Newsletter signup endpoint (Google Apps Script bound to a Google Sheet).
 *
 * Setup:
 * 1. Create a Google Sheet and rename the first tab to "Suscriptores".
 *    Put these headers in row 1: Fecha | Email | Origen
 * 2. Extensions > Apps Script. Paste this file and save.
 * 3. Deploy > New deployment > type "Web app".
 *    Execute as: Me. Who has access: Anyone.
 * 4. Copy the web app URL (ends in /exec) into src/data/site.json
 *    as "newsletterEndpoint".
 * 5. After changing this code, create a NEW deployment version
 *    (Deploy > Manage deployments > Edit > New version).
 */
const SHEET_NAME = "Suscriptores";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || "{}");
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "").slice(0, 200);

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return json({ ok: false, error: "invalid_email" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return json({ ok: false, error: "missing_sheet" });

    const last = sheet.getLastRow();
    if (last > 1) {
      const existing = sheet.getRange(2, 2, last - 1, 1).getValues().flat();
      if (existing.indexOf(email) !== -1) return json({ ok: true, duplicate: true });
    }

    sheet.appendRow([new Date(), email, source]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: "bad_request" });
  } finally {
    lock.releaseLock();
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
