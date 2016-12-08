
function PhotoViewerWindow(title){

    var photoViewerWindow = Ti.UI.createWindow({
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});

var AddPhotoWindow = require('ui/tablet/AddPhoto');
var familywindow = new AddPhotoWindow(L('Family'));
var friendswindow = new AddPhotoWindow(L('Friends'));
var workwindow = new AddPhotoWindow(L('Work'));
var hobbieswindow = new AddPhotoWindow(L('Hobbies'));
var eventswindow = new AddPhotoWindow(L('Events'));
var placeswindow = new AddPhotoWindow(L('Places'));
var otherwindow = new AddPhotoWindow(L('Other'));

var rawfilename = '';
var picturesRetrieved = 'no';
var sound;
var filecount = 0;
var file;

Titanium.Media.audioSessionCategory = Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;

var audiodir = 'audios';
var audiopath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + audiodir; 
var photodir = title;

	// get tab group object
	var tabGroup = Titanium.UI.currentTabGroup;
	
	var header = Ti.UI.createView({
		top: 0,
		width: Ti.UI.FILL,
		height:  Ti.UI.FILL,
		backgroundColor: 'transparent'
	});
	
	var subheader = Ti.UI.createView({
		top: 0,
		width: '100%',
		height:125,
		backgroundColor: 'transparent'
	});
	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: title+' Photos',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appbkgrdcolor')}
	});
	
	
	var btnLeft = Ti.UI.createImageView({
		//image: 'images/users_black.png',
		backgroundColor: '#ECC10D',
    	borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#ECC10D',
		width: 150,
    	height: 100, 
		left: 20
	});
	
	var imageLeft = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/new_black.png'
    });
    
    var labelLeft = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Add',
        color: Ti.App.Properties.getString('appfontcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLeft.add(imageLeft);
    btnLeft.add(labelLeft);
	
	btnLeft.addEventListener('click',function(e){// exit photos
		//show view to add photos
		picturesRetrieved = 'no';
		callWindow(title);
	});
	
	function callWindow(name){
  	if (name == "Family") {// add family photos chosen
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add Family Photos', GetDateTime(), 'N');
  		Ti.API.info('add family photos');
		//familywindow.open({modal:true});
		familywindow.open(title);
	} 
	if (name == "Friends") {		     
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add Friends Photos', GetDateTime(), 'N');
        photoViewerWindow.close();
        friendswindow.open(title);
	}	
	if (name == "Work") {
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add Work Photos', GetDateTime(), 'N');	  
		photoViewerWindow.close();
		workwindow.open(title);
 	}	
	if (name == "Hobbies") {	
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add Hobbies Photos', GetDateTime(), 'N');
		photoViewerWindow.close();
		hobbieswindow.open(title);                
	}	
	if (name == "Events") {	
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add Events Photos', GetDateTime(), 'N');	 
		 photoViewerWindow.close();
		eventswindow.open(title); 
	}	
	if (name == "Places") {	
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add Places Photos', GetDateTime(), 'N');	 
		 photoViewerWindow.close();
		placeswindow.open(title);
	}	
	if (name == "Other") {	
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add Other Photos', GetDateTime(), 'N');	 
		photoViewerWindow.close();
		otherwindow.open(title);
	}	
	
};		
	
	var btnRight = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B', //purple
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
		width: 150,
    	height: 100, 
		right: 20
	});
	
	var imageRight = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/arrow_left_white.png'
    });
    
    var labelRight = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Back',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnRight.add(imageRight);
    btnRight.add(labelRight);
	
	btnRight.addEventListener('click',function(e){
		// exit photos
		Ti.API.info(Ti.App.Properties.getString('Question_Asked')+' '+GetDateTime().toString());
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+' Photo Exit', GetDateTime(), 'N');
		photoViewerWindow.close();
	});
	
	var btnCentre = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#0D4F8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',
		width: 150,
    	height: 100, 
		left: 20
	});
	
	var imageCentre = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/volume_white.png'
    });
    
    var labelCentre = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Listen',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    	left: 20,
    // width:200   
    });
    
    btnCentre.add(imageCentre);
    btnCentre.add(labelCentre);
	
	btnCentre.addEventListener('click',function(e){
		//play audio clip
		//check sound
		if (Ti.App.Properties.getString('Volume') == 'Mute'){
			alert('Please enable sound');
		} 
		else {
		// play the sound
		Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Play Audio', GetDateTime(), 'N');
		if (sound && sound.playing)
		{
			sound.stop();
			sound.release();
			sound = null;
			btnCentre.title = 'Listen';
		}
		else
		{
			if (filecount >0){	
				//get name of image on scrollview on scrollingview on detailview, whew!!!!
 				var photostr = detailview.children[0].views[detailview.children[0].currentPage].children[0].image.name;
 				var endphotostr = photostr.length-4;
				var photores = photostr.substr(0, endphotostr);
    			rawfilename = photores;
    			btnCentre.title = 'Stop';
    		
  		};
  		try {
			sound = Ti.Media.createSound({
			// TODO get sound file
				volume : '1.0',
				url: audiopath +"/"+rawfilename+'.caf'
			});
				sound.addEventListener('complete', function()
				{
				btnCentre.title = 'Listen';
				});
			Ti.API.info('Volume: '+sound.getVolume().toString());
			sound.play();
		}
		
		catch(e) {
				Ti.API.info('No audio available!');
				//btnCentre.title = 'Listen';
		};
		
		
		}
		};
	});


	header.add(labelTitle);
	
	var buttonViewTop = Ti.UI.createView({
 		backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	
	subheader.add(buttonViewTop);

	buttonViewTop.add(btnRight);
	buttonViewTop.add(btnLeft);
	buttonViewTop.add(btnCentre);
	
	var buttonarrowL = Ti.UI.createLabel({
    	bottom:0,
    	color: '#fff',
    	height: '50',
    	left: 300,
    });
    
    var imagearrowL = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_left_black.png'
    });
   
   	buttonarrowL.add(imagearrowL); 
   	
   	var buttonarrowR = Ti.UI.createLabel({
    	bottom:0,
    	right: 300,
    	color: '#fff',
    	height: '50'
    });
    
    var imagearrowR = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_right_black.png'
    });
   
   	buttonarrowR.add(imagearrowR); 
	
	buttonViewTop.add(buttonarrowR);
	buttonViewTop.add(buttonarrowL);
	
	var detailview = Ti.UI.createView({
		top: 125,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: Ti.App.Properties.getString('appbkgrdcolor') //white
	});
	
	photoViewerWindow.titleControl = header;
	photoViewerWindow.add(subheader);
	photoViewerWindow.add(detailview);
		
	var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + photodir; // photodir is Family or Friends...
	
	photoViewerWindow.addEventListener('open', function(e){
		//happens on first launch of App from closed but not when App gets focus
		getPictures();
		if ( Ti.App.Properties.getString('currentUserType') == 'PWD'){
			btnLeft.visible = false;
			btnCentre.visible = true;
		}
		else 
		{
			btnLeft.visible = true;
			btnCentre.visible = false;
		};
			
	});
		 
 function getPictures(){
	detailview.removeAllChildren();
	rawfilename = '';
	//var filecount = 0;
	var photosView = Ti.UI.createScrollableView({
    	showPagingControl: true,
    	top:0,
    	left: 0,
    	views:[],
    	width: photoViewerWindow.width
	});
      
    photosView.addEventListener('scroll', function(e){
		Ti.API.info('Pic scrolled!');
    });  
      
 	Ti.API.info('getting pictures!');
	var imgDirectory = Ti.Filesystem.getFile(path);
	
	Ti.API.info('looking in a directory called'+path);
	if (!imgDirectory.exists()){
		imgDirectory.createDirectory();
		filecount = 0;
	}
	else {
		filecount = 0;
		if (imgDirectory.getDirectoryListing().length != null){
			var imagesArray = imgDirectory.getDirectoryListing();
			filecount = imagesArray.length;
		}
		else{
			Ti.API.info('no saved pictures!');
			filecount = 0;
		};
	};
 	for(i = 0; i < imagesArray.length; i++){	  
    Ti.API.info(imagesArray[i].toString()); //displays <null> for each element.
	
    var imagefile =Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, photodir+Ti.Filesystem.separator+imagesArray[i].toString());
    
    var img1 = Ti.UI.createImageView({
    	image: imagefile,
    	//height: '100%',
    	//top: 0,
    	left: 0,
  		canScale:true   
	});
	// take .jpg away to get rawfilename and look in db for details
	var photostr = imagesArray[i].toString();
    var strlen = photostr.length;
    var imagename = (photostr.substring(0, (strlen-4))); //rawfilename
	try
	{ 
	  var photodetails = getPhoto(imagename);// matching details found in DB
	  if (photodetails.length == 0) { 
	 	 Ti.API.info('Strange filename');
	 	var photodetails = getPhoto(imagename+'.0');// matching details found in DB
	  };
	  
	try
	{ 
		try {Ti.API.info(photodetails[0].year);
		
		 } catch(e) {
				Ti.API.info('No year text!');
			var phototext = '';
				//btnCentre.title = 'Listen';
		};
		try { Ti.API.info(photodetails[0].tag1);
		
		 } catch(e) {
				Ti.API.info('No tag1 text!');
			var phototext = '';
				//btnCentre.title = 'Listen';
		};
		try { Ti.API.info(photodetails[0].desc);
		
		 } catch(e) {
				Ti.API.info('No desc text!');
			var phototext = '';
				//btnCentre.title = 'Listen';
		};
		var phototext = photodetails[0].year+' '+photodetails[0].tag1+' '+photodetails[0].desc;
	 
	 } catch(e) {
				Ti.API.info('No text!');
			var phototext = '';
				//btnCentre.title = 'Listen';
		};
		
	
	 if (phototext != '  '){
	 	var imagelabel = Titanium.UI.createLabel({
					text: phototext,
					font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
					backgroundColor: '#fff',
					color: Ti.App.Properties.getString('appfontcolor'),
  					//width: '60%',
					bottom: 30
		});
		img1.add(imagelabel);
	};

	var img1Wrapper = Ti.UI.createScrollView({
	contentWidth:Ti.UI.FILL,
    contentHeight:Ti.UI.FILL,
    borderWidth:20,
	borderColor:'#fff',
    left:0,
    backgroundColor: '#fff',
    maxZoomScale:4.0
  	});
  
	img1Wrapper.add(img1);
	photosView.addView(img1Wrapper);
	}
	catch(e) {
			Ti.API.info('No photo in DB!');
	};


};
	picturesRetrieved = 'yes';
	detailview.add(photosView);	
};
  
photoViewerWindow.addEventListener('focus', function(e){
	Ti.API.info('focus on photoviewer');
	if (picturesRetrieved == 'no') {
		getPictures();
	};
	if (Ti.App.Properties.getString('currentUserType') == 'PWD'){
		btnLeft.visible == false;
		btnCentre.visible == true;
	}
	else 
	{
		btnLeft.visible == true;
		btnCentre.visible == false;
	};
/*	if (Ti.App.Properties.getString('Question_Asked') == 'No'){
		if (Ti.App.Properties.getString('Timer_Started') == 0){
			Ti.API.info("Timer started!");
			Ti.App.Properties.setString('Timer_Started', 1);
			//parameters for timer: countDown( minutes, seconds, fn_tick, fn_complete);
		// substitue in below: Ti.App.Properties.getString('T_Minutes'); Ti.App.Properties.getString('T_Seconds');
		var my_timer = new countDown(Ti.App.Properties.getString('T_Minutes'),30, 
		function() {
			//Ti.API.info("Timer counting down!");
		},
		function() {
			Ti.API.info("The time is up!");
			my_timer.stop();
			if (Ti.App.Properties.getString('Question_Asked') == 'No'){
				//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Pop up Question', GetDateTime(), 'N');	 
				//To show the popup window
			
				var modal = require('ui/tablet/popupQuestion').modalWin;
				var popupQuestions = new modal();
				popupQuestions.open();
			};
		}
	);
	
	my_timer.start();
	};
	};*/
});


var countDown =  function( m , s, fn_tick, fn_end  ) {
	return {
		total_sec:m*60+s,
		timer:this.timer,
		set: function(m,s) {
			this.total_sec = parseInt(m)*60+parseInt(s);
			this.time = {m:m,s:s};
			return this;
		},
		start: function() {
			var self = this;
			this.timer = setInterval( function() {
				if (self.total_sec) {
					self.total_sec--;
					self.time = { m : parseInt(self.total_sec/60), s: (self.total_sec%60) };
					fn_tick();
				}
				else {
					self.stop();
					fn_end();
				}
				}, 1000 );
			return this;
		},
		stop: function() {
			clearInterval(this.timer)
			this.time = {m:0,s:0};
			this.total_sec = 0;
			return this;
		}
	}
}
	
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

	
	return photoViewerWindow;

};
module.exports = PhotoViewerWindow;