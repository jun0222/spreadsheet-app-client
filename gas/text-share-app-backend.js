// === 設定 ===
const SHEET_ID = "シートのIDを入れる";
const SHEET_NAME = "シート名を入れる";

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
  const values = sheet.getDataRange().getValues();
  const texts = values.slice(1).map((row) => row[0]); // 1行目を除外して1列目（投稿）だけ抽出

  return ContentService.createTextOutput(JSON.stringify(texts)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(
    ContentService.MimeType.JSON
  );
}
