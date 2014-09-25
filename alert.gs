/* Subigya Nepal - Thelacunablog.com
 Checks for Adsense report every hour and sends SMS alert if the number of clicks are beyond a given threshold.
 Read about it here - http://www.thelacunablog.com/?p=6450
 Version 2.2. Last updated on Feb 19th, 2014.
 Changes made : Removed the part where it checked for adClientId.

Old Updates : 

Version 2.1. Last updated on August 16th, 2013.
Changes made : 
Removed Ad-clientID. So, no need to enter it anymore.
Made it compatible with Adsense Management API version 1.3.

Version 2.0. Last Updated on July 9th, 2013.*/

function generateReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Reports');
  var today = new Date();
  var todayString = Utilities.formatDate(today,'GMT-0800','yyyy-MM-dd');
  var startDate = todayString
      //Browser.inputBox("Enter a start date (format: 'yyyy-mm-dd')");
  var endDate = todayString
      //Browser.inputBox("Enter an end date (format: 'yyyy-mm-dd')");
  //var adClientId = ss.getSheetByName('Adsense').getRange("D11").getValue(); // << Enter your account ID here.
  var args = {
    'metric': ['PAGE_VIEWS', 'CLICKS', 'COST_PER_CLICK'], // << Which reports you would like to receive.
    'dimension': ['DATE']};
  var report = AdSense.Reports.generate(startDate, endDate, args).getRows();
  if (report != null)
  {
    for (var i=0; i<report.length; i++) {
      var row = report[i];
      sheet.getRange('A' + String(i+2)).setValue(row[0]);
      sheet.getRange('B' + String(i+2)).setValue(row[1]);
      sheet.getRange('C' + String(i+2)).setValue(row[2]);
      sheet.getRange('D' + String(i+2)).setValue(row[3]); // << If you add one new report above, you need to copy this line and change D to E, and row[3] to [4]
    }
  }
}


 function sendsmsreport() {
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var pageviews = ss.getSheetByName('Reports').getRange("B2").getValues().toString();
   var clicks = ss.getSheetByName('Reports').getRange("C2").getValues().toString();
   var cpc = ss.getSheetByName('Reports').getRange("D2").getValues().toString();  
   var check = ss.getSheetByName('Reports').getRange("E2").getValues().toString();
   var REPLACE = ss.getSheetByName('Adsense').getRange("D15").getValue();
   
   if ((clicks>=REPLACE)&&(check=="" || check == undefined || check == null))
   {    
     ss.getSheetByName('Reports').getRange('E2').setValue(clicks);
     var now = new Date().getTime();
     var cal = CalendarApp.getDefaultCalendar();
     var title = "ClickBomb! " + "PV:" + pageviews + " Clicks:" + clicks + " CPC:" + cpc; // << This is what gets sent on the SMS.
     //cal.createEvent(title, new Date("March 3, 2010 08:00:00"), new Date("March 3, 2010 09:00:00"), {description:desc,location:loc});
     cal.createEvent(title, new Date(now+60000), new Date(now+60000)).addSmsReminder(0);  
  }
 }

 function resetcheck() {
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var REPLACE = ss.getSheetByName('Adsense').getRange("D15").getValue();
   var clicks = ss.getSheetByName('Reports').getRange( "C2").getValues().toString();
   var check = ss.getSheetByName('Reports').getRange( "E2").getValues().toString();
   if ((clicks<REPLACE)&&(check>=REPLACE)) //check to make sure whether its a new day or not. Only one sms is sent each day, so this check is required.
   {
     ss.getSheetByName('Reports').getRange('E2').setValue("");     
  }
 }


