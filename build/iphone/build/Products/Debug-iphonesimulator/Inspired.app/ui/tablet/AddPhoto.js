
// here is where you put any reference to external code that merWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');

// TODO when selecting a picture from scrollingview, set the rawfilename, this will allow you to delete a saved file and any attached recordings to it also will allow you to add a recording if none present...save

function AddPhotoWindow(title){

    var addPhotoWindow = Ti.UI.createWindow({
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});

var photodir = title;
var photopath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + photodir; // photodir is Family or Friends..
var imagetosave = 'images/emptyimage.png';
var rawfilename = '';
var phototosave = 'no';
var phototoedit = 'no';
var photodata = [];
var filetodisplay = '';
var audiotosave = '';
var photoselected = 'no';  //this is to be used when a photo is selected and users want to add to or 
var sound;
var timer;
var duration = 0;
var file;
var picturesRetrieved = 'no';

Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;
var audiodir = 'audios';
var audiopath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + audiodir; 
var recording = Ti.Media.createAudioRecorder();
recording.compression = Ti.Media.AUDIO_FORMAT_LINEAR_PCM;
recording.format = Ti.Media.AUDIO_FILEFORMAT_CAF;


	// get tab group object
	var tabGroup = Titanium.UI.currentTabGroup;
	
	var photoDialog = Titanium.UI.createOptionDialog({
  	    title: 'Get a photo from...',
    	options: ['Camera','Photo Gallery', 'Cancel'],
    	cancel:2
	});	
	
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
        image: 'images/cross_black.png'
    });
    
    var labelLeft = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Delete',
        color: Ti.App.Properties.getString('appfontcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLeft.add(imageLeft);
    btnLeft.add(labelLeft);
	
	btnLeft.addEventListener('click',function(e){
   		 if (phototoedit == 'no'){
   		 	if (labelLeft.text == 'Cancel'){
   		 	// reset defaults and do not save to DB
			imagetosave = 'images/emptyimage.png';
			rawfilename = '';
			phototosave = 'no';
			labelGetPhoto.text = 'Get Photo';
			labelLeft.text = 'Delete';
			audioSubview.visible = false;
			imageGetPhoto.image = 'images/photowhite.png';
			textfieldPeople.value = '';  
			textfieldYear.value = '';  
			textfieldPlace.value = '';  
			newPhoto.image = '';
		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Add New Photo Cancelled', GetDateTime(), 'N');
   		 	}
   		 	else {
   		 		alert('No photo to delete');
   		 	};
   		 }
   		 else {
   		 	deletedDialog.show();
   		 }
	});
	 
 function deleteImage(fname){
 	Ti.API.info('filename: '+fname+' directoryname: '+photodir);
 	var imgDirectory = Ti.Filesystem.getFile(photopath);
 	if (!imgDirectory.exists()){
			// directory doesn't exist
			alert('No files to delete');
	}
	else{
		var filetodelete = Ti.Filesystem.getFile(photopath, fname+'.jpg');	
		if (filetodelete.exists()){
			filetodelete.deleteFile();
			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Photo Deleted', GetDateTime(), 'N');
    		alert('Your file was deleted!'); 
    	}
   		 else{
    		alert('No file to delete');
   	 	};
	};
	 newPhoto.image = '';
 };
 	 
 function deleteAudio(fname){
 	Ti.API.info('filename: '+fname+' directoryname: '+photodir);
 	var audioDirectory = Ti.Filesystem.getFile(audiopath);		
	if (!audioDirectory.exists()){
			 // no audio directory created yet so no audios to delete; do nothing
		}
	else{
		var filetodelete = Ti.Filesystem.getFile(audiopath, fname+'.caf');	
		if (filetodelete.exists()){
			filetodelete.deleteFile();	
    	}
   		 else{
   // no audio file to delete so do nothing
   	 	};
	};
	 
 };
 
	function retainfiledetails(newImage) {
		imagetosave = newImage; // an actual image (.png file)
		rawfilename = GetPhotoDateTime(); 
		//newPhoto.image = imagetosave;
		phototosave = 'yes';
		labelLeft.text = 'Cancel';
		labelGetPhoto.text = 'Save Now';
		imageGetPhoto.image = 'images/save_white.png';
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
					{	
						newPhoto.image = newImage;
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
						newPhoto.image = cameraImage;
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

	function saveDatatoDB(filename){
		try {Ti.API.info(textfieldYear.value);
		
		 } catch(e) {
				Ti.API.info('No year text!');
			
		};
		try { Ti.API.info(textfieldPlace.value);
		
		 } catch(e) {
				Ti.API.info('No tag1 text!');
		};
		try { Ti.API.info(textfieldPeople.value);
		
		 } catch(e) {
				Ti.API.info('No desc text!');
			
		};
		insertPhoto(filename, textfieldYear.value, textfieldPlace.value, 'none', 'none', textfieldPeople.value);
	};
	
function addPhoto(){		

	var path = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + photodir; // photodir is Family or Friends...
	
	Ti.API.info('looking in a directory called'+path);
	var imgDirectory = Ti.Filesystem.getFile(path);
	if (!imgDirectory.exists()){
		imgDirectory.createDirectory();
		var filecount = 0;
	}
	else {
		if (imgDirectory.getDirectoryListing().length != null){
			var filecount = imgDirectory.getDirectoryListing().length;
		}
		else{
			var filecount = 0;
		};
	};
	var filename = path +"/"+rawfilename+".jpg";
	var imageFile = Titanium.Filesystem.getFile(filename); // returns the location and name of file with extension to save - in local app directory
	imageFile.write(imagetosave);
	Ti.API.info('you saved a file called'+filename);
	alert('Your file has been saved');
	// save photo info to DB
	saveDatatoDB(rawfilename); // the filename only is saved - it is assumed throughout the App that the extension for images is .jpg
	// reset defaults after saving to DB
	imagetosave = 'images/emptyimage.png';
	rawfilename = '';
	phototosave = 'no';
	labelGetPhoto.text = 'Get Photo';
	labelLeft.text = 'Delete';
	audioSubview.visible = false;
	imageGetPhoto.image = 'images/photowhite.png';
	textfieldPeople.value = '';  
	textfieldYear.value = '';  
	textfieldPlace.value = '';  
	newPhoto.image = '';
	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'New Photo Added', GetDateTime(), 'N');
  	savedDialog.show();
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
		if (phototosave == 'no'){
			//show dialog to add photos
		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Close Add Photo. Back to Viewer', GetDateTime(), 'N');
			picturesRetrieved = 'no';
			addPhotoWindow.close();
  			}
		else {
			alert('Photo waiting to be saved');
		};
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
        image: 'images/volume_white.png'
    });
    
    var labelCentre = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Record',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnCentre.add(imageCentre);
    btnCentre.add(labelCentre);

	var savedDialog = Ti.UI.createAlertDialog({
    	message: 'The file has been saved',
    	ok: 'OK',
    	title: 'File Saved'
  	});
  	
   var deletedDialog = Titanium.UI.createOptionDialog({
  	   title: 'Delete Photo?',
    	options: ['Yes','No', 'Cancel'],
    	cancel:1
	});	
	
	deletedDialog.addEventListener('click',function(e)
	{	
		Ti.API.info('You selected ' + e.index);
    	if(e.index == 0)
    	{	
    		var phototodelete = getPhoto(photodata[0].image);
   		 	deleteImage(rawfilename);
   		 	deleteAudio(rawfilename);
   		 	deletePhoto(phototodelete[0].id);	
   		 	photodata = [];
    		textfieldYear.value = ''; 
    		textfieldPlace.value = '';	
    		textfieldPeople.value = '';
    		rawfilename = '';
        	newPhoto.image = ''; 
        	phototoedit = 'no';
        	audioSubview.visible = false;
        	picturesRetrieved = 'no';
			getPictures();
    		
		}
		if(e.index == 1)
    	{
    		// do nothing....
    	};
	});
    		
    		
	////  view for show recordin starts
	
	var audioSubview = Ti.UI.createView({
		visible: false,
		top: 380,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: '#F0F0F0'//grey
	});
	
	var b2 = Titanium.UI.createButton({
		title:'Playback',
		top:120,
		left: 230,
   		color: Ti.App.Properties.getString('appfontcolor'),
        width: 150,
    	height: 100, 
        backgroundColor: '#ECC10D', //yellow
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#ECC10D',
  		font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')}

	});
	
	audioSubview.add(b2);

	var b1 = Titanium.UI.createButton({
		title:'Again',
		top:120,
		//right:20,
		right: 230,
		color: '#fff',
        width: 150,
    	height: 100, 
    	backgroundColor: '#551A8B', //purple
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
  		font: {fontSize:Ti.App.Properties.getString('btnfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')}

	});	
	
audioSubview.add(b1);

var labelLevels = Titanium.UI.createLabel({
	text:'',
	font:{fontSize:Ti.App.Properties.getString('btnfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
	top:50,
	textAlign:'center'
});

audioSubview.add(labelLevels);

function showLevels()
{
	var peak = Ti.Media.peakMicrophonePower;
	var avg = Ti.Media.averageMicrophonePower;
	duration++;
	labelLevels.text = 'Recording: '+duration;
};

b1.addEventListener('click', function()
{
	audioRecording();
});

b2.addEventListener('click', function()
{
	if (sound && sound.playing)
	{
		sound.stop();
		sound.release();
		sound = null;
		b2.title = 'Playback';
	}
	else
	{
		Ti.API.info("recording file size: "+file.size);
		sound = Ti.Media.createSound({
			//sound:file
			url: audiopath +"/"+audiotosave+'.caf'
			});
		sound.addEventListener('complete', function()
		{
			b2.title = 'Playback';
		});
		Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;
		sound.play();
		b2.title = 'Stop';
	}
	Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;
});

function audioRecording(){
	
if (b1.title == "Stop")
	{
		file = recording.stop();
		
        newAudioFile = audiotosave;
      
   		var audioDirectory = Ti.Filesystem.getFile(audiopath);
		if (!audioDirectory.exists()){
			audioDirectory.createDirectory();
			//alert('directory does not exist');
		}
		else{
			//alert('directory exists');
		};
		if (Titanium.Platform.osname == 'android') {
                var source = audiopath +"/"+newAudioFile+'.caf';
             	var audioFile = Titanium.Filesystem.getFile(source);  
             	if (audioFile.exists()) {audioFile.deleteFile();}
					//  save video file in local app directory
				source.copy(file.toBlob);   //file.blob		
		}
		else{
                 	var filename = audiopath +"/"+newAudioFile+'.caf';
					var audioFile = Titanium.Filesystem.getFile(filename);
					if (audioFile.exists()) {audioFile.deleteFile();}
					audioFile.write(file.toBlob);	
					alert('Your audio file has been recorded');		
		};        

		// save file to appdirectory 
		//audioFile.write(audiotosave);

		//  save details to DB
		//  audiofiletosaveinDB = inputAudioTitle.value
		b1.title = "Again";
		b2.show();
		b2.title = "Playback";
		clearInterval(timer);
		Ti.Media.stopMicrophoneMonitor();
	}
	else
	{
		if (!Ti.Media.canRecord) {
			Ti.UI.createAlertDialog({
				title:'Error!',
				message:'No audio recording hardware is currently connected.'
			}).show();
			return;
		}
		b1.title = "Stop";
		recording.start();
		b2.hide();
		Ti.Media.startMicrophoneMonitor();
		duration = 0;
		timer = setInterval(showLevels,1000);
	}
};


	
	////view for show recording ends
	
	btnCentre.addEventListener('click',function(e){// exit photos
		//show dialog to record
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Add Audio', GetDateTime(), 'N');
  		if (rawfilename == '') {	
  			alert('Please add an image first!');
  		
  		}
  		else {
  			audioSubview.visible = true;
  			audiotosave = rawfilename;
  			//recordaudio(rawfilename);
  			audioRecording()
  		};
	});



	function addAudio(name){
  		if (name == "Family") {// add family photos chosen
  			Ti.API.info('add audio');
			
		} 
		if (name == "Friends") {		  
			  	   
  		
		}	
		if (name == "Work") {	
		
 		}	
		if (name == "Hobbies") {	
		
                
		}	
		if (name == "Events") {	
		
		}	
		if (name == "Places") {	
		 
		}	
		if (name == "Other") {	
		}	
	
	};	
	
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
	
	addPhotoWindow.titleControl = header;
	addPhotoWindow.add(subheader);
	addPhotoWindow.add(detailview);
	
///// TODO TODO
var user_tbl_data_top = [];

var row1 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor')
});
     
  	var newPhoto = Ti.UI.createImageView({
		height:180,
		width: 180,
		left: 20,
		layout: 'horizontal',
		top: 5,
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'),
		borderRadius:10,       //for rounded corners
		canScale:false
		//image: 'images/pwd_photo.png',
	}); 
     
	var labelYear = Titanium.UI.createLabel({
		top: 0,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 210,
		text: 'Year:'
	});
	   
	var textfieldYear = Titanium.UI.createTextField({
		//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
		top:5,
    	width: '230',
    	left: '365',
   	 	height: 40, 
    	color: Ti.App.Properties.getString('appfontcolor'),
    	clearOnEdit : true,
    	//font: Ti.App.Properties.getString('appfontsize'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    	borderRadius: 6,    
    	hintText:'Type year',
   	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	var labelPlace = Titanium.UI.createLabel({
		top: 70,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 210,
		text: 'Place:'
	});

	var textfieldPlace = Titanium.UI.createTextField({
		//value:    Ti.API.info(Ti.App.Properties.getString('currentUser')),
		top:75,
    	width: '230',
    	left: '365',
    	height: 40, 
    	color: Ti.App.Properties.getString('appfontcolor'),
    	clearOnEdit : true,
    	//font: Ti.App.Properties.getString('appfontsize'),
		font:{fontSize:Ti.App.Properties.getString('appfontsize'),fontFamily:Ti.App.Properties.getString('appfontfamily')},
		borderColor: Ti.App.Properties.getString('appbuttonselectedcolor'), 
    	borderRadius: 6,    
    	hintText:'Type place',
   	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
   	 	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	var labelSave = Ti.UI.createLabel({
        text: 'Save',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
        bottom: 10
    // width:200   
    });
    


	var labelPeople = Titanium.UI.createLabel({
		top: 140,
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
  		font: {fontSize:Ti.App.Properties.getString('appfontsize'), fontFamily:Ti.App.Properties.getString('appfontfamily')},
		left: 210,
		text: 'People:'
	});

	var textfieldPeople = Titanium.UI.createTextField({
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
    	hintText:'Type names',
   	// keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    	keyboardType:Titanium.UI.KEYBOARD_TYPE_ASCII,
    	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
    	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
    
	var btnSave = Ti.UI.createButton({
		backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
		right: 20,
		top: '5',
		//left: '640',
		width: 150,
    	height: 100, 
		borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	color: '#fff'
	});
	
	var imageSave = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/save_white.png'
    });
	
	btnSave.add(imageSave);
	btnSave.add(labelSave);
	
	btnSave.addEventListener('click',function(e)
	{ 
		if (phototosave == 'yes'){
			if (imagetosave == 'images/emptyimage.png' || rawfilename == '')  {
				//  something has gone wrong
				alert('Something has gone wrong...');
			}
			else{
				//  Save photo to file and save details to DB
				addPhoto();
			};
		}
		else {
			alert('No photo waiting to be saved');
		};
 	});
	
    newPhoto.addEventListener('touchstart', function() {
    });
 
    newPhoto.addEventListener('touchend', function() {
    });
   row1.add(newPhoto);
   row1.add(labelYear);
   row1.add(textfieldYear);
   row1.add(labelPeople);
   row1.add(textfieldPeople);
   row1.add(labelPlace);
   row1.add(textfieldPlace);
  // row1.add(btnSave); 
   user_tbl_data_top.push(row1);
   ////////////

// now assign that array to the table's data property to add those objects as rows
var user_table_top = Titanium.UI.createTableView({
	top: 0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	visible: true,
	width: '100%',
	height: '360',
	rowHeight: '360',
    data:user_tbl_data_top,
    scrollable: false     
});

//add data to tables and tables to window here...		
user_table_top.setData(user_tbl_data_top);
detailview.add(user_table_top);
	
var detailSubview = Ti.UI.createView({
		top: 380,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		//backgroundColor: Ti.App.Properties.getString('appbkgrdcolor') //white
		backgroundColor:Ti.App.Properties.getString('appbuttoncolor')
	});
   	
detailview.add(detailSubview);	

	function getPictures(){
	try {
		detailSubview.removeAllChildren();
	} catch(e){
 	  // failed to open DB
			Titanium.API.info('Failed to remove child views.'); 
 	};
 	var photosView=Ti.UI.createScrollView({
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
		photodata = [];
        // alert('Filename: '+filetodisplay.name);
        var str = filetodisplay.name;
        var endstr = str.length-4;
		var res = str.substr(0, endstr);
		
		//debugging, need to delete
		/*var allmyphotos = getPhotos();
		Ti.API.info('fourth file name: '+allmyphotos[0].image);
		Ti.API.info('fourth file name: '+allmyphotos[1].image);
		Ti.API.info('fourth file name: '+allmyphotos[2].image);
		Ti.API.info('fourth file name: '+allmyphotos[3].image);
		Ti.API.info('fourth file name: '+allmyphotos[4].image);*/
        try
        {
        	photodata = getPhoto(res);
        	rawfilename = res;
        	Ti.API.info('raw file name: '+photodata[0].image);
        	 Ti.API.info('raw file name: '+photodata[0].image);
       		textfieldYear.value = photodata[0].year;
       		textfieldPeople.value = photodata[0].tag1;
       		textfieldPlace.value = photodata[0].desc;
        	var displayimage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, photodir+Ti.Filesystem.separator+filetodisplay.name);
        	newPhoto.image = displayimage;
        	phototoedit = 'yes';
        }
        catch(e) {
        	Ti.API.info('Wrong name in DB!');
        	try
        	{
			photodata = getPhoto(res+'.0');
        	rawfilename = res;
        	Ti.API.info('raw file name: '+photodata[0].image);
        	//alert('raw file name: '+photodata[0].image);
       		textfieldYear.value = photodata[0].year;
       		textfieldPeople.value = photodata[0].tag1;
       		textfieldPlace.value = photodata[0].desc;
        	var displayimage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, photodir+Ti.Filesystem.separator+filetodisplay.name);
        	newPhoto.image = displayimage;
        	phototoedit = 'yes';
        	}
        	 catch(e) {
        	 	Ti.API.info('Cannot find image in DB!');
        	 };
		};
    }
    else{
    	alert('No photos to display');
    	phototoedit = 'no';
    };
	};
	
	photosView.addEventListener('click', function(e){	
		if (e.source.image == null){
    	//do nothing
    	}
    	else
    	{    
			displayPhoto(e.source.image);	
		}; 
	});
	
	var buttonMove = Ti.UI.createLabel({
    	bottom: 0,
    	left: 10,
    	color: '#fff',
    	height: '50',
    	width: '50'
    });
    
    var imageMoveLeft= Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
    	left: 0,
        image: 'images/arrow_left_black.png'
    });
    var imageMoveRight= Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
    	right:0,
        image: 'images/arrow_right_black.png'
    });
   
   	buttonMove.add(imageMoveLeft); 
   	buttonMove.add(imageMoveRight); 
   	
   	var buttonMove2 = Ti.UI.createLabel({
    	bottom: 0,
    	right: 10,
    	color: '#fff',
    	height: '50',
    	width: '50'
    });
    
    var imageMove2Left= Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
    	left: 0,
        image: 'images/arrow_left_black.png'
    });
    var imageMove2Right= Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
    	right:0,
        image: 'images/arrow_right_black.png'
    });
   
   	buttonMove2.add(imageMove2Left); 
   	buttonMove2.add(imageMove2Right); 
	
	
 	Ti.API.info('getting pictures!');
 	
 	var imgDirectory = Ti.Filesystem.getFile(photopath);
	
	Ti.API.info('looking in a directory called'+photopath);
	if (!imgDirectory.exists()){
		imgDirectory.createDirectory();
		var filecount = 0;
	}
	else {
		if (imgDirectory.getDirectoryListing().length != null){
			var imagesArray = imgDirectory.getDirectoryListing();
		}
		else{
			Ti.API.info('no saved pictures!');
			var imagesArray = 0;
		};
	};
 	
 	for(i = 0; i < imagesArray.length; i++){	  
    Ti.API.info(imagesArray[i].toString()); //displays <null> for each element.
	// alert(imagesArray[i].toString());
    var imagefile =Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, photodir+Ti.Filesystem.separator+imagesArray[i].toString());
    
    var img1 = Ti.UI.createImageView({
    	image: imagefile,
    	height: '180',
    	borderWidth:5,
		top: 0,
		borderColor: Ti.App.Properties.getString('appbkgrdcolor'),
    	left: 0,
  		canScale:true   
	});

	photosView.add(img1);
	};
	detailSubview.add(buttonMove);	
	detailSubview.add(buttonMove2);
 	detailSubview.add(photosView);	
	};
	
 var imageGetPhoto = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/photowhite.png'
    });
    
    var labelGetPhoto = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Get Photo',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    
    
    var buttonGetPhoto = Ti.UI.createButton({
   		color: '#fff',
        //width: '360',
        //top: 400,
        bottom: 0,
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    buttonGetPhoto.addEventListener('touchstart', function() {
        buttonGetPhoto.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    buttonGetPhoto.addEventListener('touchend', function() {
        buttonGetPhoto.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });

	buttonGetPhoto.add(imageGetPhoto);
    buttonGetPhoto.add(labelGetPhoto);
    
    buttonGetPhoto.addEventListener('click',function(e){
    	if (phototosave == 'no'){
    		if (phototoedit == 'yes'){
    			photodata = [];
    			textfieldYear.value = ''; 
    			textfieldPlace.value = '';	
    			textfieldPeople.value = '';
    			rawfilename = '';
        		newPhoto.image = ''; 
        		phototoedit = 'no';
        		audioSubview.visible = false;
    		};
			//show dialog to add photos
			photoDialog.show();
		}
		else {
			if (imagetosave == 'images/emptyimage.png' || rawfilename == '')  {
				//  something has gone wrong
				alert('Something has gone wrong...');
			}
			else{
				//  Save photo to file and save details to DB
				addPhoto();
				picturesRetrieved = 'no';
				getPictures();
			};
		};
    });
    
    addPhotoWindow.addEventListener('focus', function(e){
		Ti.API.info('focus on Add Photos');
		if (picturesRetrieved == 'no') {
			getPictures();
			Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;
			picturesRetrieved = 'yes';
		};
	});
    		
    
    user_table_top.add(buttonGetPhoto);
	
	detailview.add(audioSubview);
	
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

function GetPhotoDateTime() {
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
    
    var photodateTime = '3'+year.toString()+fullmonth.toString()+fullday.toString()+fullhour.toString()+fullminute.toString()+fullsecond.toString();
    Ti.API.info('Date time log info: '+photodateTime);
     return photodateTime;
};	


	return addPhotoWindow;
};
module.exports = AddPhotoWindow;