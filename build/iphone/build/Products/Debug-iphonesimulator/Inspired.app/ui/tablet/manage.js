
// here is where you put any reference to external code that ManageWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');

function ManageWindow(title){

    var manageWindow = Ti.UI.createWindow({
			//title:'Hello '+Ti.App.Properties.getString('currentUser'),
		barColor: Ti.App.Properties.getString('appbuttoncolor'),  //dark green
		TabBarHidden: true,
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});

	// get tab group object
	var tabGroup = Titanium.UI.currentTabGroup;
	var currentintervention;
	var auditlogs = []; 
	var header = Ti.UI.createView({
		top: 0,
		width: Ti.UI.FILL,
		height:  Ti.UI.FILL,
		backgroundColor: 'transparent'
	});
	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: 'Manage',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	header.add(labelTitle);
			
	var detailview = Ti.UI.createView({
		top: 0,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: Ti.App.Properties.getString('appbkgrdcolor')
	});
	
	var btnUsers = Ti.UI.createImageView({
		//image: 'images/users_black.png',
		backgroundColor: '#ECC10D', //yellow
    	borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#ECC10D', //yellow
		width: 150,
    	height: 100, 
		left: 20
	});
	
	var imageUsers = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/users_black.png'
    });
    
    var labelUsers = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Users',
        color: Ti.App.Properties.getString('appfontcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnUsers.add(imageUsers);
    btnUsers.add(labelUsers);
	
	btnUsers.addEventListener('click',function(e){
  		//go to login screen
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Users Screen', GetDateTime(), 'N');
       	Ti.App.fireEvent('app:loginClicked'); 
	});
	
	var btnData = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#0D4F8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',
		width: 150,
    	height: 100, 
    	visible: false
		//right: 20
	});
	
	var imageData = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/settings_white.png'
    });
    
    var labelData = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Data',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10
    // width:200   
    });
    
    btnData.add(imageData);
    btnData.add(labelData);
    
    btnData.addEventListener('click',function(e){
		//go to settings
		sendQuestionData('All Question Data');
  		// TODO sendUserInteractions('All User Interactions'); Use archive table NOT auditlog!
  	});
	
	function sendQuestionData(alldata) {// TODO record answer in a file, then try to send email
    			   	
	var answerlogDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'answerlogs');
		

	if (! answerlogDir.exists()) {
    	answerlogDir.createDirectory();
	}

	// .resolve() provides the resolved native path for the directory.
	var file  = Ti.Filesystem.getFile(answerlogDir.resolve(), 'answerlog.txt');
	file.write(file.read());
	
    	try {
    		var emailDialog = Ti.UI.createEmailDialog()
				emailDialog.subject = "InspiredApp All In the Moment Data "+Ti.App.Properties.getString('currentDevice');
				emailDialog.toRecipients = ['inspired@ulster.ac.uk'];
				emailDialog.messageBody = '<b>Log from Device</b>';
				//var f = Ti.Filesystem.getFile('ui/common/answerlog.txt');
				var f  = Ti.Filesystem.getFile(answerlogDir.resolve(), 'answerlog.txt');
				emailDialog.addAttachment(f);
				emailDialog.open();
				
		} catch(e){
		 //Ti.API.info('There was a problem. Cannot send data!');
		 alert('There was a problem. Cannot send data!');
		 // data not sent
		};
};

	function sendUserInteractions(allinteractions) {// TODO record answer in a file, then try to send email
    			   	
	auditlogs = getAuditlogs();
		//archive, send email and delete
		var AuditArchivetext = '';
		if (auditlogs.length > 0) {
			Ti.API.info('There is data to be sent.');
			for(i = 0; i < auditlogs.length; i++){ 
				AuditArchivetext = AuditArchivetext+auditlogs[i].usertype;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].platformid;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].control;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].exacttime;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].sent;
				AuditArchivetext = AuditArchivetext+',';
						
			};

		var archiveDataDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'archiveData');
		
			if (! archiveDataDir.exists()) {
    			archiveDataDir.createDirectory();
			}

		// .resolve() provides the resolved native path for the directory.
		var file  = Ti.Filesystem.getFile(archiveDataDir.resolve(), 'auditData.txt');
		file.write(AuditArchivetext);
		
		Ti.API.info('Sending archived data');
	
    	try {
    		var emailDialog = Ti.UI.createEmailDialog()
				emailDialog.subject = "InspiredApp All User Interactions "+Ti.App.Properties.getString('currentDevice');
				emailDialog.toRecipients = ['inspired@ulster.ac.uk'];
				emailDialog.messageBody = '<b>Log from Device</b>';
				//var f = Ti.Filesystem.getFile('ui/common/answerlog.txt');
				var f  = Ti.Filesystem.getFile(answerlogDir.resolve(), 'auditData.txt');
				emailDialog.addAttachment(f);
				emailDialog.open();
				
		} catch(e){
			Ti.API.info('There was a problem. Cannot send data!');
		 // data not sent
		};
	};
};


	
	
	var btnExit = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B',// purple
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
		width: 150,
    	height: 100, 
		right: 20
	});
	
	var imageExit = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/arrow_left_white.png'
    });
    
    var labelExit = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Back',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnExit.add(imageExit);
    btnExit.add(labelExit);
    
    btnExit.addEventListener('click',function(e){
		//back to login
		btnData.visible = false;
		btnStart.visible = false;
		btnEnd.visible = false;
  		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Back to Login Screen', GetDateTime(), 'N');
       	Ti.App.fireEvent('app:loginClicked'); 
	});


	var buttonView = Ti.UI.createView({
	    backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	buttonView.add(btnUsers);
	buttonView.add(btnData);
	buttonView.add(btnExit);
	
	detailview.add(buttonView);

// beginning of code for start and end intervention buttons

	var btnStart = Ti.UI.createImageView({
		backgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: Ti.App.Properties.getString('appbuttoncolor'),
		width: 150,
    	height: 100, 
    	visible: false,
		top: '180',
		left: '25%'
	});
	
	var imageStart = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
       //  TODO image: 'images/settings_white.png'
    });
    
    var labelStart = Ti.UI.createLabel({
        text: 'Start',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
   // btnStart.add(imageStart);
    btnStart.add(labelStart);
    
    btnStart.addEventListener('click',function(e){
		//set intervention to Y
		//  intervention can either be N, Y or F if it is N, you want to change it to Y
		try
			{
			// open or create a DB and table users, get records from user table
				var userdata = getUsers();
				
			}
			catch(e){
			// failed to open DB
				Titanium.API.info('No users'); 
    	
			};
		
		if (userdata.length == 0) {
			alert('No users');
		}
		else{
			Titanium.API.info('Users: '+userdata[0].username);

		var interventionstatus = getInterventions();
		
		if (interventionstatus[0].started == 'Y') {
			Ti.App.Properties.setString('appstatus', 'active');
			Ti.API.info('interventionstatus Y and appstatus active');
		};
		
		if (interventionstatus[0].started == 'N') {
			deleteIntervention('N');
			var interId = insertIntervention('Y', GetDateTime(), 'none');
			alert('New intervention set up');
			Ti.App.Properties.setString('appstatus', 'active');
			Ti.API.info('interventionstatus Y and appstatus active');
			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Start New Intervention', GetDateTime(), 'N');
		};
		
		if (interventionstatus[0].started == 'F') {
			alert('Intervention over - contact administrator!');
			Ti.App.Properties.setString('appstatus', 'passive');
			Ti.API.info('interventionstatus F and appstatus passive');
		};
	};
		
	});
	
	
	
	var btnEnd = Ti.UI.createImageView({
		backgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: Ti.App.Properties.getString('appbuttoncolor'),
		width: 150,
    	height: 100,
    	visible: false,
		top: '180',
		right: '25%'
	});
	
	var imageEnd = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
       //  TODO image: 'images/settings_white.png'
    });
    
    var labelEnd = Ti.UI.createLabel({
        text: 'Mid',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
   // btnStart.add(imageEnd);
    btnEnd.add(labelEnd);
    
    btnEnd.addEventListener('click',function(e){
 		
 		var answerlogDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'answerlogs');
		

		if (! answerlogDir.exists()) {
    		answerlogDir.createDirectory();
		}

		// .resolve() provides the resolved native path for the directory.
		var file  = Ti.Filesystem.getFile(answerlogDir.resolve(), 'answerlog.txt');
		file.write('');
		alert('Midpoint Data Sent. New file created.');
	});
	
	detailview.add(btnStart);
	detailview.add(btnEnd);
	
	///  for password entry
	
	var btnPassword = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B',// purple
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
    	top: 240,
		width: 150,
    	height: 100, 
		right: 20
	});
	
	var imagePassword = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
       // image: 'images/arrow_left_white.png'
    });
    
    var labelPassword = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Verify',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    //btnPassword.add(imagePassword);
    btnPassword.add(labelPassword);
    
    btnPassword.addEventListener('click',function(e){
		//back to login
  		if (textPassword.value == '1974') {
  			btnStart.visible = true;
  			btnEnd.visible = true;
  			btnData.visible = true;
  			textPassword.value = '';
  		} else {
  			alert('Invalid password');
  			textPassword.value = '';
  		};
	});
	
	 var lblPassword = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Password:',
        color: Ti.App.Properties.getString('appfontcolor'),
      	font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
    	top:295,
    	left: 20
    // width:200   
    });
    
    var textPassword = Titanium.UI.createTextField({
	//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
		top:300,
    	width: '250',
    	left:250,
    	height: 40, 
    	color: Ti.App.Properties.getString('appfontcolor'),
    	clearOnEdit : true,
    	//font: Ti.App.Properties.getString('appfontsize'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    	borderRadius: 6,    
    	hintText:'Enter here',
   	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	detailview.add(btnPassword);
	detailview.add(lblPassword);
	detailview.add(textPassword);
	
//  end of password checking
	
	
	// end of code for start and end intervention buttons
	
	
	
	manageWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Tab changed to '+title);
    	// TODO check session status:  if session status == 'ended' then show Exit Screen if appstatus active or Goodbye screen if appstatus passive
    	// if session status == 'active' then show change user screen
		setManageTab();	
	});
	
	function setManageTab(){
		// check the status of the intervention
		var intervention = getIntervention('Y');
		
		if (intervention.length == 0) {
		// intervention is ongoing and checkbox is checked	
			currentintervention = 'Y';
		}
		else {
			currentintervention = 'N';
		};
		//set up check box
		
	};
	
	
	manageWindow.titleControl = header;
	manageWindow.add(detailview);
	

function GetDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var fullmonth = '0'+month;
    } else
    {
    	var fullmonth = month;
    }
    if(day.toString().length == 1) {
        var fullday = '0'+day;
    }  else
    {
    	var fullday = day;
    } 
    if(hour.toString().length == 1) {
        var fullhour = '0'+hour;
    }  else
    {
    	var fullhour = hour;
    } 
    if(minute.toString().length == 1) {
        var fullminute = '0'+minute;
    } else
    {
    	var fullminute = minute;
    } 
    if(second.toString().length == 1) {
        var fullsecond = '0'+second;
    }  else 
    {
    	var fullsecond = second;
    }  
    
    var dateTime = fullday.toString()+fullmonth.toString()+year.toString()+fullhour.toString()+fullminute.toString()+fullsecond.toString();
    Ti.API.info('Date time log info: '+dateTime);
     return dateTime;
};
	
	return manageWindow;

};
module.exports = ManageWindow;