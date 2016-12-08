/*  This is the default screen for the App.  If there are no users registered, it defaults to Add New User View.
 * It relies on the database.js file for its data
 * On the first user session, 3 user accounts will be set up - Admin, PWD, Carer
 * In order to edit the user accounts, a pin needs to be entered - this pin is 1974
 * This is also the Exit tab which allows questions from the research project to be asked.
 * The questions are stored in question array 
 * This screen checks the status of the session - if the session is post_research_projec, then the question tab will never appear.  
 * The default exit screen will be the login.
 * In order to set the sessions to post_research_project,
 * 
*/

/*Changed below for roll out of App after Home Use finished: 
 function ExitSession(){
	//set view to exit screen!!
  			setView(4);	
 };
 
 Everywhere ManageAuditLog commented
  		
*/

function LoginWindow(title){
	//  this database will hold all data about system users, answers, audit logs, pictures, videos and audio files
	CA_DEBUG_TRANSACTIONS=1;
	Ti.include('ui/common/database.js');
	
	//  stores the Mutuality Scale Questions.  These will never change...  The answers are stored in DB with userid, questionid and answer, them sent by email to research team
	//var QuestionArray = [];
	var questiontodisplay = '';
	var questionnumber = '';
	var photodir = 'users/';
	var filepath = Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+photodir; 
	var pwdphotofile = 'pwd_photo.png';
	var carerphotofile = 'carer_photo.png';
	var userdata = []; // all of the users
	var maindata = [];
	var carerdata = [];
	var answerdata = [];
	var carerdetailschanged = 'no';
	var pwddetailschanged = 'no';	
	var imagetosave = '';
	var auditlogs = []; 
	//var PWDphototosave = 'no';
	//var Carerphototosave = 'no';
	var sendgrid = require('tisendgrid')('aideengibson', 'etoile24');
    var loginWindow = Ti.UI.createWindow({
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		TabBarHidden: true,
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});
	
	
	loginWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Focus on window - tab changed to '+title);
    	// TODO check session status:  if session status == 'ended' then show Exit Screen if appstatus active or Goodbye screen if appstatus passive
    	if (Ti.App.Properties.getString('sessionstatus') == 'active') {
    		ExitSession();
    	}
    	else {
    		Ti.API.info(Ti.App.Properties.getString('currentPic'));
			setLoginTab();	
		};
	});

function getandsaveUserPhoto(phototoreturn, currentdirectory, currentfolder){ // phototoreturn 'pwd_photo.png' or 'carer_photo.png' 
		// on first launch of App, currentdirectory should be : Ti.Filesystem.resourcesDirectory, current folder 'images'
		// every other time, currentdirectory should be filepath: Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+users
		//TODO separate this into getuserphoto and saveuserphoto functions      
		var imgDirectory = Ti.Filesystem.getFile(currentdirectory, currentfolder);
		if (!imgDirectory.exists()){
			 Ti.API.info('No directory exists... ');
		}
		else{
			 Ti.API.info('Directory exists: ');
		};	
		
		var imagesArray = [];
		
		imagesArray = imgDirectory.getDirectoryListing();
		if (imagesArray.length == 0) {
			Ti.API.info('No files saved!');
		};
		var i = 0;
		try {
			while (i < imagesArray.length) {
				// TODO debug - definitely getting here... 
    		// check the photo passed in and see if one exists in currentdirectory	
    		Ti.API.info('File in array... '+imagesArray[i].toString()+' photoname '+phototoreturn);
    			if (imagesArray[i].toString() == phototoreturn) {
    				// TODO debug - definitely getting here... 
	   				var photofile = Ti.Filesystem.getFile(currentdirectory+Ti.Filesystem.separator+currentfolder, imagesArray[i].toString());
	   				// save this file to app data users
	   				Ti.API.info(photofile);
					var imgDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'users');          
					if (!imgDir.exists()){
						imgDir.createDirectory();
			 			Ti.API.info('Creating app data directory: ');
					}
					else{
			 			Ti.API.info('Directory exists: ');
					};	
    				// first, grab a "handle" to the file where you'll store the downloaded data
	 				var imageFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users', imagesArray[i].toString());
					Ti.API.info('Name of photo: '+imagesArray[i].toString());
					//  save image file in local app directory
					imageFile.write(photofile);
    			};
    			i++;
    		};	
    	
		} catch(e){
			Ti.API.info('no photos');
		};
};		
	
	var header = Ti.UI.createView({
		top: 0,
		width: Ti.UI.FILL,
		height:  Ti.UI.FILL,
		backgroundColor: 'transparent'
	});
	
	var labelTitle = Titanium.UI.createLabel({ 
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		//text: 'Welcome '+Ti.App.Properties.getString('currentUser'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	function setView(num){
	if (num == 1) {		  
		// essentially the default login screen to start using the App
		maindetailview.visible = 'true';
		goodbyedetailview.visible = 'false';
		datadetailview.visible = 'false';
		usersdetailview.visible = 'false';
		labelTitle.text = 'Welcome';
		try {
			PWDphoto.image = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users', 'pwd_photo.png');
			Ti.API.info('photo found');
		}
		catch(e){
			PWDphoto.image = 'images/empty_image.png';
		};
		try {
			carerphoto.image = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users', 'carer_photo.png');
			Ti.API.info('photo found');
		}
		catch(e){
			carerphoto.image = 'images/empty_image.png';
		};
		
		Ti.API.info('main selected');
	}	
	if (num == 2) {	
		//essentially logout screen for user
	try {	
			 // getAnswers orders the data in descending order of when the records were added so the last one will hold the number of the last question asked
			
			answerdata = getAnswers(Ti.App.Properties.getString('currentUserType'));
			if (answerdata.length == 0) {
				alert('no records');
			}
			else{
				//alert('some records');
			// returns a value 0 - 5 of last question asked.  If value is 0, question is array[0] for question 1.   If value is 1, question is array[1] for question 2
			//However if value is 5, question is array[0] for question 1
			/*questiontodisplay = answerdata[answerdata.length-1].questionnumber;
			if (questiontodisplay == '5') {
				questiontodisplay = '0';
			};
				var i = parseInt(questiontodisplay);	*/
			}
			
			//  stores the Mutuality Scale Questions.  These will never change...  The answers are stored in DB with userid, questionid and answer, them sent by email to research team
			var QuestionArray = [];
			//QuestionArray = ['To what extent do the two of you see eye to eye (agree on things)?', 'How close do you feel to '+Ti.App.Properties.getString('currentPartner')+'?', 'How much do you enjoy sharing past experiences with '+Ti.App.Properties.getString('currentPartner')+'?', 'How much does '+Ti.App.Properties.getString('currentPartner')+' express feelings of appreciation for you and the things you do?','How attached are you to '+Ti.App.Properties.getString('currentPartner')+'?', 'How much does '+Ti.App.Properties.getString('currentPartner')+' help you?', 'How much do you like to sit and talk with '+Ti.App.Properties.getString('currentPartner')+'?', 'How much love do you feel for '+ Ti.App.Properties.getString('currentPartner')+'?','To what extent do the two of you share the same values?', 'When you really need it, how much does '+Ti.App.Properties.getString('currentPartner')+' comfort you?', 'How much do the two of you laugh together?', 'How much emotional support does '+Ti.App.Properties.getString('currentPartner')+' give you?', 'To what extent do you enjoy the time the two of you spend together?', 'How often does '+Ti.App.Properties.getString('currentPartner')+' express feelings of warmth toward you?','How much do you confide in '+Ti.App.Properties.getString('currentPartner')+'?'];
			QuestionArray = ['How much do you enjoy sharing past experiences with '+Ti.App.Properties.getString('currentPartner')+'?', 'How attached are you to '+Ti.App.Properties.getString('currentPartner')+'?','How much do you like to sit and talk with '+Ti.App.Properties.getString('currentPartner')+'?','How much do the two of you laugh together?', 'How much do you confide in '+Ti.App.Properties.getString('currentPartner')+'?'];
			
	/**
 	* Randomize array element order in-place.
 	* Using Durstenfeld shuffle algorithm.
 	* Here is a JavaScript implementation of the Durstenfeld shuffle (A computer-optimized version of Fisher-Yates):
 	*/
	function shuffleArray(QArray) {
    	for (var i = QArray.length - 1; i > 0; i--) {
        	var j = Math.floor(Math.random() * (i + 1));
        	var temp = QArray[i];
        	QArray[i] = QArray[j];
        	QArray[j] = temp;
        	questionnumber = j+1;
    	}
    	return QArray;
	}
/*
The Fisher-Yates algorithm works by picking one random element for 
each original array element, and then excluding it from the next draw. 
Just like randomly picking from a deck of cards.

This exclusion is done in a clever way (invented by Durstenfeld for use by computers) 
by swapping the picked element with the current element, and then picking the next random element from the remainder. 
For optimal efficiency, the loop runs backwards so that the random pick is simplified (it can always start at 0), 
and it skips the last element because there are no other choices anymore.

The running time of this algorithm is O(n). Note that although it does return the array for convenience, 
the shuffle is done in-place. So if you do not want to modify the original array, make a copy of it first with .slice(0).*/
			
			questiontodisplay = shuffleArray(QuestionArray)[0];
			labelQuestion.text =  questiontodisplay;
			//labelInstructions.text = QuestionArray[i];
			//i++;
			//questiontodisplay = i.toString();
		}
		catch(e){
		 	alert('No question to display!');	
		};	
		datadetailview.visible = 'true';
		goodbyedetailview.visible = 'false';
		maindetailview.visible = 'false';
		usersdetailview.visible = 'false'; 
		labelTitle.text = 'Feedback'; 
		Ti.API.info('exit selected'); 
	};
	if (num == 3) {		  
		usersdetailview.visible = 'true';
		goodbyedetailview.visible = 'false';
		maindetailview.visible = 'false';
		datadetailview.visible = 'false';
		labelTitle.text = 'User Details';
		var carerdetailschanged = 'no';
		var pwddetailschanged = 'no';	
		try {
			newPWDphoto.image = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users', 'pwd_photo.png');
			Ti.API.info('photo found');
		}
		catch(e){
			newPWDphoto.image = 'images/empty_image.png';
		};
		try {
			newcarerphoto.image = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users', 'carer_photo.png');
			Ti.API.info('photo found');
		}
		catch(e){
			newcarerphoto.image = 'images/empty_image.png';
		};
		
		try {
			textfieldPWDName.value = maindata[0].username;  
			Ti.API.info('pwd data found');
		}
		catch(e){
			textfieldPWDName.value = '';
		};
		try {
			textfieldCarerName.value = carerdata[0].username;
			Ti.API.info('carer data found');
		}
		catch(e){
			textfieldCarerName.value = '';
		};
		
		Ti.API.info('add user selected');
		};	
		if (num == 4) {		  
		usersdetailview.visible = 'false';
		maindetailview.visible = 'false';
		datadetailview.visible = 'false';
		//labelTitle.text = 'User Details';
		goodbyedetailview.visible = 'true';
		Ti.API.info('Goodbye selected');
		labelTitle.text = '';// Exit screen
		//TODO put to sleep mode...
		};
	};
	
		
	header.add(labelTitle);
		
	loginWindow.titleControl = header;
// the main detail view displays a main user photo and a main carer photo, it is only visible if there are at least 3 records in the system	
	
	var maindetailview = Ti.UI.createView({
		top: 0,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: 'transparent',
		visible:  'false'
	});

var labelBegin = Titanium.UI.createLabel({
		bottom: '10%',
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'), 
		width: '100%',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		text: 'Please push your photo to begin.'
});

maindetailview.add(labelBegin);

////    


	var btnLoginUsers = Ti.UI.createImageView({
		//image: 'images/users_white.png',
		//backgroundColor: '#ECC10D', //yellow
    	backgroundColor: '#0D4F8B', //blue
    	borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',  
		width: 150,
    	height: 100, 
		left: 20
	});
	
	var imageLoginUsers = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/users_white.png'
    });
    
    var labelLoginUsers = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Users',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLoginUsers.add(imageLoginUsers);
    btnLoginUsers.add(labelLoginUsers);
	
	btnLoginUsers.addEventListener('click',function(e){
		// go to user details
  		//insertAuditlog(Ti.App.Properties.getString('currentUser'), Ti.App.Properties.getString('currentDevice'), title+'Edit User Details', GetDateTime(), 'N');
		setView(3);	
	});
	
	var btnLoginSettings = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#0D4F8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',
		width: 150,
    	height: 100, 
		//right: 20
	});
	
	var imageLoginSettings = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/settings_white.png'
    });
    
    var labelLoginSettings = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Settings',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLoginSettings.add(imageLoginSettings);
    btnLoginSettings.add(labelLoginSettings);
    
    btnLoginSettings.addEventListener('click',function(e){
		 //go to settings
  		//insertAuditlog(Ti.App.Properties.getString('currentUser'), Ti.App.Properties.getString('currentDevice'), title+'User Settings', GetDateTime(), 'N');
       	Ti.App.fireEvent('app:settingsClicked'); 
	});
	
	var btnLoginExit = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B', //purple
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
		width: 150,
    	height: 100, 
		right: 20
	});
	
	var imageLoginExit = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/close_white.png'
    });
    
    var labelLoginExit = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Exit',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLoginExit.add(imageLoginExit);
    btnLoginExit.add(labelLoginExit);
    
    btnLoginExit.addEventListener('click',function(e){// go to user details
    	  if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Exit App.', GetDateTime(), 'N'); 
   			//alert('no internet connection');
		} else {
   			Titanium.API.info(' connection present ');
   			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Exit App.', GetDateTime(), 'N'); 
   			//ManageAuditLog();
		}
  		ExitSession();
	});

function ExitSession(){
	//set view to exit screen!!
  	setView(4);	
};

	/*function ExitSession(){
		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Exit from login', GetDateTime(), 'N');
  		if (Ti.App.Properties.getString('appstatus') == 'passive'){ //do not gather usage data. Rule - no usage data is collected after study ends so exit immediately
  			alert('appstatus: passive');//interventionstatus on exit
  			setView(4);	
  		}
  		else {
  			if (Ti.App.Properties.getString('sessionstatus') == 'passive'){// session not yet started so exit immediately 
  				//do nothing
  				Ti.API.info('appstatus: active & session: passive');
  				setView(4);				}
  			else {// user is at the end of an active session where app status is active also so we want to gather data
  				if (Ti.App.Properties.getString('Question_Asked') == 'No'){
  				Ti.API.info('appstatus: active & session: active changed to passive & Question: no');
  				setView(2);	//???? 
				//Ti.App.Properties.setString('sessionstatus', 'passive');
  				}
  				else {
  				//a question has already been asked so do nothing
  				Ti.API.info('appstatus: active & session: active changed to passive & Question: yes');
  				setView(4);		
  				};
  			};
  		};
		
		
		var currentinter = getIntervention('Y');
					Ti.API.info('interventionstatus on exit');
					if (currentinter.length == 0) {
						// no intervention record has been set up so set one up now
						Ti.API.info('cannot get interventionstatus');
						Ti.App.Properties.setString('sessionstatus', 'passive');
						setView(4);	
					}
					else {
						// an intervention has been set up...
						//  check if it is finished
						var interFinished = getIntervention('F');
							// check session status
							if (interFinished.length >0) {
								// interventioon is over
								Ti.API.info('intervention is over');
								Ti.App.Properties.setString('sessionstatus', 'passive');
								setView(4);
							}
							else {
							if (Ti.App.Properties.getString('sessionstatus') == 'active'){
								Ti.API.info('interventionstatus Y and appstatus active');
								Ti.App.Properties.setString('sessionstatus', 'passive');
								if (Ti.App.Properties.getString('Question_Asked') == 'No'){
  									setView(2);	
  								}
  								else {
  								//a question has already been asked so do nothing
  								setView(4);		
  								};
							}
							else {
								// no ongoing session
								setView(4);	
							};
						};	
					};
	};*/

	var buttonViewLogin = Ti.UI.createView({
	    backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	buttonViewLogin.add(btnLoginUsers);
	//buttonViewLogin.add(btnLoginSettings);
	buttonViewLogin.add(btnLoginExit);
	
	maindetailview.add(buttonViewLogin);

/////

var maintableholder = Ti.UI.createView({
		bottom: 0,		
		borderWidth: '0',
		width: Ti.UI.FILL,
		height: '60%',
    	color: 'transparent'
});

var main_tbl_data_left = [];
var main_tbl_data_right = [];

var row1 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});
    
    var PWDphoto = Ti.UI.createImageView({
		height:200,
		width:200,
		layout: 'horizontal',
		top: 0,
		canScale:false, 
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
		borderRadius:10,       //for rounded corners
		//image: 'images/'+Ti.App.Properties.getString('currentPic')
		//image: Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, '/users/'+'pwd_photo.png')
	}); 
	
	PWDphoto.addEventListener('click', function(){
        // TODO check if there is already a session ongoing, if so, end it and initialise the new session
        Ti.App.Properties.setString('Question_Asked', 'No');
        Ti.App.Properties.setString('Timer_Started', 0);
        	if (maindata.length>0){//there is a pwd record, so set current user prefs
        		Ti.App.Properties.setString('currentPartner', carerdata[0].username);// for question screen later...
        		Ti.App.Properties.setString('currentUser', maindata[0].username);
				Ti.API.info('PWD set: '+Ti.App.Properties.getString('currentUser')); //PWD -> indicates that there is a main user
				Ti.App.Properties.setString('currentUserType', maindata[0].mainuser);// get from maindata[0].
				Ti.API.info('PWD set: '+Ti.App.Properties.getString('currentUserType'));
				Ti.App.Properties.setString('currentPic', maindata[0].photo);
				Ti.API.info('PWD set: '+Ti.App.Properties.getString('currentPic')); 	
				if (Ti.App.Properties.getString('sessionstatus') == 'active'){
					// TODO log this in the DB and start a new session
					Ti.API.info(Ti.App.Properties.getString('sessionstatus'));
				}
				else{
					// start a new session
					//Ti.App.Properties.setString('sessionstatus', 'active');
					Ti.API.info(Ti.App.Properties.getString('sessionstatus'));
				}
				//TODO check audit log and send to archive
				if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   					Titanium.API.info(' no connection ');
   					//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Login - Failed to ManageAuditLog. No internet.', GetDateTime(), 'N'); 
   					//alert('no internet connection');
				} else {
   					Titanium.API.info(' connection present ');
   					//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Login - Send Email. Internet connected.', GetDateTime(), 'N'); 
   					//ManageAuditLog();
				}
       			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Login PWD', GetDateTime(), 'N');
       			Ti.App.fireEvent('app:homeClicked');    
        	}
        	else {
        		alert('Please add main user details!');
        	};
    });
	
    PWDphoto.addEventListener('touchstart', function() {
    	PWDphoto.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    PWDphoto.addEventListener('touchend', function() {
    	PWDphoto.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    	
    
   row1.add(PWDphoto);
   main_tbl_data_left.push(row1);

var row2 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});
    
    var carerphoto = Ti.UI.createImageView({
		height:200,
		width:200,
		//borderWidth:10,
		top: 0,
		canScale:false, 
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
		borderRadius:10,       //for rounded corners
		//image: 'images/carer_photo.png',
		//image: Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, '/users/'+'pwd_photo.png')
	}); 
	
	carerphoto.addEventListener('click', function(){
		Ti.App.Properties.setString('Question_Asked', 'No');
        Ti.App.Properties.getString('Timer_Started', 0);
        if (carerdata.length>0){//there is a pwd record, so set current user prefs
				Ti.App.Properties.setString('currentPartner', maindata[0].username);
				Ti.App.Properties.setString('currentUser', carerdata[0].username);
				Ti.API.info('Carer set: '+Ti.App.Properties.getString('currentUser')); //PWD -> indicates that there is a main user
				Ti.App.Properties.setString('currentUserType', carerdata[0].mainuser);// get from maindata[0].
				Ti.API.info('Carer set: '+Ti.App.Properties.getString('currentUserType'));
				Ti.App.Properties.setString('currentPic', carerdata[0].photo);
				Ti.API.info('Carer set: '+Ti.App.Properties.getString('currentPic'));
				if (Ti.App.Properties.getString('sessionstatus') == 'active'){
					// TODO log this in the DB and start a new session
					Ti.API.info(Ti.App.Properties.getString('sessionstatus'));
				}
				else{
					// start a new session
					//Ti.App.Properties.setString('sessionstatus', 'active');
					Ti.API.info(Ti.App.Properties.getString('sessionstatus'));
				}
				//TODO check audit log and send to archive
				if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   					Titanium.API.info(' no connection ');
   					//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Login - Failed to ManageAuditLog. No internet.', GetDateTime(), 'N'); 
   					//alert('no internet connection');
				} else {
   					Titanium.API.info(' connection present ');
   					//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Login - Send Email. Internet connected.', GetDateTime(), 'N'); 
   					//ManageAuditLog();
				}
       			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Login Carer', GetDateTime(), 'N');
       			Ti.App.fireEvent('app:homeClicked');
        	}
        	else {
        		alert('Please add main user details!');
        	};
    });
	
    carerphoto.addEventListener('touchstart', function() {
    	carerphoto.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    carerphoto.addEventListener('touchend', function() {
    	carerphoto.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    
     
    row2.add(carerphoto);
    main_tbl_data_right.push(row2);
  
// now assign that array to the table's data property to add those objects as rows
var main_table_left = Titanium.UI.createTableView({
	left: 0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '50%',
	height: Ti.UI.FILL,
	rowHeight: Ti.UI.FILL,
    data:main_tbl_data_left,
    scrollable: false       
});

 // now assign that array to the table's data property to add those objects as rows
var main_table_right = Titanium.UI.createTableView({
	right:0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '50%',
	height: Ti.UI.FILL,
	rowHeight: Ti.UI.FILL,
	//height: '100%',
	//rowHeight: 360,
    data:main_tbl_data_right,
    scrollable: false     
});

//add data to tables and tables to window here...		
main_table_left.setData(main_tbl_data_left);
main_table_right.setData(main_tbl_data_right);
maintableholder.add(main_table_left);
maintableholder.add(main_table_right);

// layout for adding question detailview	
	
	var datadetailview = Ti.UI.createView({
		//view that appears to answer questions
		top: 0,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: 'transparent',
		visible:  'false'
	});
	
	var labelInstructions = Titanium.UI.createLabel({
		bottom:  '18%',
		backgroundColor: 'transparent',
		//color: '#fff',
		width: '100%',
		height: '160',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color: Ti.App.Properties.getString('appfontcolor'),
		text: 'Press a button to answer.',
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	var labelDismiss = Ti.UI.createLabel({
        text: 'Dismiss',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'} 
    });
    
    var btnDismiss = Ti.UI.createButton({
		backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
		bottom: '40',
		height: 90,
		width: 240,
		borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	color: '#fff'
	});
	
    
    btnDismiss.addEventListener('click', function(e){
    	 if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), '4 - Send Email Failed. No internet.', GetDateTime(), 'N'); 
   			//alert('no internet connection');
   			setView(4);
		} else {
   			Titanium.API.info(' connection present ');
   		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), '4 - Send Email. Internet connected.', GetDateTime(), 'N'); 
   		// Deleted for after intervention and line below added	sendEmail('5'); 
   		setView(4);
		}	
    	Ti.App.Properties.setString('Question_Asked', 'Yes');
    });
	
	btnDismiss.addEventListener('touchstart', function() {
        btnDismiss.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    btnDismiss.addEventListener('touchend', function() {
        btnDismiss.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    
    btnDismiss.add(labelDismiss);
    
	var labelQuestion = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		top: '100',
		width: '100%',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		//color: '#fff',
		color: Ti.App.Properties.getString('appfontcolor'),
		//text: 'Press a button to answer the Question below.',
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});

datadetailview.add(labelInstructions);
datadetailview.add(labelQuestion);
datadetailview.add(btnDismiss);

var questiontableholder = Ti.UI.createView({
		bottom: '200',		
		borderWidth: '0',
		width: Ti.UI.FILL,
		height: '40%',
    	color: 'transparent'
});

//questiontableholder.add(btnDismiss);

// Create arrays of explicitly defined custom TableViewRows

var question_tbl_data_left = [];
var question_tbl_data_right = [];

var question_tbl_data_left_centre = [];
var question_tbl_data_right_centre = [];

var question_tbl_data_centre = [];

var row4 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});

    var image4 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 25,
    	width:100, height:60,
        image: 'images/push.png'
    });
    
    var label4 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Not at all',
        color: '#fff',
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    	bottom:35,
    	width:80   
    });
    
    var button4 = Ti.UI.createButton({
   		color: '#fff',
        //width: '360',
        top: '0',
        width:145, 
    	height: '200',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 10,
    	borderWidth: '0',
    	//left: 5,
  		font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')}
    });

    button4.addEventListener('touchstart', function() {
        button4.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button4.addEventListener('touchend', function() {
        button4.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    button4.addEventListener('click',function(e){
    	if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), '1 - Send Email Failed. No internet.', GetDateTime(), 'N'); 
   			//alert('no internet connection');
   			setView(4);
		} else {
   			Titanium.API.info(' connection present ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), '1 - Send Email. Internet connected.', GetDateTime(), 'N'); 
   			// Deleted for after intervention and line below added	sendEmail('0'); 
   			setView(4);
		}	 
		
    	Ti.App.Properties.setString('Question_Asked', 'Yes');
    });
    
    button4.add(image4);
    button4.add(label4);
    row4.add(button4);    
    question_tbl_data_left.push(row4);


function sendEmail(response){
//var answerLogtext = Ti.App.Properties.getString('currentUserType')+','+Ti.App.Properties.getString('currentDevice')+','+questiontodisplay+','+response+','+GetDateTime()+',';
		
    	var answerLogtext = Ti.App.Properties.getString('currentUserType')+','+Ti.App.Properties.getString('currentDevice')+','+questionnumber+','+response+','+GetDateTime()+',';
		  	
		var answerlogDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'answerlogs');
		

	if (! answerlogDir.exists()) {
    	answerlogDir.createDirectory();
	}

	// .resolve() provides the resolved native path for the directory.
	var file  = Ti.Filesystem.getFile(answerlogDir.resolve(), 'answerlog.txt');
	file.write(file.read()+answerLogtext);
	
    	try {
    		    	
		var email = {
    		to:       Ti.App.Properties.getString('EmailAddress'),//'aideen@3advance.com',  email_to_address,
    		from:     'InspiredApp2015',  //email_from_address,
   		 	subject:  'InspiredApp In the Moment Data '+Ti.App.Properties.getString('currentDevice'),  //email_subject,
    		text:     answerLogtext  //email_message_text
		};
		
		var message = sendgrid.Email(email);

		sendgrid.send(message, function(e) {
    		if (e) {
        		console.log(JSON.stringify(e));
        		alert(e.errors[0]);
    		}else{
       		 	//alert('Message sent');
    		}
		});
				//empty the file
				
				//insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questiontodisplay, response, GetDateTime());
				insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questionnumber, response, GetDateTime());
				// record sent in DB
				setView(4);
		} catch(e){
		 alert('Answer not recorded, please contact IT support!');
		 // record not sent in DB
		 setView(4);
		 //insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questiontodisplay, response, 'not sent');
		 insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questionnumber, response, 'not sent');
		 setView(4);
		}; 
};

function oldsendEmail(response) {// TODO record answer in a file, then try to send email
    	//write it to file
    	//var answerLogtext = Ti.App.Properties.getString('currentUserType')+','+Ti.App.Properties.getString('currentDevice')+','+questiontodisplay+','+response+','+GetDateTime()+',';
			var answerLogtext = Ti.App.Properties.getString('currentUserType')+','+Ti.App.Properties.getString('currentDevice')+','+questionnumber+','+response+','+GetDateTime()+',';
				   	
		var answerlogDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'answerlogs');
		

	if (! answerlogDir.exists()) {
    	answerlogDir.createDirectory();
	}

	// .resolve() provides the resolved native path for the directory.
	var file  = Ti.Filesystem.getFile(answerlogDir.resolve(), 'answerlog.txt');
	file.write(file.read()+answerLogtext);
	
    	try {
    		var emailDialog = Ti.UI.createEmailDialog()
				emailDialog.subject = "Thank you for your response!";//'InspiredApp User Interactions'+Ti.App.Properties.getString('currentDevice')
				emailDialog.toRecipients = [Ti.App.Properties.getString('EmailAddress')]; //['aideen@3advance.com'];
				emailDialog.messageBody = '<b>Log from Device</b>';
				//var f = Ti.Filesystem.getFile('ui/common/answerlog.txt');
				var f  = Ti.Filesystem.getFile(answerlogDir.resolve(), 'answerlog.txt');
				emailDialog.addAttachment(f);
				//emailDialog.open();
				//empty the file		
				insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questionnumber, response, GetDateTime());
				//insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questiontodisplay, response, GetDateTime());
				// record sent in DB
				setView(4);
		} catch(e){
		 alert('Answer not recorded, please contact IT support!');
		 // record not sent in DB
		 setView(4);
		 insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questionnumber, response, GetDateTime());
				
		// insertAnswer(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), questiontodisplay, response, GetDateTime());
		 setView(4);
		};
};



var row5 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});

   var image5 = Ti.UI.createImageView({
    	layout: 'horizontal',
    	top: 25,
    	width:100, height:60,
        image: 'images/push.png'
    });
    
    var label5 = Ti.UI.createLabel({
        //text: 'Relive video moments',
        text: 'Some',
        color: '#fff',
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
        bottom:35,
    	width:100  
    });
    
    var button5 = Ti.UI.createButton({
        color: '#fff',
        //width: '360',
    	width:145, 
    	top: '0',
    	height: '200',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
   		borderRadius: 10,
    	borderWidth: '0',
    	//left: 5,
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    });

    button5.addEventListener('touchstart', function() {
        button5.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button5.addEventListener('touchend', function() {
        button5.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });  
    
    button5.addEventListener('click',function(e){
    	 if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email Failed. No internet.', GetDateTime(), 'N'); 
   			//alert('no internet connection');
   			setView(4);
		} else {
   			Titanium.API.info(' connection present ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email. Internet connected.', GetDateTime(), 'N'); 
   			// Deleted for after intervention and line below added sendEmail('2'); 
   			setView(4);
		}	
		
    	 Ti.App.Properties.setString('Question_Asked', 'Yes');
    });
       
    button5.add(image5);
    button5.add(label5);
    row5.add(button5);
    question_tbl_data_centre.push(row5);
 
    var row3 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});

	var image3 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 25,
    	width:100, height:60,
        image: 'images/push.png'
    });
    
    var label3 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'A Great deal',
        color: '#fff',
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    	bottom:35,
    	width:115  
    });
    
    var button3 = Ti.UI.createButton({
   		color: '#fff',
        //width: '360',
        width:145, 
        top:'0',
    	height: '200',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 10,
    	borderWidth: '0',
    	//left: 5,
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    });
    
    button3.addEventListener('touchstart', function() {
        button3.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button3.addEventListener('touchend', function() {
        button3.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    button3.addEventListener('click',function(e){
    	 	 if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email Failed. No internet.', GetDateTime(), 'N'); 
   			//alert('no internet connection');
   			setView(4);
		} else {
   			Titanium.API.info(' connection present ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email. Internet connected.', GetDateTime(), 'N'); 
   			// Deleted for after intervention and line below added sendEmail('4'); 
   			setView(4);
		}	 
		
    	 Ti.App.Properties.setString('Question_Asked', 'Yes');
    });
    
    button3.add(image3);
    button3.add(label3);
    row3.add(button3);    
    question_tbl_data_right.push(row3);
    
    
var rowLittle = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});

    var imageLittle = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 25,
    	width:100, height:60,
        image: 'images/push.png'
    });
    
    var labelLittle = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'A Little',
        color: '#fff',
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    	bottom:35,
    	width:80   
    });
    
    var buttonLittle = Ti.UI.createButton({
   		color: '#fff',
        //width: '360',
        top: '0',
        width:145, 
    	height: '200',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 10,
    	borderWidth: '0',
    	//right: 5,
  		font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')}
    });

    buttonLittle.addEventListener('touchstart', function() {
        buttonLittle.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    buttonLittle.addEventListener('touchend', function() {
        buttonLittle.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    buttonLittle.addEventListener('click',function(e){
 	if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email Failed. No internet.', GetDateTime(), 'N'); 
   			//alert('no internet connection');
   			setView(4);
		} else {
   			Titanium.API.info(' connection present ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email. Internet connected.', GetDateTime(), 'N'); 
   			// Deleted for after intervention and line below added sendEmail('1'); 
   			setView(4);
		}	 
		
    	 Ti.App.Properties.setString('Question_Asked', 'Yes');
    });
    
    buttonLittle.add(imageLittle);
    buttonLittle.add(labelLittle);
    rowLittle.add(buttonLittle);    
    question_tbl_data_left_centre.push(rowLittle);
    
    var rowBit = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});

    var imageBit = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 25,
    	width:100, height:60,
        image: 'images/push.png'
    });
    
    var labelBit = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Quite a Bit',
        color: '#fff',
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    	bottom:35,
    	width:100   
    });
    
    var buttonBit = Ti.UI.createButton({
   		color: '#fff',
        width: '300',
        width:145, 
        top:'0',
    	height: '200',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 10,
    	borderWidth: '0',
    	//left: 5,
        font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    });

    buttonBit.addEventListener('touchstart', function() {
        buttonBit.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    buttonBit.addEventListener('touchend', function() {
        buttonBit.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    buttonBit.addEventListener('click',function(e){
    	 if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email Failed. No internet.', GetDateTime(), 'N'); 
   			//alert('no internet connection');
   			setView(4);
		} else {
   			Titanium.API.info(' connection present ');
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Send Email. Internet connected.', GetDateTime(), 'N'); 
   			// Deleted for after intervention and line below added	 sendEmail('3'); 
   			setView(4);
		}	 
		
    	 Ti.App.Properties.setString('Question_Asked', 'Yes');
    });
    
    
    buttonBit.add(imageBit);
    buttonBit.add(labelBit);
    rowBit.add(buttonBit);    
    question_tbl_data_right_centre.push(rowBit);



// now assign that array to the table's data property to add those objects as rows
var question_table_left = Titanium.UI.createTableView({
	left: 0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '20%',
	//height: Ti.UI.FILL,
	//top: 200,
	rowHeight: 180,
    data:question_tbl_data_left,
    scrollable: false     
});

question_table_left.addEventListener('click',function(e){

});
 
 
 // now assign that array to the table's data property to add those objects as rows
var question_table_right = Titanium.UI.createTableView({
	right:0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '20%',
	//height: '100%',
	//top: 200,
	rowHeight: 180,
    data:question_tbl_data_right,
    scrollable: false    
});

question_table_right.addEventListener('click',function(e){
	// will return index of row.
});

 // now assign that array to the table's data property to add those objects as rows
var question_table_centre = Titanium.UI.createTableView({
	left: '40%',
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '20%',
	height: '100%',
	//top: 200,
	rowHeight: 180,
    data:question_tbl_data_centre,
    scrollable: false          
});

question_table_centre.addEventListener('click',function(e){
	// will return index of row.
});

var question_table_right_centre = Titanium.UI.createTableView({
	right:'20%',
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '20%',
	//height: '100%',
	//top: 200,
	rowHeight: 180,
    data:question_tbl_data_right_centre,
    scrollable: false      
});

var question_table_left_centre = Titanium.UI.createTableView({
	left: '20%',
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '20%',
	//height: Ti.UI.FILL,
	//top: 200,
	rowHeight: 180,
    data:question_tbl_data_left_centre,
    scrollable: false      
});

datadetailview.add(questiontableholder);


//add data to tables and tables to window here...		
question_table_left.setData(question_tbl_data_left);
question_table_right.setData(question_tbl_data_right);
question_table_left_centre.setData(question_tbl_data_left_centre);
question_table_right_centre.setData(question_tbl_data_right_centre);
question_table_centre.setData(question_tbl_data_centre);
questiontableholder.add(question_table_left);
questiontableholder.add(question_table_right);
questiontableholder.add(question_table_left_centre);
questiontableholder.add(question_table_right_centre);
questiontableholder.add(question_table_centre);

maindetailview.add(maintableholder);


	loginWindow.add(maindetailview);

	loginWindow.add(datadetailview);



	var usersdetailview = Ti.UI.createView({
		//  view that appears when adding users
		top: 0,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: 'transparent',
		visible:  'false'
	});
	

var userstableholder = Ti.UI.createView({
		top: '0',		
		borderWidth: '0',
		width: Ti.UI.FILL,
		height: '90%',
    	color: 'transparent'
});

usersdetailview.add(userstableholder);

//  top tab with buttons for user detail view //
	var btnMainUser = Ti.UI.createImageView({
		//image: 'images/users_black.png',
		backgroundColor: '#ECC10D', //yellow
		//backgroundColor: '#0D4F8B', // blue
    	borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#ECC10D', 
		width: 150,
    	height: 100, 
		left: 20
	});
	
	var imageMainUser = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/users_black.png'
    });
    
    var labelMainUser = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Main',
        color: Ti.App.Properties.getString('appfontcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnMainUser.add(imageMainUser);
    btnMainUser.add(labelMainUser);
	
	btnMainUser.addEventListener('click',function(e){
		// exit photos
		//labelDetails.text = 'Main User',
		user_table_top.visible = 'True',	
		user_table_bottom.visible = 'False'	
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Main User Details', GetDateTime(), 'N');
	});
	
	var btnLogin = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
		width: 150,
    	height: 100, 
		right: 20
	});
	
	var imageLogin = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/arrow_left_white.png'
    });
    
    var labelLogin = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Back',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLogin.add(imageLogin);
    btnLogin.add(labelLogin);
    
    btnLogin.addEventListener('click',function(e){
		// exit photos
  		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Back to login view', GetDateTime(), 'N');
  		setView(1);
	});
	
	var btnMainCarer = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#0D4F8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',
		width: 150,
    	height: 100, 
		//left: 200
	});
	
	var imageMainCarer = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/users_white.png'
    });
    
    var labelMainCarer = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Carer',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnMainCarer.add(imageMainCarer);
    btnMainCarer.add(labelMainCarer);
    
    btnMainCarer.addEventListener('click',function(e){
		// show search view
		//labelDetails.text = 'Main Carer',
		user_table_top.visible = 'False',
		user_table_bottom.visible = 'True'
  		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Main Carer Details', GetDateTime(), 'N');
	});


	var buttonViewTop = Ti.UI.createView({
	    backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	buttonViewTop.add(btnMainUser);
	buttonViewTop.add(btnMainCarer);
	buttonViewTop.add(btnLogin);
	userstableholder.add(buttonViewTop);
//// end top tab for user buttons for user details screen

var user_tbl_data_top = [];
var user_tbl_data_bottom = [];

var row6 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});
    
    var newPWDphoto = Ti.UI.createImageView({
		height:180,
		width: 180,
		left: 20,
		//borderWidth:10,
		layout: 'horizontal',
		bottom: 0,
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
		borderRadius:10,       //for rounded corners
		canScale:false, 
		//image: 'images/pwd_photo.png',
	}); 
	
	
var labelPWDName = Titanium.UI.createLabel({
		top: 0,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 220,
		text: 'User Name:'
});

var textfieldPWDName = Titanium.UI.createTextField({
	//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
	top:70,
    width: '360',
    left: '220',
    height: 40, 
    color: Ti.App.Properties.getString('appfontcolor'),
    clearOnEdit : true,
    //font: Ti.App.Properties.getString('appfontsize'),
	font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
	borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    borderRadius: 6,    
    hintText:'Type your name',
   // keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

textfieldPWDName.addEventListener('change', function(e){
	pwddetailschanged = 'yes';
});

	var labelSave1 = Ti.UI.createLabel({
        text: 'Save',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
        bottom: 10
    // width:200   
    });
    
	var btnSave1 = Ti.UI.createButton({
		backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
		right: 20,
		top: '10',
		//left: '640',
		width: 150,
    	height: 100, 
		borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	color: '#fff'
	});
	
	var imageSave1 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/save_white.png'
    });
	
	btnSave1.add(imageSave1);
	btnSave1.add(labelSave1);
	
		function saveimage(imagetosave, photofilename){
    				// TODO debug - definitely getting here... 
	   				var photofile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users', photofilename);
	   				// save this file to app data users
	   			
					var imgDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'users');          
					if (!imgDir.exists()){
						imgDir.createDirectory();
			 			Ti.API.info('Creating app data directory: ');
					}
					else{
			 			Ti.API.info('Directory exists: ');
					};	
    				// first, grab a "handle" to the file where you'll store the downloaded data
	 				var imageFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users', photofilename);
					//  save image file in local app directory
					imageFile.write(imagetosave);
		};
		
	var savedDialog = Ti.UI.createAlertDialog({
    	message: 'User details have been saved',
    	ok: 'OK',
    	title: 'Details Saved'
  	});
	
	btnSave1.addEventListener('click',function(e)
	{ 
    	if (textfieldPWDName.value != '' && newPWDphoto.image != '')
    		{
    			if (pwddetailschanged == 'yes'){
       		// send details to database 
       			Ti.API.info('belfre delete :'+maindata[0].username+' textfield vale: '+textfieldPWDName.value);
       				deleteUser(maindata[0].id);
       				if (imagetosave != ''){
    					saveimage(imagetosave, 'pwd_photo.png'); //actual image and filename 
       				};
    				var newuser = insertUser('email', textfieldPWDName.value, '1234', 'pwd_photo.png', 'PWD', 'flickr', 'youtube');
       				maindata = getMainUser('PWD');
       				Ti.API.info('User added :'+maindata[0].username);
       				pwddetailschanged = 'no'; 
       				imagetosave = '';	
       			};	
       			savedDialog.show();
    		}
    		else
   		 	{
    	   		 alert("Username and photo required");
    		};
 		
 	});
 		
    newPWDphoto.addEventListener('touchstart', function() {
        newPWDphoto.borderColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    newPWDphoto.addEventListener('touchend', function() {
        newPWDphoto.borderColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    	var photoDialog = Titanium.UI.createOptionDialog({
  	//  title: 'Choose an image source...',
    	options: ['Camera','Photo Gallery', 'Cancel'],
    	cancel:2
	});	
    
    newPWDphoto.addEventListener('click',function(e){
			//show dialog to add photos
			pwddetailschanged = 'yes';	
			photoDialog.show();
    });
   
   row6.add(newPWDphoto);
   row6.add(labelPWDName);
   row6.add(btnSave1); 
   row6.add(textfieldPWDName);
   user_tbl_data_top.push(row6);

	function retainfiledetails(newImage) {
		imagetosave = newImage; // an actual image (.png file)
	};

photoDialog.addEventListener('click',function(e)
	{	
		Ti.API.info('You selected ' + e.index);
    	if(e.index == 0)
    	{
     	//from the camera
     	Titanium.Media.showCamera({
            success:function(event)
        		{	// get image details and retain them
    	
        		var newImage = event.media; 				
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
					{	if (pwddetailschanged == 'yes') {	
						newPWDphoto.image = newImage;
						}
						else{
							if (carerdetailschanged == 'yes') {	
								newcarerphoto.image = newImage;
							};
						};
						retainfiledetails(newImage);					
					
                	}
				},
            	cancel:function()
            	{//alert('cancelled from camera');
                	// do nothing
            	},
            error:function(error)
            	{
                // create alert
                var a = Titanium.UI.createAlertDialog({title:'Camera'});
 
                	// set message
                	if (error.code == Titanium.Media.NO_CAMERA)
                	{
                    	a.setMessage('Device does not have image recording capabilities');
               	 	}
                	else
                	{
                    a.setMessage('Unexpected error: ' + error.code);
                	}
 
                // show alert
                	a.show();
            	},
            	allowImageEditing:true,
            	saveToPhotoGallery:false
        	});
    	}
    	else if(e.index == 1)
    	{
     		//obtain an image from the gallery
    		 Titanium.Media.openPhotoGallery({

        	success:function(event)
        		{
 				// get image details and retain them
		    	
        		var cameraImage = event.media; 				
					if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
					{	Ti.API.info('photo selected');
					
						if (pwddetailschanged == 'yes') {	
							newPWDphoto.image = cameraImage;
						}
						else{
							if (carerdetailschanged == 'yes') {	
								newcarerphoto.image = cameraImage;
							};
						};
						retainfiledetails(cameraImage);	
						Ti.API.info('photo details retained');				
					//alert('image selected');
					
                	}
       		 	},
        	cancel:function()
        		{
            //user cancelled the action fron within
            //the photo gallery
        		}
    		});
   		}
  		else 
   		{
   		//cancel was tapped
   		//user opted not to choose a photo
   		}
});

function editUser(editusertype, newUsername, newUserphoto){
	//TODO write code here to save user details
	alert(editusertype+newUsername+newUserphoto);
};

var row7 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
	selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
});
    
    	
var labelCarerName = Titanium.UI.createLabel({
		top: 0,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 220,
		text: 'Carer Name:'
});
    
    var newcarerphoto = Ti.UI.createImageView({
		height:180,
		width: 180,
		//borderWidth:10,
		left: '10',
		bottom: 0,
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
		borderRadius:10,       //for rounded corners
		canScale:false, 
		//image: 'images/carer_photo.png',
		//image: Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, '/users/'+'pwd_photo.png')
	}); 
	
	var textfieldCarerName = Titanium.UI.createTextField({
		//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
    	top:70,
    	width: '360',
    	left: '220',
    	height: 40, 
    	clearOnEdit : true,
    	color: Ti.App.Properties.getString('appfontcolor'),
    	font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
    	borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
    	borderRadius: 6,    
    	hintText:'Type your name',
   		// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	textfieldCarerName.addEventListener('change', function(e) { 
		carerdetailschanged = 'yes';	
	});
	
	var labelSave2 = Ti.UI.createLabel({
        text: 'Save',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
        bottom: 10
    // width:200   
    });
    
	var btnSave2 = Ti.UI.createButton({
		backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
		right: 20,
		top: '10',
		//left: '640',
		width: 150,
    	height: 100, 
		borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	color: '#fff'
	});
	
	var imageSave2 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/save_white.png'
    });
	
	btnSave2.add(imageSave2);
	
	btnSave2.add(labelSave2);
	
	btnSave2.addEventListener('click',function(e)
	{ 
    		if (textfieldCarerName.value != '' && newcarerphoto.image != '')
    		{
       		// send details to database
       		// TODO save new photo to Application directory 
       			if (carerdetailschanged == 'yes'){
    				deleteUser(carerdata[0].id);
    				if (imagetosave != ''){
    					saveimage(imagetosave, 'carer_photo.png'); //actual image and filename
    				};
    				var newuser = insertUser('email', textfieldCarerName.value, '1234', 'carer_photo.png', 'Carer', '', '');
    				carerdata = getMainUser('Carer');
       				carerdetailschanged = 'no';
       				imagetosave = '';
       			}; 
       			savedDialog.show();    			
    		}
    		else
   		 	{
    	   		 alert("Username and photo required");
    		};
 	});	
 		   
	var btnPushUp = Ti.UI.createImageView({
		image: 'images/arrow_up_black.png',
		bottom: 0
	});
	
    newcarerphoto.addEventListener('touchstart', function() {
    });
 
    newcarerphoto.addEventListener('touchend', function() {
    	// do something
    });
    
    newcarerphoto.addEventListener('click',function(e){
			//show dialog to add photos
			carerdetailschanged = 'yes';
			photoDialog.show();
    });
    
    //row7.add(btnPushUp); 
    row7.add(btnSave2); 
    row7.add(newcarerphoto);
    row7.add(labelCarerName);
    row7.add(textfieldCarerName);
    user_tbl_data_bottom.push(row7);
    
    var row8 = Ti.UI.createTableViewRow({
		backgroundColor: 'transparent',
		selectedBackgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
		selectedColor: Ti.App.Properties.getString('appbkgrdcolor')
	});
	
	var btnAdmin = Ti.UI.createButton({
		image: 'images/arrow_down_black.png',
		height: 90,
		bottom: 90,
		width: Ti.UI.FILL,
    	backgroundColor:'#FFF'
	});
	
	var labelAdminUp = Ti.UI.createLabel({
        text: 'Only click if you are an administrator',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'}
    // width:200   
    });
	
	var btnAdminUp = Ti.UI.createButton({
		backgroundColor:'#FF0000',
		height: 90,
		bottom: 0,
		width: Ti.UI.FILL,
		borderColor: '#FF0000',
    	backgroundColor:'#FF0000',
    	borderRadius: 6,
    	borderWidth: '10',
	});
	
	btnAdminUp.addEventListener('click',function(){
		Ti.App.fireEvent('app:manageClicked');   
	});
	
	btnAdminUp.add(labelAdminUp);
    row8.add(btnAdmin);
    row8.add(btnAdminUp);
    user_tbl_data_bottom.push(row8);
// now assign that array to the table's data property to add those objects as rows
var user_table_top = Titanium.UI.createTableView({
	top: 150,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	visible: true,
	width: '100%',
	height: '180',
	rowHeight: '180',
    data:user_tbl_data_top,
    scrollable: false     
});

// 2 labels - height 70 each- 1 at top and 1 at bottom of table

var labelDetails = Titanium.UI.createLabel({
		top: 125,
		width:'100%',
		backgroundColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		font:{fontSize:Ti.App.Properties.getString('btnfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 0,
		text: 'Main User'
});	

 // now assign that array to the table's data property to add those objects as rows
var user_table_bottom = Titanium.UI.createTableView({
	top: '150',
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '100%',
	visible:false,
	rowHeight: '180',
	Height: '180',
    data:user_tbl_data_bottom,
    scrollable: true      
});

//add data to tables and tables to window here...		
user_table_top.setData(user_tbl_data_top);
user_table_bottom.setData(user_tbl_data_bottom);
userstableholder.add(user_table_top);
userstableholder.add(user_table_bottom);
//userstableholder.add(labelDetails);


var labelPushUp = Titanium.UI.createLabel({
		bottom: 0,
		backgroundColor: 'transparent',
		width: '100%',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color: Ti.App.Properties.getString('appfontcolor'), 
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		text: 'Click on your Photo or Name to Change Details'
});

userstableholder.add(labelPushUp);

loginWindow.add(usersdetailview);	
// this is the view for the goodbye screen; when they have pressed exit and answered question..


var goodbyedetailview = Ti.UI.createView({
	//  view that appears when user wants to exit
	top: 0,		
	width: Ti.UI.FILL,
	height: Ti.UI.FILL,
	backgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	visible:  'false'
});
	
goodbyedetailview.addEventListener('click', function(e){
		// go to user details
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Wake Up App', GetDateTime(), 'N');
		Ti.App.Properties.setString('sessionstatus', 'passive'); 
		setView(1);
		//Ti.App.fireEvent('app:homeClicked');  
});

var labelGoodbye = Titanium.UI.createLabel({
	top: '30%',
	backgroundColor: 'transparent',
	color: Ti.App.Properties.getString('appbkgrdcolor'),
	width: '100%',
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER, 
	font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
	text: 'Thank you! Goodbye...'
});

var labelStartAgain = Titanium.UI.createLabel({
	top: '50%',
	backgroundColor: 'transparent',
	color: Ti.App.Properties.getString('appbkgrdcolor'),
	width: '100%',
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER, 
	font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
	text: 'Tap the screen to start again.'
});

goodbyedetailview.add(labelGoodbye);
goodbyedetailview.add(labelStartAgain);
	
loginWindow.add(goodbyedetailview);	

	 
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

function setLoginTab(){
		try{// open or create a DB and table users, get records from user table
			userdata = getUsers();
			if (userdata.length == 0) {
				// this it the fist time using the App so create an Intervention table
				 var interId = insertIntervention('N', 'none', 'none');
				 alert('New intervention set up');
				 Ti.App.Properties.setString('appstatus', 'active');
				//no records in the DB first use of system
				Titanium.API.info('No records in user DB'); 
				Ti.API.info(Ti.App.Properties.getString('currentUser'));
				Ti.API.info(Ti.App.Properties.getString('currentPic'));
				Ti.API.info(Ti.App.Properties.getString('currentUserType'));
		 		//  so we create a user record for Admin... 
		 		var adminId = insertUser('email', Ti.App.Properties.getString('currentUser'), '1234', Ti.App.Properties.getString('currentPic'), Ti.App.Properties.getString('currentUserType'), 'flickr', 'youtube');		 		
		 			// the very first time the App is launched this message will appear
					alert('New admin account successfully created!');
				var tempPWDId = insertUser('email', 'PWD', '1234', 'pwd_photo.png', 'PWD', 'flickr', 'youtube');
				// The very first time, need to get pwd_photo.png from resources and save to AppDirectory 
					//var tempuserphoto = getUserPhoto('pwd_photo.png', Ti.Filesystem.resourcesDirectory, 'images');
					//Pass in photo and save to the AppDirectory
					// passes back an actual imagefile -  not filename
					// newdirectory should be filepath: Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'users/'
					//saveUserPhoto(tempuserphoto, 'pwd_photo.png');  //pass in the actual image and the name you want to call the image
					getandsaveUserPhoto('pwd_photo.png', Ti.Filesystem.resourcesDirectory, 'images');
					alert('New Main account successfully created!');
 				var tempCarerId = insertUser('email', 'Carer', '1234', 'carer_photo.png', 'Carer', 'flickr', 'youtube');
 				// TODO save carer_photo.png to AppDirectory	
 				getandsaveUserPhoto('carer_photo.png', Ti.Filesystem.resourcesDirectory, 'images');
 				alert('New carer account successfully created!');   
 				var newanswer = insertAnswer('PWD', Ti.App.Properties.getString('currentDevice'), '0', 'No Response', 'not applicable');
				var newanswer = insertAnswer('Carer', Ti.App.Properties.getString('currentDevice'), '0', 'No Response', 'not applicable');
				
					alert('2 New answers set up');
					// set the visible view to users - number 3
					setView(3);
			}
			else {//there are records in the DB 
			if  (Ti.App.Properties.getString('sessionstatus') == 'active') {
				// someone has been using the system so do not change screen
				setView(4);
			// do nothing
			}
			else {
				// check if there is a record for intervention. App sttus defaults to passive, unless record says 'Y'
				//	Ti.App.Properties.setString('appstatus', 'passive');
					var interventionstatus = getInterventions();
					Ti.API.info('interventionstatus open');
					if (interventionstatus.length == 0) {
						// no intervention record has been set up so set one up now
						var interId = insertIntervention('N', 'none', 'none');
						Ti.API.info('add new interventionstatus');
					}
					else {
						if (interventionstatus[0].started == 'Y') {
							Ti.App.Properties.setString('appstatus', 'active');
							Ti.API.info('interventionstatus Y and appstatus active');
						};
					};
					maindata = getMainUser('PWD');
						if (maindata.length == 0) {
						//no record for a main user in the DB so open record for admin
						Ti.App.Properties.setString('currentUser', 'Admin');
						Ti.API.info('current user set to Admin');
						Ti.App.Properties.setString('currentUserType', 'ADMIN');    
 						Ti.App.Properties.setString('currentPic', 'empty_image.png');  
 						Ti.API.info(Ti.App.Properties.getString('currentPic')+Ti.App.Properties.getString('currentUserType')+Ti.App.Properties.getString('currentUser'));	
						// set the visible view to users - number 3
						maindata = insertUser('email', 'PWD', '1234', 'pwd_photo.png', 'PWD', 'flickr', 'youtube');
						getandsaveUserPhoto('pwd_photo.png', Ti.Filesystem.resourcesDirectory, 'images');
						// TODO save pwd_photo.png to AppDirectory
			
						alert('New Main account successfully created!');
						//  then check for carer record
							carerdata = getMainUser('Carer');
							if (carerdata.length == 0) {
								//no record for a main carer in the DB so set the visible view to users - number 3
 								carerdata = insertUser('email', 'Carer', '1234', 'carer_photo.png', 'Carer', 'flickr', 'youtube');	
 							// save carer_photo.png to AppDirectory
 								getandsaveUserPhoto('carer_photo.png', Ti.Filesystem.resourcesDirectory, 'images');
 								alert('New carer account successfully created!');
							}
						setView(3);	
						}
						else
						{	// there is a main user record
							Titanium.API.info('Open main user record'); 
							Ti.App.Properties.setString('currentUser', maindata[0].username);
							Ti.API.info(Ti.App.Properties.getString('currentUser')); //PWD -> indicates that there is a main user
							Ti.App.Properties.setString('currentUserType', maindata[0].mainuser);// get from maindata[0].
							Ti.API.info(Ti.App.Properties.getString('currentUserType'));
							Ti.App.Properties.setString('currentPic', maindata[0].photo);
							Ti.API.info(Ti.App.Properties.getString('currentPic'));
						
							//  check for carer record
							carerdata = getMainUser('Carer');
							if (carerdata.length == 0) {
								//no record for a main carer in the DB so set the visible view to users - number 3
 								carerdata = insertUser('email', 'Carer', '1234', 'carer_photo.png', 'Carer', 'flickr', 'youtube');	
 								// TODO save carer_photo.png to AppDirectory
 								getandsaveUserPhoto('carer_photo.png', Ti.Filesystem.resourcesDirectory, 'images');
 								alert('New carer account successfully created!');
 						
								setView(3);	
							}
							else
							{	//there is a record for a main user and main carer in the DB so set the visible view to main - number 3
								// check intervention status to see if there is an ongoing intervention taking place
								Titanium.API.info('Open main carer record'); 
								var currentintervention = getIntervention('Y');
								if (currentintervention.length == 0) {
									Titanium.API.info('Intervention not started'); 
									setView(3);
								}
								else {
									setView(1);
								};
							};
						};
				};
			};	
		} catch(e){
			// failed to open DB
			Titanium.API.info('Failed to open DB'); 
    		Ti.App.Properties.setString('currentUser', 'Admin');
			Ti.API.info(Ti.App.Properties.getString('currentUser'));
			Ti.App.Properties.setString('currentUserType', 'ADMIN');
			Ti.API.info(Ti.App.Properties.getString('currentUserType'));
			Ti.App.Properties.setString('currentPic', 'empty_image.png');
			Ti.API.info(Ti.App.Properties.getString('currentPic'));
    		
		};
	};
	
	loginWindow.addEventListener('open', function(e){
		//happens on first launch of App from closed but not when App gets focus
		if (Ti.App.Properties.getString('sessionstatus') == 'passive') {
			//setLoginTab();
		}
		else{ 		
			setLoginTab();
		}
	});
	
	function ManageAuditLog(){
		auditlogs = getAuditlogs();
		//archive, send email and delete
		var AuditArchivetext = '';
		if (auditlogs.length > 0) {
			Ti.API.info('There is data to be archived.');
			for(i = 0; i < auditlogs.length; i++){ 
				AuditArchivetext = AuditArchivetext+auditlogs[i].usertype;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].platformid;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].control;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].exacttime;
				AuditArchivetext = AuditArchivetext+','+auditlogs[i].sent;
				AuditArchivetext = AuditArchivetext+',';
				//back it up to archivelog
				insertArchivelog(auditlogs[i].usertype, auditlogs[i].platformid, auditlogs[i].control, auditlogs[i].exacttime, auditlogs[i].sent);
				
			};
			var archiveDataDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'archiveData');
		
			if (! archiveDataDir.exists()) {
    			archiveDataDir.createDirectory();
			}

		// .resolve() provides the resolved native path for the directory.
		var file  = Ti.Filesystem.getFile(archiveDataDir.resolve(), 'archiveData.txt');
		file.write(file.read()+AuditArchivetext);
		// TODO send to archive and delete file
		Ti.API.info('Archiving data');

    	try {
    		    	
		var email = {
    		to:      Ti.App.Properties.getString('EmailAddress'),// 'aideen@3advance.com', email_to_address,
    		from:     'InspiredApp2015',  //email_from_address,
   		 	subject:  'InspiredApp User Interactions '+Ti.App.Properties.getString('currentDevice'),  //email_subject,
    		text:     AuditArchivetext,  //email_message_text
    		files: file
		};
		var message = sendgrid.Email(email);

		sendgrid.send(message, function(e) {
    		if (e) {
        		console.log(JSON.stringify(e));
        		alert(e.errors[0]);
    		}else{
       		 	//alert('Message sent');
       		 	deleteAllAuditlogs();
    		}
		});
				
		} catch(e){
		 alert('Audit logs not recorded, please contact IT support!');
		 
		}; 
			
			
			
		};
	};

	    return loginWindow;

};
module.exports = LoginWindow;
