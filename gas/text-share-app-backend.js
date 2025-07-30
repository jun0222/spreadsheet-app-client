// === 設定 ===
const SHEET_ID = "1T2Lfm0yd_6pJ1drxLr2k_T5hzGO-pB-KbAmadk8m_Tg";
const SHEET_NAME = "posts";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const text = data.text;

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([text, new Date()]);

  return ContentService.createTextOutput(
    JSON.stringify({ result: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

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
