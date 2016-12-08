
// here is where you put any reference to external code that PhotoViewerWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');

// TODO  DELETE A VIDEO
// when selecting a picture from scrollingview, set the rawfilename, this will allow you to delete a saved file and any attached recordings to it also will allow you to add a recording if none present...save

function AddVideoWindow(title){
	Ti.include('ui/common/database.js');
    var addVideoWindow = Ti.UI.createWindow({
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});
var videosRetrieved = 'no';
var newMovieFile = '';
var movietosave = '';
var filetoDelete = '';// rawfilename
var thumbfile = 'images/admin.jpg';
var videotoedit = 'no';	
var videodata = [];
addVideoWindow.addEventListener('open', function() {
//Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;
	getPictures();
	videosRetrieved = 'yes';
});


    addVideoWindow.addEventListener('focus', function(e){
		Ti.API.info('focus on Add Videos');
		if (videosRetrieved == 'no') {
			getPictures();
			videosRetrieved = 'yes';
		};
	});
	
	function getPictures(){
		 Ti.API.info('get pictures beginning'+filetoDelete);
		labelLeft.text = 'Delete';
		try {
			movieDisplayView.removeAllChildren();
		} catch(e){
 			Ti.API.info('Error removing movie child views!');
 		};
			//  add video thumbs to subheader to display like photogallery

		var photosview=Ti.UI.createScrollView({
			height:Ti.UI.FILL,
			//width:Ti.UI.FILL,
			borderWidth:10,
			borderColor:'#fff',
			layout:'horizontal',
			backgroundColor: Ti.App.Properties.getString('appbkgrdcolor'),
			scrollType:'horizontal',
			top: 60
			});
			
		function displayPhoto(filetodisplay){
	
		if (filetodisplay.exists()){
		editvideodata.visible ='true';
		videodata = [];
        Ti.API.info('Filename: '+filetodisplay.name);
        var str = filetodisplay.name;
        Ti.API.info('Full filename'+str);
        var endstr = str.length-4;
		filetoDelete = str.substr(0, endstr);
        //photodata = getPhoto(res);
       // rawfilename = res;
        Ti.API.info('rawfilename'+filetoDelete);
        videodata = getVideo(filetoDelete);
        var videodir = 'videothumb';
		var filepath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + videodir; 
       
        var imgDirectory = Ti.Filesystem.getFile(filepath);
		try {
			var imagefile =Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, videodir+'/'+filetodisplay.name);
			Ti.API.info('Got the file to Delete: '+filetoDelete);
			
			var imageplay = Ti.UI.createImageView({
       				 layout: 'horizontal',
        				//top: 10,
    				width:60, height:50,
    				backgroundColor: '#b30000',
    				borderColor: '#b30000',//red
    				borderRadius: 6,
    				borderWidth: '10',  
    				image: 'images/play_white.png'
    				});
			
    		var buttoneditImage = Ti.UI.createButton({
   					top: 5,
					left:20, 
					width: 180,
					height: 180,
					borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
					borderRadius:10
   			 		});
    
				var editimage =Ti.UI.createImageView({
						layout: 'horizontal',
						top: 0,
						left:00, 
						width: 180,
						height: 180,
						canScale:false,
						image : imagefile
				});	
						
				
					buttoneditImage.add(editimage);
					buttoneditImage.add(imageplay);
					editvideodata.add(buttoneditImage); 
					
					
    			buttoneditImage.addEventListener('touchstart', function() {
        			buttoneditImage.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    			});
 
    			buttoneditImage.addEventListener('touchend', function() {
        			buttoneditImage.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
   				 });
        
       	}
       catch(e){
 			Ti.API.info('Something went wrong...');

 		};
        	
    	}
    	else{
    		alert('No photos to display');
   		 };
 	};
 		 		
		photosview.addEventListener('click', function(e){
			if (e.source.image == null){
    	//do nothing
    	}
    	else
    	{    Ti.API.info('found pic ...');
			displayPhoto(e.source.image);
		};
		 
		});
			// look in the thumbnail directory to find the .jpg file to show thumbs of each video clip
		var videodir = 'videothumb';
		var filepath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + videodir; 
 
		var imgDirectory = Ti.Filesystem.getFile(filepath);
		try {
		var imagesArray = imgDirectory.getDirectoryListing();
		Ti.API.info('repopulating thumbnail array'+imagesArray.length.toString());
		for(var i=0;i<imagesArray.length;i++){
			var imagefile =Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, videodir+'/'+imagesArray[i].toString());
    		var image=Ti.UI.createImageView({
				height:180, 
				width: 180,
				borderWidth:5,
				borderColor:'#fff',
			//borderRadius:10       //for rounded corners
				image:imagefile,
				id: i.toString()
			}); 
		photosview.add(image);
		}
		movieDisplayView.add(photosview);
		Ti.API.info('getting pictures for video thumbs');
		} catch(e){
 			Ti.API.info('Error while getting pictures...');

 		};
 		Ti.API.info('get pictures end'+filetoDelete);
	};
	
addVideoWindow.addEventListener('close', function() {
	activeMovie = null;
});

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
	
	var deletedDialog = Titanium.UI.createOptionDialog({
  	   title: 'Delete Video?',
    	options: ['Yes','No', 'Cancel'],
    	cancel:1
	});	
	
	
	deletedDialog.addEventListener('click',function(e)
	{	
		Ti.API.info('You selected ' + e.index);
    	if(e.index == 0)// delete a video
    	{
    		Ti.API.info('deleting all files...' + filetoDelete); 
    		
    		//NB TODO delete files here
    		if (newMovieFile !=''){// the user is in the process of adding a new video so only delete the files NOT record from DB
    			// TODO use the raw filename filetoDelete to find the 2 files to delete
    			//remove all the stuff from the movieDisplayView
    			try {
    				Ti.API.info('Deleting 2 - filetosave: ' + newMovieFile);
    				deleteAVideo(filetoDelete); // in the process of saving a new video so no DB entry created yet
    				newMovieFile = '';
    				movietosave = '';
    			
					Ti.API.info('2 Deleted - filetosave: ');
				} catch(e){
 						Ti.API.info('error deleting 2 files');
 				};
    		}
    		else {// delete .jpg and .mov and also record from DBrawfilename
    			// TODO use the raw filename filetoDelete to find the 2 files to delete
    			try {
    				
    				deleteOldVideo(filetoDelete); // a video has been selected from the list to delete 
    				Ti.API.info('Deleting all 3...');
				} catch(e){
 					Ti.API.info('error deleting 3 files');
 				};
 					
 						Ti.API.info('All 3 deleted...'+' movietosave '+movietosave+' newmoviefile'+newMovieFile);
 				
    		};
			filetoDelete = '';
		//	editvideodata.removeAllChildren();
			editvideodata.visible = 'false';
			getPictures();
			videosRetrieved = 'yes';
    	}
    	else if(e.index == 1)// add existing
    	{
    	// No, do not delete	
   		}
  		else 
   		{
   		//cancel was tapped
   		//user opted not to delete a video
   		}
	});
	
	var labelTitle = Titanium.UI.createLabel({
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appbkgrdcolor'),
		text: title+' Photos',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appbkgrdcolor')}
	});
	
	
	var btnLeft = Ti.UI.createImageView({
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
        image: 'images/cross_black.png'
    });
    
    var labelLeft = Ti.UI.createLabel({
        text: 'Delete',
        color: Ti.App.Properties.getString('appfontcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,  
    });
    
    btnLeft.add(imageLeft);
    btnLeft.add(labelLeft);
	
	btnLeft.addEventListener('click',function(e){
		// Delete/ Cancel
		videosRetrieved = 'no';
		/*if (videotoedit == 'yes'){
			// Delete or cancel a saved video
			if (labelLeft.text == 'Cancel'){
			//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Cancel Changes', GetDateTime(), 'N');
				alert('Cancel all edits!');
				// TODO Delete videotoedit .jpg and .mov
			} else {
				insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Video Deleted', GetDateTime(), 'N');
				alert('Delete this video?');
				//  delete filetoDelete
			};
			videotoedit == 'no';
		}
		else{*/
			// currently either adding a new video or not doing anything
   		if (movietosave == '') {
			//do nothing
			if (filetoDelete != ''){
				//alert('Delete? '+filetoDelete);
				deletedDialog.show();
				//alert('Delete? '+filetoDelete);
				insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Video Deleted', GetDateTime(), 'N');
			}
			else {
				alert('Nothing to delete!');
			};
		}
		else { // Delete or cancel a new video
			if (labelLeft.text == 'Cancel'){
				//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Cancel Changes', GetDateTime(), 'N');
				//alert('Cancel new video recording!');// give option OK/ Cancel - if cancel, do nothing
				deletedDialog.show();
				
				insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Video Deleted', GetDateTime(), 'N');
  			
			} else {
			//	alert('Cancel new video recording?');// give option OK/ Cancel - if cancel, do nothing
				deletedDialog.show();
				insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Video Deleted', GetDateTime(), 'N');
  		
		};
		videotoedit == 'no';
		};
	});
	
	var btnRight = Ti.UI.createImageView({
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
        text: 'Back',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10
    });
    
    btnRight.add(imageRight);
    btnRight.add(labelRight);
	
	btnRight.addEventListener('click',function(e){
		// exit add videos
		if (editvideodata.visible == 'true')
		{
			//editvideodata.removeAllChildren();
			editvideodata.visible = 'false';
		};
		filetoDelete = '';
		if (movietosave == '') {
			//do nothing
			//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Close Add Video. Back to Viewer', GetDateTime(), 'N');
			videosRetrieved = 'no';
			//allvideodata.removeAllChildren();
			addVideoWindow.close();
		}
		else {
			alert('Please save movie details!');
		};
	});
	
	var btnCentre = Ti.UI.createImageView({
		backgroundColor: '#0D4F8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',
		width: 150,
    	height: 100
	});
	
	var imageCentre = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/volume_white.png'
    });
    
    var labelCentre = Ti.UI.createLabel({
        text: 'Get',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10
    });
    
    btnCentre.add(imageCentre);
    btnCentre.add(labelCentre);
    
    var videoDialog = Titanium.UI.createOptionDialog({
    	title: 'Choose a video source...',
    	options: ['Record New','Saved Videos', 'Cancel'],
    	cancel:2
	});
    
    btnCentre.addEventListener('click',function(e){// exit photos
		//show dialog to record
		btnLeft.visible = false;
  		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Add Video', GetDateTime(), 'N');
  		if (movietosave == ''){
  			if (editvideodata.visible == 'true')
			{
				//editvideodata.removeAllChildren();
				editvideodata.visible = 'false';
			};
			filetoDelete = '';
  			videoDialog.show();
   		 }
   		 else {
   		 	alert('Please save movie details!');
   		 }
   		 btnLeft.visible = true;
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
			
	var detailview = Ti.UI.createView({
		top: 125,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: Ti.App.Properties.getString('appbkgrdcolor') //white
	});
	
	var buttonDisplayView = Ti.UI.createView({	
		backgroundColor: '#fff',
		top: 0,
		left: 0,
		height:'10%',
		width: Ti.UI.FILL
	});
	
	detailview.add(buttonDisplayView);
 	///code for Add Video Starts
//  add video thumbs to subheader to display like photogallery
	var movieDisplayView = Ti.UI.createView({
		backgroundColor:Ti.App.Properties.getString('appbuttoncolor'), //green
		bottom: 0,
		left: 0,
		height: '40%',
		width: Ti.UI.FILL
		});
	
	detailview.add(movieDisplayView);
	
	addVideoWindow.titleControl = header;
	addVideoWindow.add(subheader);
	addVideoWindow.add(detailview);
	///code for Add Video Starts	

var editvideodata = Ti.UI.createView({
	    backgroundColor: '#fff',
		height: '400',
		width: '100%',
		top: 125,
		visible:false
});
addVideoWindow.add(editvideodata);

var allvideodata = Ti.UI.createView({
	    backgroundColor: '#fff',
		height: '400',
		width: '100%',
		top: 125,
		visible:false
});
addVideoWindow.add(allvideodata);

var labelinstructions = Titanium.UI.createLabel({
	backgroundColor: 'transparent',
	color: Ti.App.Properties.getString('appfontcolor'),
	top: 0,
	left: 210,
	text:'Please Add a Video Title:',
	font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')}
});

allvideodata.add(labelinstructions);

	var textfieldtitle = Titanium.UI.createTextField({
		top:'75',
    	width: '490',
    	left: 210,
    	height: 40, 
    	color: Ti.App.Properties.getString('appfontcolor'),
    	clearOnEdit : true,
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    	borderRadius: 6,    
    	hintText:'Type title',
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	textfieldtitle.addEventListener('Change', function(){
		if (videotoedit == 'yes'){
			labelLeft.text == 'Cancel';
		} else {// either new movie or no movie selected
			if (movietosave == '') {
			//do nothing
				alert('Nothing selected!');
			}
			else {
				labelLeft.text == 'Cancel';
			};
		}
	});
	
allvideodata.add(textfieldtitle);


var buttonSavePhoto = Titanium.UI.createButton( {
		color: '#fff',
        top: 125,
        bottom: 0,
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
        font: {fontSize:30, fontFamily:'Verdana'},
    });
	
	var labelSave = Ti.UI.createLabel({
        text: 'Save',
        color: '#fff',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25 
    });
    
	
	var imageSave = Ti.UI.createImageView({
         layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/save_white.png'
    });
	
	buttonSavePhoto.add(imageSave);
	buttonSavePhoto.add(labelSave);



 	buttonSavePhoto.addEventListener('touchstart', function() {
        buttonSavePhoto.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    buttonSavePhoto.addEventListener('touchend', function() {
        buttonSavePhoto.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });

buttonSavePhoto.addEventListener('click', function (e){
	if (movietosave == '') {
		//do nothing
	}
	else {// TODO check to see if there is a video to be saved
		Ti.API.info(newMovieFile);
		if (textfieldtitle.value == '') {
			alert('Please add a title for your video.')
		}
		else {
		saveDatatoDB(newMovieFile);  	// saved in form of date with no file extension
		textfieldtitle.value == '';	
    	allvideodata.visible = false;	
    	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'New video added', GetDateTime(), 'N');			
		alert('Your video details have been saved.');
		movietosave = '';
		newMovieFile = '';
		getPictures();
		};
	};
});

allvideodata.add(buttonSavePhoto);



function deleteOldVideo(rawfile){ // pass in the raw filename and then delete the .jpg and .mov files or .3gp if android
Ti.API.info('in delete old video...');
	// call function to delete thumbnail and video file
	deleteAVideo(rawfile)
	// delete the db file also 	
	 deleteVideo(video);
};

function deleteAVideo(rawtoDelete){// function to delete thumbnail and video file
	Ti.API.info('in delete a video...');
	var thumbdir = 'videothumb';	
	var thumbpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + thumbdir; 
	var imgDirectory = Ti.Filesystem.getFile(thumbpath);
	
	var videodir = 'videos';
	var videopath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + videodir; 
	var videoDirectory = Ti.Filesystem.getFile(videopath);

	if(Titanium.Platform.osname == 'android') {// use .3gp for movie file
		
		var actualvideo = Ti.Filesystem.getFile(videopath, rawtoDelete+'.3gp'); 
  	 }
	 else
 	{
		var actualvideo = Ti.Filesystem.getFile(videopath, rawtoDelete+'.mov'); 
 	};
 
 // check for thumbdir and videddir
// deleting thumbnail
 	if (!imgDirectory.exists()){
			// directory doesn't exist
			alert('No files to delete');
	}
	else{
		var actualthumb = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, thumbdir+'/'+rawtoDelete+'.jpg');
		Ti.API.info(actualthumb);
		if (actualthumb.exists()){
			actualthumb.deleteFile();
    	}
   		 else{
    		alert('No image to delete');
   	 	};
	};
	
	// deleting video
	
	 if (!videoDirectory.exists()){
			// directory doesn't exist
			alert('No files to delete');
	}
	else{
		var filetodelete = actualvideo;
		if (filetodelete.exists()){
			filetodelete.deleteFile();
			alert('Your video file was deleted!'); 
    	}
   		 else{
    		alert('No video to delete');
   	 	};
	};
};

function retainfiledetails(newMovie) {
	var videodir = 'videos';
	movietosave = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+Ti.Filesystem.separator+videodir, newMovie+'.mov'); 
	getthumb(movietosave, newMovie);  // the actual moviefile and the rawfilename
};
		
function saveDatatoDB(movieFile){// name of movie in form getdatetime with no extension
	Ti.API.info(movieFile);
	insertVideo(movieFile, movieFile, '', textfieldtitle.value, '', '', '');
};



var btnRecordVideo = Titanium.UI.createButton( {
    title : "Record New",  
     backgroundColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
    borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
    borderRadius: 6,
    color: '#fff',
    borderWidth: '5',
    font: {fontSize:30, fontFamily:'Verdana'},
    bottom: 10,
    left: 20,
    width: 200,
    height: 44 
});

function getthumb(myvideo, rawfilename){  
	var videodir = 'videothumb';	
		var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + videodir; 
		var imgDirectory = Ti.Filesystem.getFile(path);
		if (!imgDirectory.exists()){
			imgDirectory.createDirectory();
		};
				
	  Ti.API.info('Get thumbnail'); 
	var my_movie = Ti.Media.createVideoPlayer({
		url: myvideo,
		left:20, 
		top:20,
		width: 160,
		height: 160
	});
	allvideodata.add(my_movie); 
	my_movie.play();

		my_movie.requestThumbnailImagesAtTimes([0.5], Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, function(response) {
			Ti.API.info("Thumbnail callback called, success = " + response.success);
			if(response.success) {
				
					var playimage = Ti.UI.createImageView({
       				 layout: 'horizontal',
        				//top: 10,
    				width:60, height:50,
    				backgroundColor: '#b30000',
    				borderColor: '#b30000',//red
    				borderRadius: 6,
    				borderWidth: '10',  
    				image: 'images/play_white.png'
    				});

					var buttonVideoImage = Ti.UI.createButton({
   					top: 5,
					left:20, 
					width: 180,
					height: 180,
					borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
					borderRadius:10
   			 		});
    
				var videoimage =Ti.UI.createImageView({
						layout: 'horizontal',
						top: 0,
						left:00, 
						width: 180,
						height: 180,
						canScale:false,
						image : response.image	
				});			
				var filename = path +"/"+rawfilename+".jpg";
				var imageFile = Titanium.Filesystem.getFile(filename); // returns the location and name of file with extension to save - in local app directory
					imageFile.write(response.image);
					Ti.API.info('you saved a file called'+filename);
					//allvideodata.add(videoimage); 
					buttonVideoImage.add(videoimage);
					buttonVideoImage.add(playimage);
					allvideodata.add(buttonVideoImage); 
					
    			buttonVideoImage.addEventListener('touchstart', function() {
        			buttonVideoImage.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    			});
 
    			buttonVideoImage.addEventListener('touchend', function() {
        			buttonVideoImage.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
   				 });
			}
		});
		my_movie.stop();	
}; 

function SaveVideo(){
	
		var videodir = 'videos';	
		var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + videodir; 
		var imgDirectory = Ti.Filesystem.getFile(path);
		if (!imgDirectory.exists()){
			imgDirectory.createDirectory();
		};
if(Titanium.Platform.osname == 'android') {
               //record for android using intents
        var intent = Titanium.Android.createIntent({ action: 'android.media.action.VIDEO_CAPTURE' });
           
        Titanium.Android.currentActivity.startActivityForResult(intent, function(e) {
        if (e.error) {
            Ti.UI.createNotification({
                duration: Ti.UI.NOTIFICATION_DURATION_LONG,
                message: 'Error: ' + e.error
            }).show();
         } 
         else {     	
         	
            if (e.resultCode === Titanium.Android.RESULT_OK) {
                var videoFile = e.intent.data;
                newMovieFile = GetDateTime();
                var source = path +"/"+newMovieFile+".3gp";
             	var movieFile = Titanium.Filesystem.getFile(source);
					//  save video file in local app directory
				source.copy(videoFile);   
				
            } else {
                Ti.UI.createNotification({
                    duration: Ti.UI.NOTIFICATION_DURATION_LONG,
                    message: 'Canceled/Error? Result code: ' + e.resultCode
                }).show();
            }
         }
        });
      } 
      else 
      { //record for iphone
        Titanium.Media.showCamera({
                success:function(event)
                {   var videotosave = event.media;
                	newMovieFile = GetDateTime();
                 	var filename = path +"/"+newMovieFile+".mov";
					var movieFile = Titanium.Filesystem.getFile(filename);
					//  TODO Get thumb
					movieFile.write(videotosave);
					retainfiledetails(newMovieFile); 
					allvideodata.visible = true;	
					textfieldtitle.value = '';	
					
                },
                cancel:function()
                {

                },
                error:function(error)
                {
                    // create alert
                    var a = Titanium.UI.createAlertDialog({title:'Video'});

                    // set message
                    if (error.code == Titanium.Media.NO_VIDEO)
                    {
                        a.setMessage('Device does not have video recording capabilities');
                    }
                    else
                    {
                        a.setMessage('Unexpected error: ' + error.code);
                    }

                    // show alert
                    a.show();
                },
                mediaTypes: Titanium.Media.MEDIA_TYPE_VIDEO,
                videoQuality:Titanium.Media.QUALITY_HIGH
            });
      	

      }   
};

var getButton = Ti.UI.createButton({
    title : "Get Video",
    backgroundColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
    borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
     borderRadius: 6,
    color: '#fff',
    borderWidth: '5',
    font: {fontSize:30, fontFamily:'Verdana'},
    bottom: 10,
    right: 20,
    width: 200,
    height: 44 
});

function showMovies(){ 
	var videodir = 'videos';	
	var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + videodir; 
	var imgDirectory = Ti.Filesystem.getFile(path);
	if (!imgDirectory.exists()){
			imgDirectory.createDirectory();
	};

	if(Titanium.Platform.osname == 'android') {
               //NB maybe need to get video using intents for android ?
               
      } 
	else {
       Titanium.Media.openPhotoGallery({
  			allowEditing: true,
    		mediaTypes: [Ti.Media.MEDIA_TYPE_VIDEO],	
        success:function(event)
        {
 		// recorded videos from ios device
		   Ti.API.info('recording for ios'); 	
        	var newImage = event.media; 				
				if(event.mediaType == Ti.Media.MEDIA_TYPE_VIDEO)
				 	var videotosave = event.media;
				 	newMovieFile = GetDateTime();
                 	var filename = path +"/"+newMovieFile+".mov";
					var movieFile = Titanium.Filesystem.getFile(filename);
					//  save video file in local app directory
					movieFile.write(videotosave);
					retainfiledetails(newMovieFile);
					allvideodata.visible = true;	
					textfieldtitle.value = '';		
					
        },
        
        cancel:function()
        {
            //user cancelled the action fron within
            //the photo gallery
            allvideodata.visible = false;	
            textfieldtitle.value = '';	
        }
    });
 	}
};	
	/// code for AddVideo Stops
	 
videoDialog.addEventListener('click',function(e)
	{	filetoDelete = '';
		Ti.API.info('You selected ' + e.index);
    	if(e.index == 0)// record new video
    	{
    		Ti.API.info('Record New'); 
    		labelLeft.text = 'Cancel';
  			SaveVideo();
    	}
    	else if(e.index == 1)// add existing
    	{
    		 labelLeft.text = 'Cancel';
    		 showMovies();
    		
   		}
  		else 
   		{
   		//cancel was tapped
   		//user opted not to choose a video
   		}
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

	return addVideoWindow;
};
module.exports = AddVideoWindow;