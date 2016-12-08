// no pop up questions when intervention is over
// here is where you put any reference to external code that Videos Window might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');
//TODO display all the saved videos!!
function VideosWindow(title){
	Ti.include('ui/common/database.js');
    var videosWindow = Ti.UI.createWindow({
				//title:'Hello '+Ti.App.Properties.getString('currentUser'),
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		TabBarHidden: true,
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});
// Create an array of explicitly defined custom TableViewRows
var AddVideoWindow = require('ui/tablet/AddVideo'); 
var videowindow = new AddVideoWindow(L('videos'));
var videosRetrieved = 'no';
var videodir = 'videos';
var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + videodir; // photodir is Family or Friends...
Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;
var VideoViewerWindow = require('ui/tablet/VideoViewer');
var OnlineVideoViewerWindow = require('ui/tablet/OnlineVideoViewer');

	// get tab group object
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
		text: 'Videos',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	var btnLeft = Ti.UI.createImageView({
		//image: 'images/users_black.png',
		backgroundColor: '#ECC10D', //yellow
    	borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#ECC10D', //yellow
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
	
	btnLeft.addEventListener('click',function(e){
		// add videos
		//TODOalert('check time elapsed');
		//Ti.App.Properties.setString('Time_Elapsed', GetDateTime());
		videosRetrieved = 'no';
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Add New Video', GetDateTime(), 'N');
  		Ti.API.info('add new video clip');
		videowindow.open(title);
	});

	videosWindow.addEventListener('open', function(e){
		//happens on first launch of App from closed but not when App gets focus
		getMovies();
	});


	var btnRight = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B',//purple
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
		//TODOalert('check time elapsed');
		//Ti.App.Properties.setString('Time_Elapsed', GetDateTime());
		Ti.App.fireEvent('app:homeClicked'); 
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Exit Videos', GetDateTime(), 'N');
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
        //image: 'images/search_white.png'
        image: 'images/online_white.png'
    });
    
    var labelCentre = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Online',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnCentre.add(imageCentre);
    btnCentre.add(labelCentre);
    
    btnCentre.addEventListener('click',function(e){
    	 if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'No connection. Show Online Videos', GetDateTime(), 'N'); 
			alert('no internet connection');
   			
		} else {
   			Titanium.API.info(' connection present ');// show online video window
			var onlinevideoviewerwin = new OnlineVideoViewerWindow(L(title));
 			onlinevideoviewerwin.open(title);
  			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Generic Video', GetDateTime(), 'N'); 
		}	 
    	
  });
	
	header.add(labelTitle);
			
 	var subheader = Ti.UI.createView({
		top: 0,
		width: '100%',
		height:125,
		backgroundColor: 'transparent'
	});
 	
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
	
	var detailview = Ti.UI.createView({
		top: 125,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: 'transparent',
	});
	
	videosWindow.titleControl = header;
	videosWindow.add(detailview);
	videosWindow.add(subheader);
	
	///////// getMovies /////////////
// look in database and find the name of all the videos in the App, if you can find a matching image file and a corresponding .mp4 file, create a row and put DB details in that row, otherwise, do not add this on to the tables
function getMovies(){
	//load all video details from DB into moviedetails
	
	detailview.removeAllChildren();
	var displayimage = 'images/empty_image.png';
	var tbl_data_left = [];
	var tbl_data_right = [];
 // now assign that array to the table's data property to add those objects as rows
	var table_left = Titanium.UI.createTableView({
		left: 0,
		backgroundColor: 'transparent',
		separatorColor:'transparent',
		width: '50%',
		height: Ti.UI.FILL,
		//top: 200,
		rowHeight: 280,
    	data:tbl_data_left,
    	scrollable: true      
	});
	
	table_left.addEventListener('click',function(e){
		
	var videoname = e.row.children[1].title+'.mov';
	 	Ti.API.info(videoname);
	 	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Personal Video', GetDateTime(), 'N');
	 	callWindow(videoname);
	 	//playvideo(audioFile, songname, songimage, 'mysound');
	// return index of row and find the video linked to that row  
	 	  
	});
	
	 // now assign that array to the table's data property to add those objects as rows
var table_right = Titanium.UI.createTableView({
	right:0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '50%',
	height: '100%',
	//top: 200,
	rowHeight: 280,
    data:tbl_data_right,
    scrollable: true      
});
 
table_right.addEventListener('click',function(e){
	var videoname = e.row.children[1].title+'.mov';
	 	Ti.API.info(videoname);
	 	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Personal Video', GetDateTime(), 'N');
	 	callWindow(videoname);
	 	//playvideo(audioFile, songname, songimage, 'mysound');
	// return index of row and find the video linked to that row    
	 	  
});
	
	
	Ti.API.info('getting videos!');
	var imgDirectory = Ti.Filesystem.getFile(path);
	
	Ti.API.info('looking in a directory called'+path);
	if (!imgDirectory.exists()){
		imgDirectory.createDirectory();
		filecount = 0;
	}
	else {
		filecount = 0;
		if (imgDirectory.getDirectoryListing().length != null){
			
			var videosArray = imgDirectory.getDirectoryListing();
			filecount = videosArray.length;
			var i = 0;
			//while (i < videosArray.length){
			while (i < filecount){
			Ti.API.info(videosArray[i].toString()); // show name of file
  			for (j = 0; j < 2; j++){
   				if (j == 0){
		
					Ti.API.info(videosArray[i].toString()); // show name of file
  
   				// var videotitle = videodata[i].title; // in the form of raw filename SO no .mp4 or .png/ .jpg extension
   				 // check there is a .mp4 file in videosvideo/videofilename.mp4
   	var videoFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+videodir, videosArray[i]); 			
    if (videoFile != null) { // there is a video file so now check that there is also a .jpg file in videosimage/videofilename.jpg
    var videostr = videosArray[i].toString();
    var strlen = videostr.length;
    var imagename = (videostr.substring(0, (strlen-4)))+'.jpg';
	var moviedetails = [];
    moviedetails = getVideo(videostr.substring(0, (strlen-4))); //using rawfilename
    
		Ti.API.info('Image name: '+imagename);
		
var row1 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
    var image = Ti.UI.createImageView({
        layout: 'horizontal',
        //top: 10,
    	width:60, height:50,
    	backgroundColor: '#b30000',
    	borderColor: '#b30000',//red
    	borderRadius: 6,
    	borderWidth: '10',  
    	image: 'images/play_white.png'
    });
    
    var videoimage = Ti.UI.createImageView({
        layout: 'horizontal',
        //top: 10,
    	width:360, 
    	height: '240',
    	borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
        image:  Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'videothumb', imagename)
        // image: 'images/play_white.png'
    }); 
    var vidlabeltext = '';
    try{
    	 vidlabeltext = vidlabeltext+moviedetails[0].tag1;
    }
    catch(e) {
    	Ti.API.info('Cannot find video label');
    };
        var videolabel = Titanium.UI.createLabel({
				//TODO	text: videostr.substring(0, (strlen-4)),
					text: vidlabeltext,
					//text: moviedetails[0].tag1,
					font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
					backgroundColor: 'transparent',
					color: Ti.App.Properties.getString('appfontcolor'),
  					right: 80,
  					//width: '60%',
					bottom: 0
				});
    
    var button1 = Ti.UI.createButton({
    	title: videostr.substring(0, (strlen-4)),
   		color: '#fff',
        //width: '360',
        width:240, 
    	height: '180',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	//right: 25,
    	left: '15%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button1.addEventListener('touchstart', function() {
        button1.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button1.addEventListener('touchend', function() {
        button1.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
     var buttonUp1 = Ti.UI.createLabel({
    	bottom:0,
    	right: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageUp1 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_up_black.png'
    });
   
   	buttonUp1.add(imageUp1);  
    button1.add(videoimage);
    button1.add(image);
    row1.add(buttonUp1);
    row1.add(button1);  
    row1.add(videolabel); 
    tbl_data_left.push(row1);
     
    }
	}
	else {
    if (i < filecount){
    var videoFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+videodir, videosArray[i]); 			
    if (videoFile != null) { // there is a video file so now check that there is also a .jpg file in videosimage/videofilename.jpg
    var videostr = videosArray[i].toString();
    var strlen = videostr.length;
    var imagename = (videostr.substring(0, (strlen-4)))+'.jpg';
    var moviedetails = [];
    moviedetails = getVideo(videostr.substring(0, (strlen-4))); //using rawfilename
    
		Ti.API.info('Image name: '+imagename);
		
		
  var row5 = Ti.UI.createTableViewRow({ 
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});

      var image5 = Ti.UI.createImageView({
        layout: 'horizontal',
        //top: 10,
    	width:60, height:50,
    	backgroundColor: '#b30000',
    	borderColor: '#b30000',//red
    	borderRadius: 6,
    	borderWidth: '10',  
    	image: 'images/play_white.png'
    });
        
    var videoimage5 = Ti.UI.createImageView({
        layout: 'horizontal',
        //top: 10,
    	width:360, 
    	height: '240',
    	borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
        image:  Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+'videothumb', imagename)
        // image: 'images/play_white.png'
    });
    
    
    var button5 = Ti.UI.createButton({
    	title: videostr.substring(0, (strlen-4)),
        color: '#fff',
    	width:240, 
    	height: '180',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	//left: 25,
    	right: '15%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button5.addEventListener('touchstart', function() {
        button5.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button5.addEventListener('touchend', function() {
        button5.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonDown5 = Ti.UI.createLabel({
    	bottom:0,
    	left: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageDown5 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_down_black.png'
    });
    var videolabeltext = '';
    try{
    	 videolabeltext = videolabeltext+moviedetails[0].tag1;
    }
    catch(e) {
    	Ti.API.info('Cannot find video label');
    };
       var videolabel5 = Titanium.UI.createLabel({
					text: videolabeltext,
					font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
					backgroundColor: 'transparent',
					color: Ti.App.Properties.getString('appfontcolor'),
  					left: 80,
  					//width: '60%',
					bottom: 0
				});
   
   	buttonDown5.add(imageDown5);  
    button5.add(videoimage5);  
    button5.add(image5);
    row5.add(buttonDown5);
    row5.add(button5);
    row5.add(videolabel5); 
    tbl_data_right.push(row5);
    
  	};
	};
	};
	videosRetrieved = 'yes';
	Ti.API.info(videosRetrieved);
	
		i++; // increment in for loop
	};	
		//i++; // increment for while loop
	};
	
		//add data to tables and tables to window here...		
	table_left.setData(tbl_data_left);
	detailview.add(table_left);
	//add data to tables and tables to window here...		
	table_right.setData(tbl_data_right);
	detailview.add(table_right);
			
		};
	};
};
	
//////////end of getMovies	//////////////

	
	videosWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Tab changed to '+title);
    	if (videosRetrieved == 'no') {
			getMovies();
		};
	
    	if ( Ti.App.Properties.getString('currentUserType') == 'PWD'){
			btnLeft.visible = false;
			btnCentre.visible = true;
		}
		else 
		{
			btnLeft.visible = true;
			btnCentre.visible = false;
		};		
		
	/*	if (Ti.App.Properties.getString('Question_Asked') == 'No'){//first see if a question has been asked in this session yet
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
			//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Pop up Question', GetDateTime(), 'N');	 
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

	//// beginning copied code from photos

function callWindow(videotoshow){
	var videoviewerwin = new VideoViewerWindow(L(videotoshow));
 		videoviewerwin.open(videotoshow);	
};

function callWindowold(){
	if (num == 0){
		//insertAuditlog(Ti.App.Properties.getString('currentUser'), Ti.App.Properties.getString('currentDevice'), 'VideoViewer', GetDateTime(), 'N');
		var videoviewerwin = new VideoViewerWindow(L('videos/A city dreaming.mp4'));
 		videoviewerwin.open('videos/A city dreaming.mp4');	
	};
 };
	
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
	
	return videosWindow;

};
module.exports = VideosWindow;


