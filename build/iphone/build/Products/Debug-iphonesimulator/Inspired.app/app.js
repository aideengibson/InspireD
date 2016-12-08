/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
 * A starting point for tab-based application with multiple top-level windows.
 * Requires Titanium Mobile SDK 1.8.0+.
 *
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *
 */

//bootstrap and check dependencies
if (Ti.version < 1.8) {
  alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
  //determine platform and form factor and render approproate components
  var osname = Ti.Platform.osname,
    version = Ti.Platform.version,
    height = Ti.Platform.displayCaps.platformHeight,
    width = Ti.Platform.displayCaps.platformWidth;

  function checkTablet() {
    var platform = Ti.Platform.osname;

    switch (platform) {
      case 'ipad':
        return true;
      case 'android':
        var psc = Ti.Platform.Android.physicalSizeCategory;
        var tiAndroid = Ti.Platform.Android;
        return psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_LARGE || psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_XLARGE;
      default:
        return Math.min(
          Ti.Platform.displayCaps.platformHeight,
          Ti.Platform.displayCaps.platformWidth
        ) >= 400
    }
  }

  var isTablet = checkTablet();

  var FilePath;
  if (isTablet) {
    FilePath = 'ui/tablet/';
  } else {
    FilePath = 'ui/handheld/';
  }

  var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
  new ApplicationTabGroup(FilePath).open();
  
  // below all of the settings for a user are defined  
  //var standardfonttype = define here 
  var standardfontsize = 40;
  var buttonfontsize = 30;
  var enhancedfontsize = 50;
  var standardvolume = 30;
  var enhancedvolume = 'max';
  var currentdeviceid = Ti.Platform.id;
  
  	Ti.App.Properties.setString('appstatus', 'active'); //relates to gathering usage data. Rule - no usage data is collected after study ends
  	Ti.App.Properties.setString('sessionstatus', 'passive'); //relates to actual individual session. Rule - set if appstatus is active so that question will be displayed at end
   	Ti.App.Properties.setString('currentDevice', currentdeviceid);
  	Ti.App.Properties.setString('currentPic', 'empty_image.png');
  	Ti.App.Properties.setString('currentUser', 'Admin');
  	Ti.App.Properties.setString('currentPartner', 'None');// this is for displaying person's name in the question screen'
  	Ti.App.Properties.setString('currentUserType', 'ADMIN');// 3 possible types ADMIN, PWD, Carer
  	Ti.App.Properties.setString('appbuttoncolor', '#008080'); //light green
  	Ti.App.Properties.setString('appbuttonselectedcolor', '#006666'); //dark green
	Ti.App.Properties.setString('apptoolbarcolor', '#B6B6B6'); //dark gray
	Ti.App.Properties.setString('appfontcolor', '#000000');  //black
	Ti.App.Properties.setString('appfontsize', standardfontsize); 
	Ti.App.Properties.setString('btnfontsize', buttonfontsize); 
	Ti.App.Properties.setString('appfontfamily', 'Verdana'); 
	Ti.App.Properties.setString('appbkgrdcolor', '#fff');  //white
	Ti.App.Properties.setString('youtubechannel', 'UCHq777_waKMJw6SZdABmyaA'); 
	Ti.App.Properties.setString('youtubesearch', ''); 
	Ti.App.Properties.setString('Question_Asked', 'No');
	Ti.App.Properties.setString('Timer_Started', 0);
	Ti.App.Properties.setString('T_Minutes', 7);
	Ti.App.Properties.setString('T_Seconds', 1);
	Ti.App.Properties.setString('Volume', 'Max');
	Ti.App.Properties.setString('EmailAddress', 'inspired@ulster.ac.uk');
	Ti.App.Properties.setString('FlickRKey', '664dfb84932afc9f1c2180ec64179927');
	Ti.App.Properties.setString('YouTubeAPI', 'AIzaSyBoMQ4xiwxLn2N1mOAsPTb2HYIofvBkTa4');  
})();
