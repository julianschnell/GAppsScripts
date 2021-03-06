function getMessage()
{
  var filter = "newer_than:1d AND from:kontowecker.de AND subject:Ihr Kontowecker hat geklingelt!";
  var thread = GmailApp.search(filter,0,1);
  try {
    var message = GmailApp.getMessagesForThreads(thread)[0][0];
    return message;
  } catch (e) {
    console.error("Keine neue Mail verfügbar!" + e)
    var message = 1
    return message;
  }
}

function parseMessageData(message)
{
  var text = message.getPlainBody();
  var amount = text.match(/(\d{1,}.\d{3},\d{2}|\d{3},\d{2})/);
  return amount;
}

function saveDataToSheet(balance)
{
  var url = "INSERT URL TO YOUR GOOGLE SPREADSHEET HERE!"
  var sheetname = "INSERT NAME OF THE SHEET! -> Default: Sheet1"
  var spreadsheet = SpreadsheetApp.openByUrl(url);
  var sheet = spreadsheet.getSheetByName(sheetname);
  var date = Utilities.formatDate(new Date(), "GMT+1", "dd.MM.yyyy");
  sheet.getRange('D6').setValue(balance)
  sheet.getRange('A6').setValue(date)
}

function processEmail()
{
  var message = getMessage();
  if (message == 1) {
    console.log("Kein neuer Kontostand verfügbar!")
  }
  else {
    var value = parseMessageData(message);
    saveDataToSheet(value);
    GmailApp.moveMessageToTrash(message);
  }
}

function doGet() {
  processEmail()
}
