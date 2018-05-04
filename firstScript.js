var Sdk = window.Sdk || {};

(function(){
// Define some global variables
var myUniqueId = "_myUniqueId"; // Define an ID for the notification
var currentUserName = Xrm.Utility.getGlobalContext().userSettings.userName; // get current user name
var message = currentUserName + ": Your JavaScript code in action!";

// Code to run in the form OnLoad event
this.formOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();

    // display the form level notification as an INFO
    formContext.ui.setFormNotification(message, "INFO", myUniqueId);

    // Wait for 5 seconds before clearing the notification
    window.setTimeout(function () { formContext.ui.clearFormNotification(myUniqueId); }, 5000);
}



// Code to run in the attribute OnChange event 
this.attributeOnChange = function (executionContext) {
    var formContext = executionContext.getFormContext();

    // Automatically set some field values if the account name contains "Contoso"
    var accountName = formContext.getAttribute("name").getValue();
    if (accountName.toLowerCase().search("contoso") != -1) {
        formContext.getAttribute("websiteurl").setValue("http://www.contoso.com");
        formContext.getAttribute("telephone1").setValue("425-555-0100");
        formContext.getAttribute("description").setValue("Website URL, Phone and Description set using custom script.");
    }
}
// Code to run in the form OnSave event 
this.formOnSave = function () {
    // Display an alert dialog
    Xrm.Navigation.openAlertDialog({ text: "Record saved." });
}
// custom functions
// Code to run in the form OnLoad event
this.cFunction1 = function (executionContext) {
    debugger;
    var formContext = executionContext.getFormContext();
    // display the form level notification as an INFO
    formContext.ui.setFormNotification("Hello, baby, hello", "INFO", "GEN");

    //Xrm.Page.ui.setFormNotification("I clicked on a new button!!!", "INFO", "GEN");

    // Wait for 5 seconds before clearing the notification
    window.setTimeout(function () { formContext.ui.clearFormNotification("GEN"); }, 5000);
}
this.cFunction2 = function () {
    debugger;
    //var formContext = executionContext.getFormContext();
    // display the form level notification as an INFO
    //formContext.ui.setFormNotification("Hello, baby, hello", "INFO", myUniqueId);

    Xrm.Page.ui.setFormNotification("I clicked on a new button!!!", "INFO", "GEN");

    // Wait for 5 seconds before clearing the notification
    window.setTimeout(function () { Xrm.Page.ui.clearFormNotification("GEN"); }, 5000);
}





}).call(Sdk);