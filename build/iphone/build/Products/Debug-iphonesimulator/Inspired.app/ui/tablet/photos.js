
// //this module holds the folders that the personal photos are displayed on, e.g. Family/ Hobbies/ Friends
// var myCustomComponent = require('pathtojsfile/myCustomComponent');

function PhotosWindow(title){

    var photosWindow = Ti.UI.createWindow({
				//title:'Hello '+Ti.App.Properties.getString('currentUser'),
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		TabBarHidden: true,
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});
	
var PhotoViewerWindow = require('ui/tablet/PhotoViewer');
var familywindow = new PhotoViewerWindow(L('Family'));
var friendswindow = new PhotoViewerWindow(L('Friends'));
var workwindow = new PhotoViewerWindow(L('Work'));
var hobbieswindow = new PhotoViewerWindow(L('Hobbies'));
var eventswindow = new PhotoViewerWindow(L('Events'));
var placeswindow = new PhotoViewerWindow(L('Places'));
var otherwindow = new PhotoViewerWindow(L('Other'));

// for online flickr images, use
var FlickrViewerWindow = require('ui/tablet/FlickrViewer');
var flickrwindow = new FlickrViewerWindow(L('Online'));

// for searching all images, use
var SearchAllWindow = require('ui/tablet/oldFlickrViewer');
var searchallwindow = new SearchAllWindow(L('Search All'));

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
		text: 'Photos',
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	var btnLeft = Ti.UI.createImageView({
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
        image: 'images/search_black.png'
    });
    
    var labelLeft = Ti.UI.createLabel({
        text: 'Search',
        color: Ti.App.Properties.getString('appfontcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLeft.add(imageLeft);
    btnLeft.add(labelLeft);
	
	btnLeft.addEventListener('click',function(e){
		// search all photos
		alert('search all photos!');
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Search All Photos', GetDateTime(), 'N');
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
		Ti.App.Properties.setString('Question_Asked', 'No');
		Ti.App.fireEvent('app:homeClicked'); 
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Exit Photos', GetDateTime(), 'N');
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
		// show online photos
  		callWindow(8);
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
	//buttonViewTop.add(btnLeft);
	buttonViewTop.add(btnCentre);
	
	var detailview = Ti.UI.createView({
		top: 125,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: 'transparent',
	});
	
	photosWindow.titleControl = header;
	photosWindow.add(detailview);
	photosWindow.add(subheader);
	
	photosWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Tab changed to '+title);
	});
	
	// Create an array of explicitly defined custom TableViewRows

var tbl_data_left = [];
var tbl_data_right = [];

var row1 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
    var image = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/familywhite.png'
    });
    
    var label1 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Family',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    
    
    var button1 = Ti.UI.createButton({
   		color: '#fff',
        //width: '360',
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//right: 25,
    	left: '25%',
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
    row1.add(buttonUp1);
   
    button1.add(image);
    button1.add(label1);
    row1.add(button1);  
    buttonUp1.add(imageUp1);  
    row1.add(buttonUp1);
    tbl_data_left.push(row1);
    
var row2 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
    var image2 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/friendswhite.png'
    });
    
    var label2 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Friends',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });

    var button2 = Ti.UI.createButton({
        color: '#fff',
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//right: 25,
    	left: '25%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button2.addEventListener('touchstart', function() {
        button2.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button2.addEventListener('touchend', function() {
        button2.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonDown2 = Ti.UI.createLabel({
    	top:0,
    	right: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageDown2 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_down_black.png'
    });
   
   	buttonDown2.add(imageDown2);  
    row2.add(buttonDown2);
    
    button2.add(image2);
    button2.add(label2);
    row2.add(button2); 
    tbl_data_left.push(row2);
 
 var row3 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
     var image3 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/workwhite.png'
    });
    
    var label3 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Work',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    var button3 = Ti.UI.createButton({
        color: '#fff',
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//right: 25,
    	left: '25%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button3.addEventListener('touchstart', function() {
        button3.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button3.addEventListener('touchend', function() {
        button3.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonUp3 = Ti.UI.createLabel({
    	bottom:0,
    	right: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageUp3 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_up_black.png'
    });
   
   	buttonUp3.add(imageUp3);  
    row3.add(buttonUp3);
   
    
    button3.add(image3);
    button3.add(label3);
    row3.add(button3);
    tbl_data_left.push(row3);
    
     var row7 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
     var image7 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/photowhite.png'
    });
    
    var label7 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Other',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    var button7 = Ti.UI.createButton({
        color: '#fff',
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//right: 25,
    	left: '25%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button7.addEventListener('touchstart', function() {
        button7.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button7.addEventListener('touchend', function() {
        button7.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonDown7 = Ti.UI.createLabel({
    	top:0,
    	right: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageDown7 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_down_black.png'
    });
   
   	buttonDown7.add(imageDown7);  
    row7.add(buttonDown7);
    
    button7.add(image7);
    button7.add(label7);
    row7.add(button7);
    tbl_data_left.push(row7);
    
var row4 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
var image4 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/search_white.png'
    });
    
    var label4 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Search',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    
    var button4 = Ti.UI.createButton({
        color: '#fff',        
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//left: 25,
    	right: '25%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button4.addEventListener('touchstart', function() {
        button4.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button4.addEventListener('touchend', function() {
        button4.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonUp4 = Ti.UI.createLabel({
    	bottom:0,
    	left: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageUp4 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_up_black.png'
    });
   
   	buttonUp4.add(imageUp4);  
    row4.add(buttonUp4);
    
    button4.add(image4);
    button4.add(label4);    
    row4.add(button4);
    tbl_data_right.push(row4);

var row5 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
var image5 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/eventswhite.png'
    });
    
    var label5 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Events',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    var button5 = Ti.UI.createButton({
         color: '#fff',
         width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//left: 25,
    	right: '25%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button5.addEventListener('touchstart', function() {
        button5.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button5.addEventListener('touchend', function() {
        button5.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonDown5 = Ti.UI.createLabel({
    	top:0,
    	left: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageDown5 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_down_black.png'
    });
   
   	buttonDown5.add(imageDown5);  
    row5.add(buttonDown5);
   
    button5.add(image5);
    button5.add(label5);  
    row5.add(button5);
    tbl_data_right.push(row5);
 
 var row6 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
 var image6 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/leisurewhite.png'
    });
    
    var label6 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Hobbies',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    var button6 = Ti.UI.createButton({
        color: '#fff',
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//left: 25,
    	right: '25%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button6.addEventListener('touchstart', function() {
        button6.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button6.addEventListener('touchend', function() {
        button6.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonUp6 = Ti.UI.createLabel({
    	bottom:0,
    	left: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageUp6 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_up_black.png'
    });
   
   	buttonUp6.add(imageUp6);  
    row6.add(buttonUp6);
    
    button6.add(image6);
    button6.add(label6);  
    
    row6.add(button6);
    tbl_data_right.push(row6);
    
     var row8 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedColor: Ti.App.Properties.getString('appbuttoncolor')
});
     var image8 = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
       image: 'images/placeswhite.png'
    });
    
    var label8 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Places',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:25,
    // width:200   
    });
    var button8 = Ti.UI.createButton({
        color: '#fff',
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//right: 25,
    	right: '25%',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button8.addEventListener('touchstart', function() {
        button8.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button8.addEventListener('touchend', function() {
        button8.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    var buttonDown8 = Ti.UI.createLabel({
    	top:0,
    	left: 20,
    	color: '#fff',
    	height: '50'
    });
    
    var imageDown8 = Ti.UI.createImageView({
        layout: 'horizontal',
    	height:40,
        image: 'images/arrow_down_black.png'
    });
   
   	buttonDown8.add(imageDown8);  
    row8.add(buttonDown8);
     
    button8.add(image8);
    button8.add(label8);
    row8.add(button8);
    tbl_data_right.push(row8);
    
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


table_left.addEventListener('click',function(e){
	// return index of row and call the correct window
	  callWindow(e.index);	  
	 	  
});
 
table_right.addEventListener('click',function(e){
	// return index of row and call the correct window
	  callWindow(e.index+4);	  
	 	  
});

function callWindow(num){	
  	if (num == 0) {// family photos chosen
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'FamilyPhotoViewer', GetDateTime(), 'N');
		photosWindow.containingTab.open(familywindow);
	} 
	if (num == 1) {		  
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'FriendsPhotoViewer', GetDateTime(), 'N');
        photosWindow.containingTab.open(friendswindow);
	}	
	if (num == 2) {	
		
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'WorkPhotoViewer', GetDateTime(), 'N');	  
		 photosWindow.containingTab.open(workwindow);
 	}	
 	if (num == 3) {	
		
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'OtherPhotoViewer', GetDateTime(), 'N');	 
		photosWindow.containingTab.open(otherwindow);
	}	
	if (num == 4) {	
		
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Search All Photos', GetDateTime(), 'N');
		photosWindow.containingTab.open(searchallwindow);
                
	}	
	if (num == 5) {	
		
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'EventsPhotoViewer', GetDateTime(), 'N');	 
		 photosWindow.containingTab.open(eventswindow);
	}	
	if (num == 6) {	
		
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'HobbiesPhotoViewer', GetDateTime(), 'N');	 
			photosWindow.containingTab.open(hobbieswindow);	
	}	
	if (num == 7) {	
		
  		insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'PlacesPhotoViewer', GetDateTime(), 'N');	 
		photosWindow.containingTab.open(placeswindow);	
	}	
	if (num == 8) {		
		if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
   			Titanium.API.info(' no connection ');
   		//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'OnlinePhotoViewer. No internet.', GetDateTime(), 'N'); 
   			alert('no internet connection');
		} else {
   			Titanium.API.info(' connection present ');
   			insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'OnlinePhotoViewer. Internet connected.', GetDateTime(), 'N'); 
   			photosWindow.containingTab.open(flickrwindow);
		}
	}	
 };
 
//add data to tables and tables to window here...		
table_left.setData(tbl_data_left);
table_right.setData(tbl_data_right);
detailview.add(table_left);
detailview.add(table_right);
	
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

	
	return photosWindow;

};
module.exports = PhotosWindow;


