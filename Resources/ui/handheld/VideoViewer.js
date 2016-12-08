
// here is where you put any reference to external code that PhotoViewerWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');

function VideoViewerWindow(title){

    var videoViewerWindow = Ti.UI.createWindow({
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});

	videoViewerWindow.addEventListener('open', function() {
	//	Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;
	 	//Ti.API.info('Set Audio session category for Video - title:'+title);
	 	playMovie(title);
	 	//playMovie('videos/Singing in the Rain.mp4');
	});

// may need this Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;

	// get tab group object
	var tabGroup = Titanium.UI.currentTabGroup;
	var videodir = 'videos';
	var header = Ti.UI.createView({
		top: 0,
		width: Ti.UI.FILL,
		height:  Ti.UI.FILL,
		backgroundColor: 'transparent'
	});
	
	var detailview = Ti.UI.createView({
		top: 0,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: Ti.App.Properties.getString('appbkgrdcolor') //white
	});
	
	videoViewerWindow.titleControl = header;
	videoViewerWindow.add(detailview);
	
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
		videoViewerWindow.close();
  	//	insertAuditlog(Ti.App.Properties.getString('currentUser'), Ti.App.Properties.getString('currentDevice'), 'Video Viewer', GetDateTime(), 'N');
	});
	
	var btnCentre = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#0D4F8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',
		width: 150,
    	height: 100, 
		//left: 200
	});
	
	var imageCentre = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/settings_white.png'
    });
    
    var labelCentre = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Settings',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnCentre.add(imageCentre);
    btnCentre.add(labelCentre);
	
	btnCentre.addEventListener('click',function(e){// exit photos
		//show view to search photos
  	//	insertAuditlog(Ti.App.Properties.getString('currentUser'), Ti.App.Properties.getString('currentDevice'), 'Settings', GetDateTime(), 'N');
	});


	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: title+' ...now playing',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appbkgrdcolor')}
	});
	
	header.add(labelTitle);
	
	var buttonViewTop = Ti.UI.createView({
 		backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	detailview.add(buttonViewTop);

	buttonViewTop.add(btnRight);
	//buttonViewTop.add(btnLeft);
	//buttonViewTop.add(btnCentre);
	
	
	// play video
	var movieDisplayView = Ti.UI.createView({
	backgroundColor: '#fff',
	top: 125,
	left: 0,
	height:'90%',
	width: Ti.UI.FILL
	});

	detailview.add(movieDisplayView);

	function playMovie(movieFile){ 
		
	var movietoplay = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+videodir, movieFile); 
	
	var activeMovie = Titanium.Media.createVideoPlayer({
        url : movietoplay,
       // volume: '1.0',
       // url : movieFile,
        backgroundColor : Ti.App.Properties.getString('appbuttoncolor'),
        mediaControlMode : Titanium.Media.VIDEO_CONTROL_DEFAULT,
        scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FILL,
        height:Ti.UI.FILL,
		width: Ti.UI.FILL,
        fullscreen : false,
        autoplay : true
    });
    
    if (Ti.App.Properties.getString('Volume') == 'Normal') {
		activeMovie.volume = '.8';
	}
	else {
		activeMovie.volume = '1.0';
	};
    
    activeMovie.addEventListener('click', function() {
    	if (labelClose.text == 'Stop') {
			activeMovie.pause();
			labelClose.text = 'Play';
			imageClose.image = 'images/arrow_right_black.png'
			text: title+' ...paused';	
		}
		else {
			activeMovie.play();
			labelClose.text = 'Stop';
			imageClose.image = 'images/cross_black.png';
			text: title+' ...now playing';
		}
    });
    
	movieDisplayView.add(activeMovie);
    var closeButton = Ti.UI.createButton({
        backgroundColor: '#ECC10D',
    	borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#ECC10D',
    	borderWidth: '5',
    	font: {fontSize:30, fontFamily:'Verdana'},
    	width: 150,
    	height: 100, 
		left: 20
    	
    });
    
     var labelClose = Ti.UI.createLabel({
        text: 'Stop',
        color: Ti.App.Properties.getString('appfontcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    var imageClose = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/cross_black.png'
    });
    
    closeButton.add(imageClose);
    closeButton.add(labelClose);
    closeButton.addEventListener('click', function() {
    	//stop video if playing, start video is stopped
		//text: title+' ...paused';
		//text: title+' ...now playing';
		if (labelClose.text == 'Stop') {
			activeMovie.pause();
			labelClose.text = 'Play';
			imageClose.image = 'images/arrow_right_black.png';
			text: title+' ...paused';	
		}
		else {
			activeMovie.play();
			labelClose.text = 'Stop';
			imageClose.image = 'images/cross_black.png';
			text: title+' ...now playing';
		}
    });
    
	buttonViewTop.add(closeButton);
};	
	//end code to play video
	
	
	videoViewerWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Tab changed to '+title);
	});
	
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

	return videoViewerWindow;

};
module.exports = VideoViewerWindow;