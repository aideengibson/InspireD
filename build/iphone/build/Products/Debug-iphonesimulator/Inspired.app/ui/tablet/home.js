
// here is where you put any reference to external code that HomeWindow might need
// e.g. Some special UI or custom component
// var myCustomComponent = require('pathtojsfile/myCustomComponent');

function HomeWindow(title){

    var homeWindow = Ti.UI.createWindow({
				//title:'Hello '+Ti.App.Properties.getString('currentUser'),
		barColor: Ti.App.Properties.getString('appbuttoncolor'), //dark green
		TabBarHidden: true,
		backgroundColor:Ti.App.Properties.getString('appbkgrdcolor')
	});

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
		//text: 'Hello '+Ti.App.Properties.getString('currentUser'),
		font:{fontSize:40,fontFamily:Ti.App.Properties.getString('appfontfamily')}
	});
	
	header.add(labelTitle);
			
	var detailview = Ti.UI.createView({
		top: 0,		
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: 'transparent',
	});
	
	homeWindow.titleControl = header;
	homeWindow.add(detailview);
	    
	homeWindow.addEventListener('youGotFocus', function(e){
    	Ti.API.info('Tab changed to '+title);
		labelTitle.text = 'Hello '+Ti.App.Properties.getString('currentUser')
	});    
	
	
	var labelBegin = Titanium.UI.createLabel({
		bottom: '10%',
		backgroundColor: 'transparent',
		color: Ti.App.Properties.getString('appfontcolor'),
		text:'What would you like to do?', 
		font:{fontSize:40,fontFamily:'Verdana'}
	});
detailview.add(labelBegin);

var tableholder = Ti.UI.createView({
		bottom: 0,		
		borderWidth: '0',
		width: Ti.UI.FILL,
		height: '60%',
    	color: 'transparent'
});

detailview.add(tableholder);

////    


	var btnLoginUsers = Ti.UI.createImageView({
		//image: 'images/users_black.png',
		//backgroundColor: '#ECC10D', //yellow
		backgroundColor: '#0D4F8B', //blue
    	borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B', 
		width: 150,
    	height: 100, 
		left: 20
	});
	
	var imageLoginUsers = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/users_white.png'
       //image: 'images/settings_white.png'
    });
    
    var labelLoginUsers = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Users',
        color: Ti.App.Properties.getString('appbkgrdcolor'),//white
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLoginUsers.add(imageLoginUsers);
    btnLoginUsers.add(labelLoginUsers);
	
	btnLoginUsers.addEventListener('click',function(e){
		// go to user details
		//insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'End Session', GetDateTime(), 'N');
		alert('new version');
       	Ti.App.fireEvent('app:loginClicked'); 
	});
	
	var btnLoginSettings = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#0D4F8B',
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#0D4F8B',
		width: 150,
    	height: 100, 
		left: 20
	});
	
	var imageLoginSettings = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/volume_white.png'
    });
    
    var labelLoginSettings = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Sound',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLoginSettings.add(imageLoginSettings);
    btnLoginSettings.add(labelLoginSettings);
    
    btnLoginSettings.addEventListener('click',function(e){
  	//	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), title+'Volume Selected', GetDateTime(), 'N');
  		Ti.App.fireEvent('app:settingsClicked'); 
  		//go to settings
	});
	
	var btnLoginExit = Ti.UI.createImageView({
		//image: 'images/close_white.png',
		backgroundColor: '#551A8B',//purple
		borderRadius: 6,
    	borderWidth: '10',
    	borderColor: '#551A8B',
		width: 150,
    	height: 100, 
		right: 20
	});
	
	var imageLoginExit = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 15,
    	width:50, height:40,
        image: 'images/close_white.png'
    });
    
    var labelLoginExit = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Exit',
        color: Ti.App.Properties.getString('appbkgrdcolor'),
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom:10,
    // width:200   
    });
    
    btnLoginExit.add(imageLoginExit);
    btnLoginExit.add(labelLoginExit);
    
    btnLoginExit.addEventListener('click',function(e){
		//exit App
      // 	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'End Session', GetDateTime(), 'N');
		//TODO set session status to ended
       	Ti.App.fireEvent('app:loginClicked'); 
	});


	var buttonViewLogin = Ti.UI.createView({
	    backgroundColor: '#F0F0F0', // gray
		top: 0,
		height:125,
		zIndex: 10
	});

	//buttonViewLogin.add(btnLoginUsers);
	buttonViewLogin.add(btnLoginSettings);
	buttonViewLogin.add(btnLoginExit);
	
	detailview.add(buttonViewLogin);

/////
	
// Create an array of explicitly defined custom TableViewRows

var tbl_data_left = [];
var tbl_data_right = [];
var tbl_data_centre = [];

var row1 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor')
});

    var image = Ti.UI.createImageView({
        layout: 'horizontal',
        top: 35,
    	width:100, height:60,
        image: 'images/photowhite.png'
    });
    
    var label1 = Ti.UI.createLabel({
        //text: 'View photo memories',
        text: 'Photos',
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
    	right: 5,
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button1.addEventListener('touchstart', function() {
        button1.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button1.addEventListener('touchend', function() {
        button1.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    button1.add(image);
    button1.add(label1);
    row1.add(button1);    
    tbl_data_left.push(row1);

var row2 = Ti.UI.createTableViewRow({
	backgroundColor: 'transparent',
	selectedColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor')
});

    var image2 = Ti.UI.createImageView({
    	layout: 'horizontal',
    	top: 35,
    	width:100, height:60,
        image: 'images/movieswhite.png'
    });
    
    var label2 = Ti.UI.createLabel({
        //text: 'Relive video moments',
        text: 'Videos',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
        bottom:25
    //bottom:45,
    // width:200   
    });
    
    var button2 = Ti.UI.createButton({
        color: '#fff',
        //width: '360',
    	width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
    	//right: 5,
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button2.addEventListener('touchstart', function() {
        button2.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button2.addEventListener('touchend', function() {
        button2.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });     
    
    button2.add(image2);
    button2.add(label2);
    row2.add(button2);
    tbl_data_centre.push(row2);
 
 var row3 = Ti.UI.createTableViewRow({
 	backgroundColor: 'transparent',
	selectedColor: Ti.App.Properties.getString('appbuttoncolor'),
	selectedBackgroundColor: Ti.App.Properties.getString('appbuttoncolor')
});
  
     var image3 = Ti.UI.createImageView({
     	layout: 'horizontal',
    	width:100, height:60,
    	top: 35,
        image: 'images/musicwhite.png'
    });
    
    var label3 = Ti.UI.createLabel({
        //text: 'Reminisce with music',
        text: 'Music',
        color: '#fff',
        font: {fontSize:30, fontFamily:'Verdana'},
    	bottom: 25
    // width:200           
    });

     var button3 = Ti.UI.createButton({
		color: '#B2D1F0',
       // width: '360',
       left:5,
        width:240, 
    	height: '160',
        borderColor: Ti.App.Properties.getString('appbuttoncolor'),
    	backgroundColor:Ti.App.Properties.getString('appbuttoncolor'),
    	borderRadius: 6,
    	borderWidth: '10',
        font: {fontSize:30, fontFamily:'Verdana'},
    });

    button3.addEventListener('touchstart', function() {
        button3.backgroundColor = Ti.App.Properties.getString('appbuttonselectedcolor');
    });
 
    button3.addEventListener('touchend', function() {
        button3.backgroundColor = Ti.App.Properties.getString('appbuttoncolor');
    });
    
    button3.add(image3);
    button3.add(label3);
    row3.add(button3);    
    tbl_data_right.push(row3);
    
    
 
// now assign that array to the table's data property to add those objects as rows
var table_left = Titanium.UI.createTableView({
	left: 0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '33%',
	height: Ti.UI.FILL,
	//top: 200,
	rowHeight: 180,
    data:tbl_data_left,
    scrollable: false      
});

table_left.addEventListener('click',function(e){
	 Ti.App.Properties.setString('sessionstatus', 'active');
     //	insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Photos', GetDateTime(), 'N');
     	Ti.App.fireEvent('app:photosClicked');
});
 
 
 // now assign that array to the table's data property to add those objects as rows
var table_right = Titanium.UI.createTableView({
	right:0,
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '33%',
	height: '100%',
	//top: 200,
	rowHeight: 180,
    data:tbl_data_right,
    scrollable: false      
});


table_right.addEventListener('click',function(e){ 
	 Ti.App.Properties.setString('sessionstatus', 'active');
   //  insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Videos', GetDateTime(), 'N');
	 Ti.App.fireEvent('app:audiosClicked'); 
});

 // now assign that array to the table's data property to add those objects as rows
var table_centre = Titanium.UI.createTableView({
	backgroundColor: 'transparent',
	separatorColor:'transparent',
	width: '34%',
	height: '100%',
	//top: 200,
	rowHeight: 180,
    data:tbl_data_centre,
    scrollable: false      
});


table_centre.addEventListener('click',function(e){
	
	 Ti.App.Properties.setString('sessionstatus', 'active');
   //  insertAuditlog(Ti.App.Properties.getString('currentUserType'), Ti.App.Properties.getString('currentDevice'), 'Videos', GetDateTime(), 'N');
	 Ti.App.fireEvent('app:videosClicked'); 
});

//add data to tables and tables to window here...		
table_left.setData(tbl_data_left);
table_right.setData(tbl_data_right);
table_centre.setData(tbl_data_centre);
tableholder.add(table_left);
tableholder.add(table_right);
tableholder.add(table_centre);

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

	    
	return homeWindow;

};
module.exports = HomeWindow;