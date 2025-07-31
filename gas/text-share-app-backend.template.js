// === 設定 ===
const GAS_SHEET_ID = "{{GAS_SHEET_ID}}";
const GAS_SHEET_NAME = "{{GAS_SHEET_NAME}}";
const GAS_ALLOWED_UID = "{{GAS_ALLOWED_UID}}";
const FIREBASE_TOKEN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={{GAS_FIREBASE_API_KEY}}`;

function getUidFromIdToken(idToken) {
  try {
    const response = UrlFetchApp.fetch(FIREBASE_TOKEN_URL, {
      method: "post",
      contentType: "text/plain;charset=utf-8",
      payload: JSON.stringify({ idToken }),
    });
    const json = JSON.parse(response.getContentText());
    return json.users?.[0]?.localId || null;
  } catch (err) {
    return null;
  }
}

function doPost(e) {
  const idToken = e?.parameter?.idToken || "";
  const uid = getUidFromIdToken(idToken);
  if (uid !== GAS_ALLOWED_UID) {
    return ContentService.createTextOutput("unauthorized");
  }

  const data = JSON.parse(e.postData.contents);
  const text = data.text;

  const sheet =
    SpreadsheetApp.openById(GAS_SHEET_ID).getSheetByName(GAS_SHEET_NAME);
  sheet.appendRow([text, new Date()]);

  return ContentService.createTextOutput(
    JSON.stringify({ result: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet =
    SpreadsheetApp.openById(GAS_SHEET_ID).getSheetByName(GAS_SHEET_NAME);

  const lastRow = sheet.getLastRow();
  const limit = e?.parameter?.limit ? parseInt(e.parameter.limit, 10) : 10;
  const safeLimit = Math.max(1, Math.min(lastRow - 1, limit)); // ヘッダー分除く

  // TODO: クエリパラメータで limit を指定できるようにする。現状はデフォルトの10件のみ取得
  const startRow = Math.max(2, lastRow - safeLimit + 1);
  const range = sheet.getRange(startRow, 1, safeLimit, 1);
  const values = range.getValues();
  const texts = values.map((row) => row[0]).reverse(); // 最新が先頭

  return ContentService.createTextOutput(JSON.stringify(texts)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(
    ContentService.MimeType.JSON
  );
}
