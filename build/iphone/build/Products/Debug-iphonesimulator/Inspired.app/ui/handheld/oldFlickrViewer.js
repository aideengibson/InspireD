
// here is where you put any reference to external code that PhotoViewerWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');
//var API_KEY = 'be19e92ad7b7836fedd6d1156066f5f4'; (InspireD2015) '664dfb84932afc9f1c2180ec64179927' (inspired2015)
function FlickrViewerWindow(title){
	Ti.include('ui/common/database.js');

    var flickrViewerWindow = Ti.UI.createWindow({
				//title:'Hello '+Ti.App.Properties.getString('currentUser'),
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});
	
	// get tab group object
	var tabGroup = Titanium.UI.currentTabGroup;
	var photoyear;
	var phototag1;
	var photodesc;
	var picturesRetrieved = 'no';
	var sound;
	var header = Ti.UI.createView({
		top: 0,
		width: Ti.UI.FILL,
		height:  Ti.UI.FILL,
		backgroundColor: 'transparent'
	});
	
	var subheader = Ti.UI.createView({
		top: 0,
		width: '100%',
		//height:'100%',
		height:  Ti.UI.FILL,
		backgroundColor: 'transparent'
	});
	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: title+' Photos',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	var btnSearch = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#ECC10D', //yellow
		borderRadius: 6,
   	borderWidth: '10',
   	borderColor: '#ECC10D',
		width: 150,
   	height: 100, 
		left: 20
	});
	var imageSearch = Ti.UI.createImageView({
       layout: 'horizontal',
       top: 15,
   	width:50, height:40,
       image: 'images/search_black.png'
   });
   
   var labelSearch = Ti.UI.createLabel({
       //text: 'View photo memories',
       text: 'Search',
       color: Ti.App.Properties.getString('appfontcolor'),
       font: {fontSize:30, fontFamily:'Verdana'},
   	bottom:10,
   // width:200   
   });
   
   btnSearch.add(imageSearch);
   btnSearch.add(labelSearch);
   
   
	btnSearch.addEventListener('click',function(e){
		// search
		if (textFlickr.value == '') {
			refreshData();
			picturesRetrieved = 'yes';
		}
		else{
			findPhotos(textFlickr.value);
			picturesRetrieved = 'yes';
		};
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
		textFlickr.value = '';
		labelresults.visible = false;
		picturesRetrieved = 'no';
		flickrViewerWindow.close();
 		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+' Close Photo Viewer', GetDateTime(), 'N');
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
				//var photostr = detailview.children[0].views[detailview.children[0].currentPage].children[0].image.name;
				var photostr = detailview.children[0].currentView.toString();
				//views[detailview.children[0].currentPage].children[0].image.name;
				Ti.API.info(photostr);
				var endphotostr = photostr.length4;
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
				Titanium.API.info('No audio available!'); 
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
	
	var textFlickr = Titanium.UI.createTextField({
		maxLength: '40',
		top: 15,
   	width: 380,
   	left:180,
   	visible: true,
   	height: 50, 
   	color: Ti.App.Properties.getString('appfontcolor'),
   	clearOnEdit : true,
   	//font: Ti.App.Properties.getString('appfontsize'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
   	borderRadius: 6,    
   	hintText:'Enter Search',
  	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
   	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
   	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
   	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	var labelresults = Ti.UI.createLabel({
       //text: 'View photo memories',
       text: '',
       color: Ti.App.Properties.getString('appfontcolor'),
       font: {fontSize:30, fontFamily:'Verdana'},
   	bottom:10,
   	visible: false,
   	//left: 340,
   // width:200   
   });

	buttonViewTop.add(btnRight);
	//buttonViewTop.add(btnCentre);
	buttonViewTop.add(btnSearch);
	buttonViewTop.add(textFlickr);
	buttonViewTop.add(labelresults);
			
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
	
	
	flickrViewerWindow.titleControl = header;
	flickrViewerWindow.add(subheader);
	flickrViewerWindow.add(detailview);
	
		
function findPhotos(searchcriteria) {
	detailview.removeAllChildren();
	Ti.API.info('Refreshing data for search all photos!');
	labelresults.visible = false;
	labelresults.text = '';
  ///////////beginning of code to display all photos
var photosView = Ti.UI.createScrollableView({
   showPagingControl: true,
   top:0,
   left: 0,
   views:[],
   width: flickrViewerWindow.width
});
   
var dirArray = ['Family', 'Friends', 'Work', 'Events', 'Hobbies', 'Places', 'Other'];    
var filecount;
var imagesArray = [];
var j = 0;
while (j < dirArray.length){
var photodir = dirArray[j];
var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + photodir; // photodir is Family or Friends...	
var imgDirectory = Ti.Filesystem.getFile(path);
	
	Ti.API.info('looking in a directory called'+path);
	if (!imgDirectory.exists()){
		imgDirectory.createDirectory();
		filecount = 0;
	}
	else {
		filecount = 0;
		if (imgDirectory.getDirectoryListing().length != null){
			
			imagesArray = imgDirectory.getDirectoryListing();
			filecount = imagesArray.length;
			

			for(i = 0; i < imagesArray.length; i++){	  
   		Ti.API.info(imagesArray[i].toString()); //displays <null> for each element.
   
   		var imagefile =Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, photodir+'/'+imagesArray[i].toString());
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
	
	 		var photodetails = getPhoto(imagename);
	 		// check if photo matches search criteria
	 		var imagematch = false;
			try {
				if (photodetails[0].year != null){
					if (searchcriteria == photodetails[0].year){
					imagematch = 'true';
					};
				};
			}
			catch(e){
				
			};
			try {
			if (photodetails[0].tag1 != null){
				if (searchcriteria == photodetails[0].tag1){
					imagematch = 'true';
				};
				}
			}
			catch(e){
				
			};
			
			try {
			if (photodetails[0].desc != null){
				if (searchcriteria == photodetails[0].desc){
				imagematch = 'true';
				}
			};
			}
			catch(e){
				photodesc = '';
			};
	 		if (imagematch == 'true'){// this image matches the search criteria
	 		var phototext = photodetails[0].year+' '+photodetails[0].tag1+' '+photodetails[0].desc;
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
				};
			};
		};
	
	j++; 
	}; 
	detailview.add(photosView); 
};
	
	function refreshData() {
	detailview.removeAllChildren();
	labelresults.visible = false;
	labelresults.text = '';
	Ti.API.info('Refreshing data for search all photos!');
  ///////////beginning of code to display all photos
var photosView = Ti.UI.createScrollableView({
   showPagingControl: true,
   top:0,
   left: 0,
   views:[],
   width: flickrViewerWindow.width
});
   
var dirArray = ['Family', 'Friends', 'Work', 'Events', 'Hobbies', 'Places', 'Other'];    
var filecount;
var imagesArray = [];
var j = 0;
while (j < dirArray.length){
var photodir = dirArray[j];
var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + photodir; // photodir is Family or Friends...	
var imgDirectory = Ti.Filesystem.getFile(path);
	
	Ti.API.info('looking in a directory called'+path);
	if (!imgDirectory.exists()){
		imgDirectory.createDirectory();
		filecount = 0;
	}
	else {
		filecount = 0;
		if (imgDirectory.getDirectoryListing().length != null){
			
			imagesArray = imgDirectory.getDirectoryListing();
			filecount = imagesArray.length;
			

			for(i = 0; i < imagesArray.length; i++){	  
   		Ti.API.info(imagesArray[i].toString()); //displays <null> for each element.
   
   		var imagefile =Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, photodir+'/'+imagesArray[i].toString());
   		var img1 = Ti.UI.createImageView({
   			image: imagefile,
   			//height: '100%',
   			//top: 0,
   			left: 0,
 				canScale:true   
			});
			// take .jpg away to get rawfilename and look in db for details
			var photostr = imagesArray[i].toString();
   		var strlen4 = photostr.length;
   		var imagename = (photostr.substring(0, (strlen4))); //rawfilename
	 	var photodetails = getPhoto(imagename);
	 	//var phototext = '';
	 	try{
	 		var phototext = photodetails[0].year+' '+photodetails[0].tag1+' '+photodetails[0].desc;
		}
		catch(e){
			var phototext = '';
		};
	 			var imagelabel = Titanium.UI.createLabel({
					text: phototext,
					font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
					backgroundColor: '#fff',
					color: Ti.App.Properties.getString('appfontcolor'),
 					//width: '60%',
					bottom: 30
				});
				img1.add(imagelabel);

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
				};
			};
		};
	j++; 
	}; 
	detailview.add(photosView); 
};
	
	flickrViewerWindow.addEventListener('youGotFocus', function(e){
   	Ti.API.info('Tab changed to '+title);
		if (picturesRetrieved == 'no') {
			refreshData();
			picturesRetrieved = 'yes';
		};
   	
	});
	
	flickrViewerWindow.addEventListener('open', function() {
  		refreshData();
	});
	
  //////////end of code to display all photos

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