
// 'v60L9631AD0' BBC NI Archives
//'6bFuxQwfG28' Phil Coulter Danny Boy
//

function OnlineAudioViewerWindow(title){

    var onlineaudioViewerWindow = Ti.UI.createWindow({
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});
	
	onlineaudioViewerWindow.addEventListener('open', function() {
		Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;
		Ti.API.info('Set Audio session category for Video');
		Ti.API.info('Set Audio session category for Online Audio/ Video');
		newplayMovie('YouTube Audio and Music Player', '6bFuxQwfG28');
		Ti.API.info('After serarch');
	});
	
var toolActInd = Titanium.UI.createActivityIndicator();

//this is the table we will load videos into
var tableview;

//and the data array for the table
var data = [];

var currentLink;

//this is the network request object
var xhr = Ti.Network.createHTTPClient();

	

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
		height:'100%',
		backgroundColor: 'transparent'
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
		onlineaudioViewerWindow.close();
  		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+' Close Online Audio', GetDateTime(), 'N');
	});
	
	header.add(labelTitle);
	//header.add(btnRight);
	//header.add(btnLeft);
	var buttonViewTop = Ti.UI.createView({
 		backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	buttonViewTop.add(btnRight);
	subheader.add(buttonViewTop);


	//buttonViewTop.add(btnLeft);
	//buttonViewTop.add(btnCentre);
			
		

	//detailview.add(buttonViewTop);

	
	
	var detailview = Ti.UI.createView({
		top: 125,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: Ti.App.Properties.getString('appbkgrdcolor') //white
	});
	
	onlineaudioViewerWindow.titleControl = header;
	onlineaudioViewerWindow.add(subheader);
	onlineaudioViewerWindow.add(detailview);
	

	var btnLeft = Ti.UI.createImageView({
		//image: 'images/close_white.png',
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
        text: 'More',
        color: '#ECC10D',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLeft.add(imageLeft);
    btnLeft.add(labelLeft);
	
	btnLeft.addEventListener('click',function(e){// exit photos
		//show view to search online videos
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+' More Online Choices', GetDateTime(), 'N');
	});


	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: title+' ...now playing',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appbkgrdcolor')}
	});
	
	header.add(labelTitle);
	


function playYouTube (vtitle, vguid){
	if (Titanium.Platform.osname == 'android'){
		//this call to openURL hands off the link to the operating
		Titanium.Platform.openURL("http://www.youtube.com/watch?v="+vguid);  
	}
	else // on ios
		{var ytVideoSrc = "http://www.youtube.com/watch?v="+vguid;
			var playerWin = Ti.UI.createWindow({
                    backgroundColor : '#ccc'
            });
            playMovie(playerWin, ytVideoSrc);
		}
		
};

 function playMovie(vguid) {
 			var movieview = Ti.UI.createWindow({
                    backgroundColor : '#ccc'
            });
            // Set the window orientation
            movieview.orientationModes = [Ti.UI.LANDSCAPE_RIGHT];
		
		var videoUrl = 'https://www.youtube.com/embed/' + vguid + '?    autoplay=1&autohide=1&cc_load_policy=0&color=white&controls=0&fs=0&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0';
		
		var playerWidth = '100%';
		var playerHeight = '75%';
		var htmlmash = '<iframe id="player" type="text/html" width="'+playerWidth+'" height="'+playerHeight+'" src="'+videoUrl+'" frameborder="0"></iframe>';
		var webview = Ti.UI.createWebView({
                top : 34,
                html : htmlmash,
                width : Ti.UI.FILL,
                height : Ti.UI.FILL
            });
            movieview.add(webview);
            movieview.open();
    };




       

function newplayMovie(movietitle, vguid) {

// Set the window orientation
            onlineaudioViewerWindow.orientationModes = [Ti.UI.LANDSCAPE_RIGHT];
		    
          //  tableview.visible = false;	
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
  		onlineaudioViewerWindow.remove(playersubheader);
  		detailview.remove(videoView);
  		onlineaudioViewerWindow.close();
	});
	
	
	 var playersubheader = Ti.UI.createView({
		top: 0,
		width: '50%',
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
	 		text: movietitle,
			font: {fontSize: Ti.App.Properties.getString('appfontsize'), fontFamily:'Verdana'},
			color: Ti.App.Properties.getString('appfontcolor'),			
			left: 20,
			width: (detailview.width/2),
			width: Ti.UI.FILL
		});

	playersubheader.add(playerViewTop);

	//playerViewTop.add(btnBack);
	playerViewTop.add(playerLabel);
	onlineaudioViewerWindow.add(playersubheader);
	
	// end of code for the view to display when player is playing
 	 	
	var videoView = Ti.UI.createView({
		top: 0,	
		borderWidth: '0',
		backgroundColor: '#fff',
		//backgroundImage: myUserPic,
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	});
	
	detailview.add(videoView);
	
		var videoUrl = 'https://www.youtube.com/embed/' + vguid + '?    autoplay=1&autohide=1&cc_load_policy=0&color=white&controls=0&fs=0&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0';
		var playerWidth = '100%';
		var playerHeight = '90%';
		var htmlmash = '<iframe id="player" type="text/html" width="'+playerWidth+'" height="'+playerHeight+'" src="'+videoUrl+'" frameborder="0"></iframe>';
		
		var webview = Ti.UI.createWebView({
                top : 34,
                html : htmlmash,
                width : Ti.UI.FILL,
                height : Ti.UI.FILL
            });
       
	videoView.add(webview);            
            
};
	
function doYouTubeSearch (channel, searchTerm)
{// show a 'loading' spinning wheel
	toolActInd.message = 'Loading videos...';
	onlineaudioViewerWindow.setToolbar([toolActInd], {animated:true});
	toolActInd.show();
	//create the YouTube API search URL from the function parameters
	var searchUrl = "https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=PL8253B4D39DE5BC61&key=AIzaSyBoMQ4xiwxLn2N1mOAsPTb2HYIofvBkTa4";
	// this works var searchUrl = "https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId="+channel+"&key=AIzaSyBoMQ4xiwxLn2N1mOAsPTb2HYIofvBkTa4"; 
	Ti.API.info(searchUrl);
	xhr.open("GET", searchUrl);
	xhr.send();
}

xhr.onload = function(){  
	try
	{
	//the doc object holds the response structure

	var response;

	Ti.API.info('starting..');
	//doc = this.responseXML.documentElement;
	response = JSON.parse(this.responseText);
	for (var i=0; i<response.items.length; i++){
    var video, row, videoTitle, imageurl, videourl;

    video = response.items[i];

    row = Ti.UI.createTableViewRow({
    	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
		backgroundColor: 'transparent',
        width: Ti.UI.FILL,
        height: 100
    });
//use image url to find the id of video, e.g. https://i.ytimg.com/vi/PHBNFlEZcv4/mqdefault.jpg
	imageurl = video.snippet.thumbnails.medium.url;
	videourl = imageurl.substring(23, (imageurl.length)-14);
    videoTitle = Ti.UI.createLabel({
        text: video.snippet.title,
        left: 240,
        videoId: videourl, // custom prop
        width: Ti.UI.SIZE,
        font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		height: 280
    });
    	
            var videoUrl = "http://www.youtube.com/watch?v="+videourl;
            var htmlheader = "<html><head></head><body style='margin:0'><embed id='yt' src='";
            var htmlfooter = "' type='application/x-shockwave-flash' width='100%' height='100%'></embed></body></html>";
            var htmlmash = htmlheader + videoUrl + htmlfooter;
   			
            img = Ti.UI.createWebView({
                left: 20,
                borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
				borderRadius:10,       //for rounded corners
                html : htmlmash,	
                height: '200',
    			width: '200'
            });

    row.add(img);
    row.add(videoTitle);
	//add the row to the data array
	data.push(row); 	
	}

	//if tableview has been created, reset the data on the table, update data on the table multiple times
	if (tableview)
	{
		tableview.backgroundColor = 'magenta';
		tableview.setData(data);
	}
	else
	{
		//if table has not been created, build it up with the data array
		tableview = Titanium.UI.createTableView({
		left: 0,
		backgroundColor: 'transparent',
		separatorColor:'transparent',
		width: '100%',
		height: Ti.UI.FILL,
		//search:searchBar,
	   	//filterAttribute:'filter', //here is the search filter which appears in TableViewRow
	 	top: 0,
		rowHeight: 280,
    	scrollable: true,  	
		data:data
	});
	
	//add the table to the current window for display
	detailview.add(tableview);

//add a ‘click’ listener so that when someone taps on a row
//the video will be played using the function we defined earlier
	tableview.addEventListener("click",function(e)
	{	
		Ti.API.info(e.row.children[1].text, e.row.children[1].videoId, e.row.children[0].url);
		newplayMovie(e.row.children[1].text, e.row.children[1].videoId);
	});
	Ti.API.info('Done!');
	}
	}
	catch(E)
	{
	//if anything bad happens, show the error to the user and log it
	Titanium.API.debug(E);
	Titanium.UI.createAlertDialog({title:Ti.App.Properties.getString('youtubesearch'), message:"No videos were found for this search."}).show();
	// hide the spinning toolbar widget
	onlineaudioViewerWindow.setToolbar(null, {animated:true});
	}

	onlineaudioViewerWindow.setToolbar(null,{animated:true});
};
	
	onlineaudioViewerWindow.addEventListener('youGotFocus', function(e){
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

	return onlineaudioViewerWindow;

};
module.exports = OnlineAudioViewerWindow;