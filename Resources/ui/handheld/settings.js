
// here is where you put any reference to external code that SettingsWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');

function SettingsWindow(title){


    var settingsWindow = Ti.UI.createWindow({
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		TabBarHidden: true,
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});

	// get tab group object
	var tabGroup = Titanium.UI.currentTabGroup;
	
	var header = Ti.UI.createView({
		top: 0,
		width: Ti.UI.FILL,
		height:  Ti.UI.FILL,
		backgroundColor: 'transparent'
	});
	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: 'Settings',
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
        text: 'Back',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnExit.add(imageExit);
    btnExit.add(labelExit);
    
    btnExit.addEventListener('click',function(e){
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Back to Home Screen', GetDateTime(), 'N');
       	Ti.App.fireEvent('app:homeClicked'); 
	});


	var buttonView = Ti.UI.createView({
	    backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	//buttonView.add(btnUsers);
	buttonView.add(btnExit);
	
	detailview.add(buttonView);
	
	settingsWindow.add(detailview);
	
	settingsWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Tab changed to '+title);
    
    	if (Ti.App.Properties.getString('Volume') == 'Max'){
    		labelVolume.text = 'Turn Sound Off';
    	}
    	else{
    		labelVolume.text = 'Turn Volume Up';
    	};
	});
	
var imageVolume = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/volume_white.png'
    });
    
    var labelVolume = Ti.UI.createLabel({
        text: 'Volume Up',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    
    
    var buttonVolume = Ti.UI.createButton({
   		color: '#fff',
        bottom: '30%',
        width:260, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '6',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    buttonVolume.addEventListener('touchstart', function() {
        buttonVolume.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    buttonVolume.addEventListener('touchend', function() {
        buttonVolume.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });

	buttonVolume.add(imageVolume);
    buttonVolume.add(labelVolume);
    
    var volumeDialog = Titanium.UI.createOptionDialog({
  	    title: 'Volume Changed...',
    	options: ['OK']
	});	
    
    volumeDialog.addEventListener('click',function(e)
	{	
		if (Ti.App.Properties.getString('Volume') == 'Max'){ //turn off sound
			Ti.App.Properties.setString('Volume', 'Mute');
    		labelVolume.text = 'Turn Volume Up';
    	}
    	else{ // turn to full volume
    		Ti.App.Properties.setString('Volume', 'Max');
    		labelVolume.text = 'Turn Sound Off';
    	};
		
		
	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Volume Control - Back to Home Screen', GetDateTime(), 'N');
       	Ti.App.fireEvent('app:homeClicked'); 
	});
    
    buttonVolume.addEventListener('click',function(e){
    	volumeDialog.show();
    });

	detailview.add(buttonVolume);
	var labelPhoto = Titanium.UI.createLabel({
		top: 140,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 210,
		text: 'Online Photo Link:'
	});

	var textfieldPhoto = Titanium.UI.createTextField({
	//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
		top:145,
    	width: '380',
    	left: '370',
    	height: 40, 
    	color: Ti.App.Properties.getString('appfontcolor'),
    	clearOnEdit : true,
    	//font: Ti.App.Properties.getString('appfontsize'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    	borderRadius: 6,    
    	hintText:'Photo link',
   	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	var labelVideo = Titanium.UI.createLabel({
		top: 140,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 210,
		text: 'Online Video Link:'
	});

	var textfieldVideo = Titanium.UI.createTextField({
	//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
		top:145,
    	width: '380',
    	left: '370',
    	height: 40, 
    	color: Ti.App.Properties.getString('appfontcolor'),
    	clearOnEdit : true,
    	//font: Ti.App.Properties.getString('appfontsize'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    	borderRadius: 6,    
    	hintText:'Video link',
   	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	
		var labelMusic = Titanium.UI.createLabel({
		top: 140,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 210,
		text: 'People:'
	});

	var textfieldMusic = Titanium.UI.createTextField({
	//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
		top:145,
    	width: '380',
    	left: '370',
    	height: 40, 
    	color: Ti.App.Properties.getString('appfontcolor'),
    	clearOnEdit : true,
    	//font: Ti.App.Properties.getString('appfontsize'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    	borderRadius: 6,    
    	hintText:'Video link',
   	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	textfieldPhoto.value = ''; 
	textfieldVideo.value = '';  
	textfieldMusic.value = ''; 
	
	
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
	
	return settingsWindow;

};
module.exports = SettingsWindow;