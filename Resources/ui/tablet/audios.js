// IMPORTANT NOTE For iOS, to adjust the volume of the device, set the volume property of Titanium.Media.appMusicPlayer 
//and set the Titanium.Media.audioSessionMode property to either Titanium.Media.AUDIO_SESSION_MODE_AMBIENT, 
//Titanium.Media.AUDIO_SESSION_MODE_SOLO_AMBIENT, or Titanium.Media.AUDIO_SESSION_MODE_PLAYBACK.


function AudiosWindow(title){

    var audiosWindow = Ti.UI.createWindow({
			//title:'Hello '+Ti.App.Properties.getString('currentUser'),
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		TabBarHidden: true,
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});	
	
	Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;

	var playlist = [];
	var tbl_data_left = [];
	var tbl_data_main = [];
	
var audiodir = title+'sound';
var audiopath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + audiodir; 

var photodir = title+'image';
var photopath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + photodir; // photodir is Family or Friends..

var AddAudioWindow = require('ui/tablet/AddAudio'); 
var audiowindow = new AddAudioWindow(L('audios'));
var OnlineAudioViewerWindow = require('ui/tablet/OnlineAudioViewer');

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
		text: 'Music and Audio',
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
		// add a new sound clip
		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Add New Audio', GetDateTime(), 'N');
  		Ti.API.info('add new audio clip');
		audiowindow.open(title);
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
		// exit photos - THIS BUTTON IS SHOWN WHEN ALL AUDIOS ARE DISPLAYED IN TABLE
		Ti.App.fireEvent('app:homeClicked'); 
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'', GetDateTime(), 'N');
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
   			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'No Connection. Get Online Audios', GetDateTime(), 'N');
  			alert('no internet connection');
   			
		} else {
   			Titanium.API.info(' connection present ');// show online video window
			// show search view
  			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Generic Audio', GetDateTime(), 'N');
  			var onlineaudioviewerwin = new OnlineAudioViewerWindow(L(title));
 			onlineaudioviewerwin.open(title);
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
	
	audiosWindow.titleControl = header;
	audiosWindow.add(detailview);
	audiosWindow.add(subheader);

////////////
	
	// Create an array of explicitly defined custom TableViewRows

function getNewAudios(){
	var audiodata = getAudios(); 
 
for(i = 0; i < audiodata.length; i++){
	Ti.API.info(audiodata[i].toString()); //displays <null> for each element.
    var audiofilename = audiodata[i].image; // filename with no extension
    Ti.API.info(audiodata[i].image);
    var audiotitle = audiodata[i].title;
    
    var displayimage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+photodir, audiofilename+'.jpg'); 
    //var getsound = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+audiodir, audiofilename+'.caf');	
	var row2 = Ti.UI.createTableViewRow({
        selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
		backgroundColor: 'transparent',
        filter: audiotitle                           
    });   	
   var soundimage = Ti.UI.createImageView({
        			layout: 'horizontal',
        			//top: 10,
    				height: '200',
    				width: '200',
        			image: displayimage
    			});
    
    			var buttonSound = Ti.UI.createButton({
   					title: audiofilename,
   					color: '#fff',
    				height: '200',
    				width: '170',
    				borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
					borderRadius:10,       //for rounded corners
    				//right: 25,
    				left: '20',
        			font: {fontSize:30, fontFamily:'Verdana'},
    			});

    			buttonSound.addEventListener('touchstart', function() {
       				 buttonSound.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    			});
 
   			 	buttonSound.addEventListener('touchend', function() {
       		 		buttonSound.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    			});
    
      
           		var labelTitle = Titanium.UI.createLabel({
					text: audiotitle,
					rowIndex:-1,
					font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
					backgroundColor: 'transparent',
					color: Ti.App.Properties.getString('appfontcolor'),
  					left: 240,
  					width: '60%',
					top: 50
				});
			
				buttonSound.add(soundimage);
				row2.add(labelTitle);            
            	row2.add(buttonSound);
            	tbl_data_main.push(row2);
            	Ti.API.info('New audio added: '+audiotitle); 
            };    
            
};	


function createPlaylist(){
var tablelength = 0;
 	playlist = Ti.Media.queryMusicLibrary({
        grouping:Ti.Media.MUSIC_MEDIA_GROUP_ARTIST
    });
 
    if (playlist.length == 0) {
        Ti.API.info("No results!");
    }
    else { 
    	tablelength = playlist.length;
        for (var i=0; i < playlist.length; i++) {
        	if ((playlist[i].mediaType == Titanium.Media.MUSIC_MEDIA_TYPE_MUSIC) || (playlist[i].mediaType == Titanium.Media.MUSIC_MEDIA_TYPE_PODCAST)) {
        		//  only add items to the playlist if they are audio files...
        		Ti.API.info("Podcast or music!");
        		var filename = playlist[i].artist;
       			 //var artistimage = playlist[i].image;
       			 var artistimage = playlist[i].artwork;
       			 var item = i+': '+playlist[i].title+','+playlist[i].artist;
            	var row = Ti.UI.createTableViewRow({
            		selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
					backgroundColor: 'transparent',
               	 filter: filename                           
            	});
      
     			var audioimage = Ti.UI.createImageView({
        			layout: 'horizontal',
        			//top: 10,
    				height: '200',
        			image: artistimage
    			});
    
    			var button1 = Ti.UI.createButton({
   					color: '#fff',
    				height: '200',
    				borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
					borderRadius:10,       //for rounded corners
    				//right: 25,
    				left: '20',
        			font: {fontSize:30, fontFamily:'Verdana'},
    			});

    			button1.addEventListener('touchstart', function() {
       				 button1.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    			});
 
   			 	button1.addEventListener('touchend', function() {
       		 		button1.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    			});
    
      
           		var titleLabel = Titanium.UI.createLabel({
					text: item,
					rowIndex:i,
					font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
					backgroundColor: 'transparent',
					color: Ti.App.Properties.getString('appfontcolor'),
  					left: 240,
  					width: '60%',
					top: 50
				});
				button1.add(audioimage);
				row.add(titleLabel);            
            	row.add(button1);
            	
            		
///  code below displays arrows to indicate scroll up and down

     var buttonDown1 = Ti.UI.createLabel({
    	bottom:20,
    	right: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageDown1 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_down_black.png'
    });
   
   	buttonDown1.add(imageDown1); 
    
     var buttonUp1 = Ti.UI.createLabel({
    	bottom:70,
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
   	
    row.add(buttonUp1);
 	row.add(buttonDown1);
 
///end of scroll up and down code
            	
            	//put data into data array for the table
            	tbl_data_left.push(row);
            	Ti.API.info(item);
          	};
            ////  end if statement here////
           
            
            
            
        }
    }
};
    
    //define our search bar which will attach 
//to our table view
var searchBar = Titanium.UI.createSearchBar({
    showCancel:true,
    height:125,
    font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
    top:0
});

var badsearchBar = Titanium.UI.createTextField({
	//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
	top:0,
    width: '70%',
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

searchBar.addEventListener('change', function(e){
  //search the tableview as user types
  Ti.API.info('user searching for: ' + e.value);
});

//when the return key is hit, remove focus from
//our searchBar
searchBar.addEventListener('return', function(e){
   searchBar.blur(); 
});

//when the cancel button is tapped, remove focus
//from our searchBar
searchBar.addEventListener('cancel', function(e){
   searchBar.blur();
});

var table_left = Titanium.UI.createTableView({
	left: 0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '100%',
	height: Ti.UI.FILL,
	search:searchBar,
	filterAttribute:'filter', //here is the search filter which appears in TableViewRow
	//top: 200,
	//data: tbl_data_main,
	rowHeight: 280,
    scrollable: true      
});

table_left.addEventListener('dblclick', function(e) {
	if (e.row.children[0].rowIndex == '-1'){
		var songname = e.row.children[0].text;
	 	var songimage = e.row.children[1].children[0].image;
	 	var audioFile = e.row.children[1].title;
	 	//var audioFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+audiodir, soundfilename+'.caf');	
	
	 	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Personal Audio', GetDateTime(), 'N');
	 	playAudio(audioFile, songname, songimage, 'soundclip');
	
	}
	else {
	 	var musicId = e.row.children[0].rowIndex;
	 	var songname = e.row.children[0].text;
	 	var songimage = e.row.children[1].children[0].image;
	 	Ti.API.info(musicId);
	 	var audioFile = playlist[musicId];
	 	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Personal Audio', GetDateTime(), 'N');
	 	playAudio(audioFile, songname, songimage, 'mysound');
	 }
});

table_left.addEventListener('click', function(e) {
	if (e.row.children[0].rowIndex == '-1'){
		var songname = e.row.children[0].text;
	 	var songimage = e.row.children[1].children[0].image;
	 	var audioFile = e.row.children[1].title;
	 	//var audioFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+audiodir, soundfilename+'.caf');	
	
	 	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Personal Audio', GetDateTime(), 'N');
	 	playAudio(audioFile, songname, songimage, 'soundclip');
	
	}
	else {
	 	var musicId = e.row.children[0].rowIndex;
	 	var songname = e.row.children[0].text;
	 	var songimage = e.row.children[1].children[0].image;
	 	Ti.API.info(musicId);
	 	var audioFile = playlist[musicId];
	 	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Personal Audio', GetDateTime(), 'N');
	 	playAudio(audioFile, songname, songimage, 'mysound');
	 }
});

	audiosWindow.addEventListener('youGotFocus', function(e){
		Ti.API.info('Tab changed to '+title);
		
		if ( Ti.App.Properties.getString('currentUserType') == 'PWD'){
			btnLeft.visible = false;
			btnCentre.visible = true;
		}
		else 
		{
			btnLeft.visible = true;
			btnCentre.visible = false;
		};	
		
    	tbl_data_main.length = 0;
    	createPlaylist();
    	tbl_data_main = tbl_data_left;  
    	Ti.API.info((tbl_data_main.length).toString());
    	getNewAudios();
    	Ti.API.info((tbl_data_main.length).toString());
    	table_left.setData([]); 
    	table_left.setData(tbl_data_main);
    	Ti.API.info((tbl_data_main.length).toString());
    /*	if (Ti.App.Properties.getString('Question_Asked') == 'No'){ //first see if a question has been asked in this session yet
		if (Ti.App.Properties.getString('Timer_Started') == 0){ //check that there is not a timer ongoing
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
    
  
    
function playAudio(soundFile, audioname, songpic, audiotype){
	var player;
	Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;
	if (audiotype == 'mysound') {
		player = Titanium.Media.systemMusicPlayer;
		player.setQueue(soundFile);
	}
	else {
		player = Ti.Media.createSound({
			//sound:soundFile
			url: audiopath +"/"+soundFile+'.caf'
		});
	}
	
	if (Ti.App.Properties.getString('Volume') == 'Normal') {
		player.volume = '.8';
	}
	else {
		player.volume = '1.0';
	};
	
 	player.play();
 	subheader.visible = false;
 	
 		/// code below is for the view to display when player is playing
	
	var btnBack = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B',//purple
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
		width: 150,
    	height: 100, 
		right: 20
	});
	
	var imageBack = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/arrow_left_white.png'
    });
    
    var labelBack = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Back',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnBack.add(imageBack);
    btnBack.add(labelBack);
    
    btnBack.addEventListener('click',function(e){
		// back to audioview - this button appears when an actual audio is playing
		// STOP the audio
		if (stopButton.title == 'Stop') {
			Ti.API.info('Stopping audio');
			player.stop();
		}
  		audiosWindow.remove(playersubheader);
  		detailview.remove(audioView);
  		subheader.visible = true;
	});
	
	
	 var playersubheader = Ti.UI.createView({
		top: 0,
		width: '100%',
		visible: true,
		height:125,
		backgroundColor: 'transparent'
	});
 	
	var playerViewTop = Ti.UI.createView({
	    backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125
	});
	
	 var playerLabel = Titanium.UI.createLabel({
	 		text: 'Now playing...',
			font: {fontSize: Ti.App.Properties.getString('appfontsize'), fontFamily:'Verdana'},
			color: Ti.App.Properties.getString('appfontcolor'),			
			left: 20,
			width: (detailview.width/2),
			//width: Ti.UI.FILL
		});

	playersubheader.add(playerViewTop);

	playerViewTop.add(btnBack);
	playerViewTop.add(playerLabel);
	audiosWindow.add(playersubheader);
	
	// end of code for the view to display when player is playing
 	 	
	var audioView = Ti.UI.createView({
		top: 0,	
		borderWidth: '0',
		backgroundColor: '#fff',
		//backgroundImage: myUserPic,
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	});
	
detailview.add(audioView);
 var audioLabel = Titanium.UI.createLabel({
			text: audioname,
			font: {fontSize: Ti.App.Properties.getString('appfontsize'), fontFamily:'Verdana'},
			color: Ti.App.Properties.getString('appfontcolor'),			
			top: 10,
			left: 20,
			width: 500
		});
		
audioView.add(audioLabel);
     var audiopicture = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 10,
        right: 20,
    	height: '200',
    	borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
		borderRadius:10,       //for rounded corners
        image: songpic
    });

audioView.add(audiopicture);

var stopButton = Titanium.UI.createButton({
    title:'Stop',
 	backgroundColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
    borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
    borderRadius: 6,
    color: '#fff',
    borderWidth: '5',
    font: {fontSize:30, fontFamily:'Verdana'},
    top: 250,
    right: 20,
    width: 200,
    height: 100 
});

stopButton.addEventListener('click', function() {
	if (stopButton.title == 'Stop') {
		//player.stop();
		player.pause();
		stopButton.title = 'Play';
		playerLabel.text = 'Paused';
	}
	else
	{
		player.play();
		stopButton.title = 'Stop';
		playerLabel.text = 'Now playing...'
	}
});

audioView.add(stopButton);
};
 		
//add data to tables and tables to window here...		
//table_left.setData(tbl_data_main);
detailview.add(table_left);

	
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
	
	return audiosWindow;

};
module.exports = AudiosWindow;


/*  TODO add my own files
 * 
use getAudios from DB and get rawfilename, and 
 look in image directory for images and audios that match the rawfilename, 
 put rawfilename, title, image and audio into the playlist... 
 
 // get all audios from DB - this will return a rawfilename and a title for each sound
 
  //now add individual sound clips for pwd
            audiodata = getAudios(); 
 
 			for(i = 0; i < audiodata.length; i++){	  
    			Ti.API.info(audiodata[i].toString()); //displays <null> for each element.
    			rawfilename = audiodata[i].image; // filename with no extension
     			var audiotitle = audiodata[0].title;
     			var displayimage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, photodir+Ti.Filesystem.separator+rawfilename+'.jpg');
     			var getsound = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, audiodir+Ti.Filesystem.separator+rawfilename+'.caf');
    			
	 			var row2 = Ti.UI.createTableViewRow({
            		selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
					backgroundColor: 'transparent',
               	 	filter: audiotitle                           
            	});
	 			
	 			var soundimage = Ti.UI.createImageView({
        			layout: 'horizontal',
        			//top: 10,
    				height: '200',
        			image: displayimage
    			});
    
    			var buttonSound = Ti.UI.createButton({
   					color: '#fff',
    				height: '200',
    				borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
					borderRadius:10,       //for rounded corners
    				//right: 25,
    				left: '20',
        			font: {fontSize:30, fontFamily:'Verdana'},
    			});

    			buttonSound.addEventListener('touchstart', function() {
       				 buttonSound.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    			});
 
   			 	buttonSound.addEventListener('touchend', function() {
       		 		buttonSound.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    			});
    
      
           		var labelTitle = Titanium.UI.createLabel({
					text: audiotitle,
					rowIndex:i,
					font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
					backgroundColor: 'transparent',
					color: Ti.App.Properties.getString('appfontcolor'),
  					left: 240,
  					width: '60%',
					top: 50
				});
				buttonSound.add(soundimage);
				row2.add(labelTitle);            
            	row2.add(buttonSound);
            	tbl_data_left.push(row2);
            	Ti.API.info(rawfilename);
 			};

 
 
 
 * 
 * */