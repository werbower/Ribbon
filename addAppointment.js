var Smpl_A = window.Smpl_A||{};

(function () {
var myUniqueId = "_myUniqueId"; // Define an ID for the notification
var currentUserName = Xrm.Utility.getGlobalContext().userSettings.userName; // get current user name
var message = currentUserName + ": Your JavaScript code in action!";


this.createAppointment = function(executionContext){
    var contactObj = null;
    var formContext = executionContext.getFormContext();
    debugger;
    
    var curID = formContext.data.entity.getId();
    if(!curID){//not saved or
        return;
    }
    curID = String(curID).replace(/[{}]/g,'');
    var curName = String(formContext.getAttribute("fullname").getValue() || '').trim();
    //cur lookup
    var curContact = { id: curID, name: curName, type: "contact" }
    // create the appointment object
    curObj = new Object();
    curObj["subject"]="subject";
    curObj["scheduledstart"]=new Date();
    curObj["scheduledend"]=new Date();
    //lookup (knowledge base record?) works
    curObj["regardingobjectid_contact@odata.bind"] = "/contacts("+curID+")";

    
    var parties=[];
    var p0 = {};
    //p0.PartyId = { Id: curID, LogicalName: "contact" };
    p0["partyid_contact@odata.bind"] = "/contacts("+curID+")";
    p0["participationtypemask"]  = 5;
    parties.push(p0);

    curObj["appointment_activity_parties"]=parties;


    Xrm.WebApi.createRecord("appointment", curObj).then(function (result) {
        //get the guid of created record
        var recordId = result.id;

        //below code is used to open the created record
        var windowOptions = {
            openInNewWindow: true
        };
        //check if XRM.Utility is not null
        if (Xrm.Utility != null) {

            //open the entity record
            Xrm.Utility.openEntityForm("appointment", recordId, null, windowOptions);
        }
    })
  .fail(function (error) {
      //Xrm.Utility.alertDialog(error.message);
      console.log(error.message);

  });
}
}).call(Smpl_A);