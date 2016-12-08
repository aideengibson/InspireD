
// here is where you put any reference to external code that PhotoViewerWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');
//var API_KEY = 'be19e92ad7b7836fedd6d1156066f5f4'; (InspireD2015) '664dfb84932afc9f1c2180ec64179927' (inspired2015)
function FlickrViewerWindow(title){

    var flickrViewerWindow = Ti.UI.createWindow({
				//title:'Hello '+Ti.App.Properties.getString('currentUser'),
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});
	//var FLICKR_KEY = '664dfb84932afc9f1c2180ec64179927';
	var FLICKR_KEY = Ti.App.Properties.getString('FlickRKey');
	//var xhr = Ti.Network.createHTTPClient();
	var json;
	var urlStr = 'http://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&id=76792107@N06&format=json&nojsoncallback=1';
	// THIS WORKS var urlStr = 'http://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&id=76792107@N06&format=json&nojsoncallback=1';
	//THIS DOESN'T WORK var urlStr = 'http://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&id=140971657@N03&format=json&nojsoncallback=1';
//	var urlStr = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=664dfb84932afc9f1c2180ec64179927&per_page=10&format=json&nojsoncallback=1';

	//    https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=664dfb84932afc9f1c2180ec64179927&per_page=10&format=json&nojsoncallback=1

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
		height:  Ti.UI.FILL,
		//height:'100%',
		backgroundColor: 'transparent'
	});
	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: title+' Photos',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	var btnLeft = Ti.UI.createImageView({
		image: 'images/back_white.png',
		width: 'auto',
		left: 0
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
		xhr.abort();
		flickrViewerWindow.close();
  		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+' Close Photo Viewer', GetDateTime(), 'N');
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

	
	subheader.add(buttonViewTop);

	buttonViewTop.add(btnRight);
	//buttonViewTop.add(btnLeft);
	//buttonViewTop.add(btnCentre);
			
	var detailview = Ti.UI.createView({
		top: 125,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: Ti.App.Properties.getString('appbkgrdcolor') //white
	});
	
	
	flickrViewerWindow.titleControl = header;
	flickrViewerWindow.add(subheader);
	flickrViewerWindow.add(detailview);
	
	flickrViewerWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Tab changed to '+title);
    	flickrViewerWindow.refreshData();
	});
	
	flickrViewerWindow.addEventListener('open', function() {
   		flickrViewerWindow.refreshData();
	});
	
	
var xhr = Ti.Network.createHTTPClient({
    onload: function(e) {
    var photosView = Ti.UI.createScrollableView({
    showPagingControl: true,
    top:0,
    left: 0,
    views:[],
    width: '100%'
	});	
		// this function is called when data is returned from the server and available for use
        // this.responseText holds the raw text return of the message (used for text/JSON)
        // this.responseXML holds any returned XML (including SOAP)
        // this.responseData holds any returned binary data
        detailview.removeAllChildren();
        Ti.API.debug(this.responseText);
        var flickr = eval('(' +this.responseText + ')');    			
		var photoLink = flickr.items[0].link;
				//example of data returned for photoLink http://www.flickr.com/photos/librariesni/8644467973/
				// parse the returned string right to left from last "/" to next "/" to get photoid
				var lastchar = photoLink.lastIndexOf("/");
				var photoRef = photoLink.substring(lastchar-10, lastchar);
				var userId = flickr.items[0].author_id;
				Ti.API.info(userId);
				Ti.API.info(photoRef);
				/*
		  for(var i=0;i<flickr.items.length;i++){	
		  		//var photoTitle = flickr.items[i].title;
		  		//var photothumb = flickr.items[i].media.m;
		  		// example of data returned for photothumb http://farm9.staticflickr.com/8395/8644467973_db8c18a3df_m.jpg
				var photoLink = flickr.items[i].link;
				//example of data returned for photoLink http://www.flickr.com/photos/librariesni/8644467973/
				// parse the returned string right to left from last "/" to next "/" to get photoid
				var lastchar = photoLink.lastIndexOf("/");
				var photoRef = photoLink.substring(lastchar-10, lastchar);
				var userId = flickr.items[i].author_id;
				Ti.API.info(userId);
				Ti.API.info(photoRef);
	
	/*
	farm-id: 9
	server-id: 8395
	photo-id: 8644467973
	secret: db8c18a3df
	size: m
	
	 using this information the urls can be built for the following:
	
	https://www.flickr.com/people/{user-id}/ - profile
	https://www.flickr.com/photos/{user-id}/ - photostream
	// THIS IS THE ONE WE NEED! https://www.flickr.com/photos/{user-id}/{photo-id} - individual photo  //THIS IS THE ONE WE NEED!
	https://www.flickr.com/photos/{user-id}/sets/ - all photosets
	https://www.flickr.com/photos/{user-id}/sets/{photoset-id} - single photoset
	
	make the url like this: https://www.flickr.com/photos/userId/photoRef */
	var photoUrl = "https://www.flickr.com/photos/"+userId+"/"+photoRef;
	Ti.API.info(photoUrl);
	
/*var img1 = Ti.UI.createImageView({
    	//image: photoUrl,
    	//image: "https://i.ytimg.com/vi/q7o7R5BgWDY/maxresdefault.jpg",
    	top: 0,
    	left: 0,
    	//height: Ti.UI.fill,
    	width: '100%',
    	//borderWidth:10,
		//borderColor:Ti.App.Properties.getString('appbuttoncolor'),
  		canScale:true   
	});*/
	
var img1 = Ti.UI.createWebView({
	url: photoUrl
});
	
	
var img1Wrapper = Ti.UI.createScrollView({
	//contentWidth:'auto',
    //contentHeight:'auto',
    height: Ti.UI.fill,
    right:0,
    backgroundColor: '#fff',
    maxZoomScale:4.0
  });
  
img1Wrapper.add(img1);
photosView.addView(img1Wrapper);
//};
detailview.add(photosView);
 	
       Ti.API.info('success');
    },
    onerror: function(e) {
		// this function is called when an error occurs, including a timeout
        Ti.API.debug(e.error);
        alert('error');
    },
    timeout:5000  /* in milliseconds */
});
			
xhr.oldonload = function() {
 // function called when the response data is available
		
		var flickr = eval('(' +this.responseText + ')');    			

		  for(var i=0;i<flickr.items.length;i++){	
		  		var photoTitle = flickr.items[i].title;
		  		var photoUrl = flickr.items[i].media.m;
	
var img1 = Ti.UI.createImageView({
    	image: photoUrl,
    	top: 0,
    	left: 0,
    	//height: Ti.UI.fill,
    	width: '100%',
    	//borderWidth:10,
		//borderColor:Ti.App.Properties.getString('appbuttoncolor'),
  		canScale:true   
	});

var img1Wrapper = Ti.UI.createScrollView({
	//contentWidth:'auto',
    //contentHeight:'auto',
    height: Ti.UI.fill,
    right:0,
    backgroundColor: '#fff',
    maxZoomScale:4.0
  });
  
img1Wrapper.add(img1);
photosView.addView(img1Wrapper);
};
 	
       Ti.API.info('success');
};
    
//subheader.add(photosView);
//detailview.add(photosView);

    flickrViewerWindow.refreshData = function() {
    	if (xhr.connected) {
    		xhr.abort;
    	};
		xhr.open('GET', urlStr);
		xhr.send();
   };

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
	
	return flickrViewerWindow;

};
module.exports = FlickrViewerWindow;