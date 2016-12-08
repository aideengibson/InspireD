// N.B.  the current tab defaults to 0 if you do not set activeTab

function ApplicationTabGroup(FilePath) {
	//create module instance
	var self = Ti.UI.createTabGroup({
		//define the color for the tabbuttons
		tintColor: Ti.App.Properties.getString('appbuttoncolor'),
		activeTab: 0
	});	


 	Ti.App.addEventListener('app:loginClicked', function(){
        self.setActiveTab(0);
    });
     	Ti.App.addEventListener('app:homeClicked', function(){
        self.setActiveTab(1);
    });
     	Ti.App.addEventListener('app:manageClicked', function(){
        self.setActiveTab(2);
    });
     	Ti.App.addEventListener('app:photosClicked', function(){
        self.setActiveTab(3);
    });
     	Ti.App.addEventListener('app:videosClicked', function(){
        self.setActiveTab(4);
    });
     	Ti.App.addEventListener('app:audiosClicked', function(){
        self.setActiveTab(5);
    });
     	Ti.App.addEventListener('app:settingsClicked', function(){
        self.setActiveTab(6);
    });

	// TODO add focus event which is fired when tab is changed
	
	self.addEventListener('selected', function(e){
    if(e.index==0) {
        	win7.fireEvent('youGotFocus', e);
    	}
        if(e.index==1) {
        	win1.fireEvent('youGotFocus', e);
    	}
    	if(e.index==2) {
       		win2.fireEvent('youGotFocus', e);
    	}
    	if(e.index==3) {
        	win3.fireEvent('youGotFocus', e);
    	}
    	if(e.index==4) {
      		win4.fireEvent('youGotFocus', e);
    	}	
    	if(e.index==5) {
        	win5.fireEvent('youGotFocus', e);
    	}
    	if(e.index==6) {
        	win6.fireEvent('youGotFocus', e);
    	}
	});

var LoginWindow = require(FilePath+'login');
var HomeWindow = require(FilePath+'home');
var ManageWindow = require(FilePath+'manage');
var PhotosWindow = require(FilePath+'photos');
var VideosWindow = require(FilePath+'videos');
var AudiosWindow = require(FilePath+'audios');
var SettingsWindow = require(FilePath+'settings');

	//create app tabs
	var win1 = new HomeWindow(L('home')),
		win7 = new LoginWindow(L('login'));
		win2 = new ManageWindow(L('manage'));
		win3 = new PhotosWindow(L('photos'));
		win4 = new VideosWindow(L('videos'));
		win5 = new AudiosWindow(L('audios'));
		win6 = new SettingsWindow(L('settings'));

	var tab1 = Ti.UI.createTab({
		title: L('home'),
		icon: '/images/home.png',
		window: win1
	});
	win1.containingTab = tab1;

	var tab2 = Ti.UI.createTab({
		title: L('manage'),
		icon: '/images/manage.png',
		window: win2
	});
	win2.containingTab = tab2;

	var tab3 = Ti.UI.createTab({		
		//below title used for getting the name of js file to disply in window
		title: L('photos'),
		icon: '/images/photos.png',
		window: win3
	});
	win3.containingTab = tab3;
	
	var tab4 = Titanium.UI.createTab({  
    	//below title used for getting the name of js file to disply in window
    	title: L('videos'),
    	icon:'images/movies.png',
    	window:win4
	});
	win4.containingTab = tab4;
	
	var tab5 = Titanium.UI.createTab({  
    	//below title used for getting the name of js file to disply in window
    	title: L('audio'),
    	icon:'images/audio.png',
    	window:win5
	});
	win5.containingTab = tab5;	
	
	var tab6 = Titanium.UI.createTab({  
		//below title used for getting the name of js file to disply in window
    	title: L('settings'),
		icon: '/images/settings.png',
    	window:win6
	});
	win6.containingTab = tab6;	
	
	var tab7 = Titanium.UI.createTab({  
		//below title used for getting the name of js file to disply in window
    	title: L('login'),
		icon: '/images/users.png',
    	window:win7
	});
	win7.containingTab = tab7;

	self.addTab(tab7);
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	self.addTab(tab5);
	self.addTab(tab6);

	return self;
};

module.exports = ApplicationTabGroup;
