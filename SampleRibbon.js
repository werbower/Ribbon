var SmplR = window.SmplR || {};

(function () {
    // Define some global variables
    var myUniqueId = "_myUniqueId"; // Define an ID for the notification
    var currentUserName = Xrm.Utility.getGlobalContext().userSettings.userName; // get current user name
    var message = currentUserName + ": Your JavaScript code in action!";

    this.createAppointment = function(executionContext){
        var contactObj = null;
        var formContext = executionContext.getFormContext();
        debugger;
        // create the contact object
        contactObj = new Object();
        
        
        //set the lookup value
        contactObj["regardingobjectid@odata.bind"] = "/contacts("+formContext.data.entity.getId()+")";
 
        Xrm.WebApi.createRecord("contact", contactObj).then(function (result) {
            //get the guid of created record
            var recordId = result.id;
 
            //below code is used to open the created record
            var windowOptions = {
                openInNewWindow: true
            };
            //check if XRM.Utility is not null
            if (Xrm.Utility != null) {
 
                //open the entity record
                Xrm.Utility.openEntityForm("contact", recordId, null, windowOptions);
            }
        })
      .fail(function (error) {
          //Xrm.Utility.alertDialog(error.message);
      });
    }

    // Code to run in the form OnLoad event
    this.formOnLoad = function (executionContext) {
        // debugger;
        // var formContext = executionContext.getFormContext();
        // formContext.data.entity.addOnSave(this.createAppointment);

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
    this.formOnSave = function (executionContext) {
        // Display an alert dialog
        //Xrm.Navigation.openAlertDialog({ text: "Record saved." });
        var formContext = executionContext.getFormContext();
        formContext.data.save().then(this.createAppointment(executionContext));
        
    }
    // custom functions
    this.cFunction1 = function (executionContext) {
        debugger;
        //load form context
        var formContext = executionContext.getFormContext();
        //load customer synch name
        var emptyCustomerName = "empty customer sn";
        var customerName = formContext.getAttribute("new_customersyncname").getValue() || emptyCustomerName;
        customerName = String(customerName).trim();


        // display the form level notification as an INFO
        formContext.ui.setFormNotification("I SEE: " + customerName, "INFO", "cFunction1");
        // Wait for 5 seconds before clearing the notification
        window.setTimeout(function () { formContext.ui.clearFormNotification("cFunction1"); }, 10000);

        if (customerName === emptyCustomerName) {
            return;
        }
        var strC = "?$select=accountid,name&$top=1&$filter=contains(name,'"+customerName+"')";
        //let strC = "?$select=accountid,name&$top=1";

        Xrm.WebApi.retrieveMultipleRecords("account", strC).then(
            function success(result) {
                debugger;
                if (result.entities.length) {
                    var entity = result.entities[0];
                    var id = entity.accountid;
                    var name = entity.name;
                    var type = "account";
                    //set the field
                    setCustomer(id, name, type);
                } else {
                    strC = "?$select=contactid,fullname&$top=1&$filter=contains(fullname,'" + customerName + "')";
                    Xrm.WebApi.retrieveMultipleRecords("contact", strC).then(
                        function success(result) {
                            debugger;
                            if (result.entities.length) {
                                var entity = result.entities[0];
                                var id = entity.contactid;
                                var name = entity.fullname;
                                var type = "contact";
                                //set the field
                                setCustomer(id, name, type);
                            }
                        }, function (error) {
                            console.log(error.message); // handle error conditions
                        });
                };
            }, function (error) {
                console.log(error.message); // handle error conditions
            });
            
    }

    var setCustomer = function (id, name, type) {
        var object = new Array();
        object[0] = new Object();
        object[0].id = id;
        object[0].name = name;
        object[0].entityType = type;  // account or contact
        Xrm.Page.getAttribute("parentcustomerid").setValue(object);

    }
    //prevent autosave
    this.preventAutoSave = function(econtext) {  
        var eventArgs = econtext.getEventArgs();  
        if (eventArgs.getSaveMode() == 70 || eventArgs.getSaveMode() == 2) {  
            eventArgs.preventDefault();  
        }  
    }  
    // new field validation
    this.validate_new_customersyncname = function(executionContext) {
        var formContext = executionContext.getFormContext(); // get formContext
        
        var pattern = /[^\w]/ig; //only alpha numberic
        var fieldName = 'new_customersyncname';
        var currentValue = formContext.getAttribute(fieldName).getValue(); 
        debugger;
        if (pattern.test(currentValue)) {
          formContext.getControl(fieldName).setNotification('Invalid value, only alpha numeric are allowed');
        } else {
          formContext.getControl(fieldName).clearNotification();
        }
     
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
}).call(SmplR);