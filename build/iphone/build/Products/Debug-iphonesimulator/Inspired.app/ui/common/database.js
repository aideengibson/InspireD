//create the database object
var db = Titanium.Database.open('mydb');

db.execute('CREATE TABLE IF NOT EXISTS intervention (ID INTEGER PRIMARY KEY AUTOINCREMENT, STARTED TEXT, STARTDATE TEXT, ENDDATE TEXT)');

//execute the table create script for question bank
db.execute('CREATE TABLE IF NOT EXISTS answers (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERTYPE TEXT, PLATFORMID TEXT, QUESTIONNUMBER TEXT, USERANSWER TEXT, ANSWERDATETIME TEXT)');

//execute the table create script - the mane of the image is always the name WITHOUT the extention - the App assumes all photos are of type .jpg
db.execute('CREATE TABLE IF NOT EXISTS photos (ID INTEGER PRIMARY KEY AUTOINCREMENT, IMAGE TEXT, YEAR TEXT, TAG1 TEXT, TAG2 TEXT, TAG3 TEXT, DESC TEXT)');

//execute the table create script - the mane of the image is always the name WITHOUT the extention - the App assumes all photos are of type .jpg
db.execute('CREATE TABLE IF NOT EXISTS audios (ID INTEGER PRIMARY KEY AUTOINCREMENT, IMAGE TEXT, TITLE TEXT)');


//execute the table create script
db.execute('CREATE TABLE IF NOT EXISTS videos (ID INTEGER PRIMARY KEY AUTOINCREMENT, VIDEO TEXT, IMAGE TEXT, YEAR TEXT, TAG1 TEXT, TAG2 TEXT, TAG3 TEXT, DESC TEXT)');

//execute the table create script
db.execute('CREATE TABLE IF NOT EXISTS users (ID INTEGER PRIMARY KEY AUTOINCREMENT, EMAIL TEXT, USERNAME TEXT, PASSWORD TEXT, PHOTO TEXT, MAINUSER TEXT, FLICKRACC TEXT, YOUTUBEACC TEXT)');

//execute the table create script
db.execute('CREATE TABLE IF NOT EXISTS songs (ID INTEGER PRIMARY KEY AUTOINCREMENT, TITLE TEXT, ARTIST TEXT, YOUTUBEID TEXT, YOUTUBEURL TEXT, YOUTUBEEMBED TEXT)');

//execute the table create script
db.execute('CREATE TABLE IF NOT EXISTS favorites (ID INTEGER PRIMARY KEY AUTOINCREMENT, SONGID INTEGER, TITLE TEXT, ARTIST TEXT, YOUTUBEEMBED TEXT)');

//execute the table create script
db.execute('CREATE TABLE IF NOT EXISTS audit (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERTYPE TEXT, PLATFORMID TEXT, CONTROL TEXT, EXACTTIME TEXT, SENT TEXT)');

//execute the table create script
db.execute('CREATE TABLE IF NOT EXISTS archive (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERTYPE TEXT, PLATFORMID TEXT, CONTROL TEXT, EXACTTIME TEXT, SENT TEXT)');

function insertAnswer(newusertype, newplatformid, newquestionnumber, newuseranswer, newanswerdt) {
	db.execute('INSERT INTO answers (usertype, platformid, questionnumber, useranswer, answerdatetime) VALUES (?,?,?,?,?)', newusertype, newplatformid, newquestionnumber, newuseranswer, newanswerdt);
	return db.lastInsertRowId;
}

function deleteAnswer(answerid) {
	var sql = "DELETE from answers WHERE id = " + answerid;
	
	// delete record from the database
	db.execute(sql);
}

function getAnswers(usertype) {
	var results = [];
	//var resultSet = db.execute('SELECT * FROM answers');
	var resultSet = db.execute('SELECT * FROM answers WHERE usertype =?', usertype);
	
	while (resultSet.isValidRow()) {
			results.push({
		     id: resultSet.fieldByName('id'),
		   	 usertype: resultSet.fieldByName('usertype'),
		   	 platformid: resultSet.fieldByName('platformid'),
			 questionnumber: resultSet.fieldByName('questionnumber'),
		   	 useranswer: resultSet.fieldByName('useranswer'),
		   	 answerdatetime: resultSet.fieldByName('answerdatetime')
		   	  });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

//Audit details

function insertAuditlog(newusertype, newplatformid, newcontrol, newexacttime, newsent){ 
	db.execute('INSERT INTO audit (usertype, platformid, control, exacttime, sent) VALUES (?,?,?,?,?)', newusertype, newplatformid, newcontrol, newexacttime, newsent);
	//return db.lastInsertRowId;
}

function deleteAuditlog(auditid) {
	//var sql = 'DELETE FROM audit WHERE id =?', auditid;
	var sql = "DELETE from audit WHERE id = " + auditid;
	db.execute(sql);
}

function deleteAllAuditlogs() {
	var sql = "DELETE FROM audit";
	db.execute(sql);
};

function getAuditlog(auditid) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM audit WHERE id =?', auditid);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  usertype: resultSet.fieldByName('usertype'),
		   	  platformid: resultSet.fieldByName('platformid'),
		   	  control: resultSet.fieldByName('control'),
		   	  exacttime: resultSet.fieldByName('exacttime'),
		   	  sent: resultSet.fieldByName('sent')        
		   	  });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getAuditlogs() {
	var sql = "SELECT * FROM audit ORDER BY sent ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  usertype: resultSet.fieldByName('usertype'),
		   	  platformid: resultSet.fieldByName('platformid'),
		   	  control: resultSet.fieldByName('control'),
		   	  exacttime: resultSet.fieldByName('exacttime'),
		   	  sent: resultSet.fieldByName('sent')  
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

//audit archive details

function insertArchivelog(newusertype, newplatformid, newcontrol, newexacttime, newsent){ 
	db.execute('INSERT INTO archive (usertype, platformid, control, exacttime, sent) VALUES (?,?,?,?,?)', newusertype, newplatformid, newcontrol, newexacttime, newsent);
	return db.lastInsertRowId;
}

function deleteArchivelog(archiveid) {
	//var sql = 'DELETE FROM audit WHERE id =?', arciveid;
	var sql = "DELETE from audit WHERE id = " + archiveid;
	db.execute(sql);
}

function getArchivelog(archiveid) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM audit WHERE id =?', archiveid);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  usertype: resultSet.fieldByName('usertype'),
		   	  control: resultSet.fieldByName('control'),
		   	  exacttime: resultSet.fieldByName('exacttime'),
		   	  sent: resultSet.fieldByName('sent')        
		   	  });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getArchivelogs() {
	var sql = "SELECT * FROM archive ORDER BY sent ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  usertype: resultSet.fieldByName('usertype'),
		   	  control: resultSet.fieldByName('control'),
		   	  exacttime: resultSet.fieldByName('exacttime'),
		   	  sent: resultSet.fieldByName('sent')  
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

// end auditarchive details

// Intervention details
function insertIntervention(newstarted, newstartdate, newenddate){
	db.execute('INSERT INTO intervention (started, startdate, enddate) VALUES (?,?,?)', newstarted, newstartdate, newenddate);
	return db.lastInsertRowId;	
};

function deleteIntervention(interventionstatus) {
	var sql = 'DELETE FROM intervention WHERE started =?', interventionstatus;
	db.execute(sql);
}

function getIntervention(started) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM intervention WHERE started =?', started);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  started: resultSet.fieldByName('started'),
		   	  startdate: resultSet.fieldByName('startdate'),
		   	  enddate: resultSet.fieldByName('enddate')	        
		   	  });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getInterventions() {
	var sql = "SELECT * FROM intervention ORDER BY started ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  started: resultSet.fieldByName('started'),
		   	  startdate: resultSet.fieldByName('startdate'),
		   	  enddate: resultSet.fieldByName('enddate')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

//Audio details

function insertAudio(newimage, newtitle) {
	db.execute('INSERT INTO audios (image, title) VALUES (?,?)', newimage, newtitle);
	return db.lastInsertRowId;
}

function deleteAudio(audioid) {
	var sql = "DELETE from audios WHERE id = " + audioid;
	// delete record from the database
	db.execute(sql);
}

function getAudio(photo) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM audios WHERE image =?', photo);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  image: resultSet.fieldByName('image'),
		   	  title: resultSet.fieldByName('title')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getAudios() {
	var sql = "SELECT * FROM audios ORDER BY image ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  image: resultSet.fieldByName('image'),
		   	  title: resultSet.fieldByName('title')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

//Photo details
function insertPhoto(newimage, newyear, newtag1, newtag2, newtag3, newdesc) {
	db.execute('INSERT INTO photos (image, year, tag1, tag2, tag3, desc) VALUES (?,?,?,?,?,?)', newimage, newyear, newtag1, newtag2, newtag3, newdesc);
	return db.lastInsertRowId;
}

function deletePhoto(photoid) {
	//var sql = 'DELETE FROM photos WHERE id =?', photoid;
	var sql = "DELETE from photos WHERE id = " + photoid;
	db.execute(sql);
}

function getPhoto(photo) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM photos WHERE image =?', photo);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  image: resultSet.fieldByName('image'),
		   	  year: resultSet.fieldByName('year'),
		   	  tag1: resultSet.fieldByName('tag1'),
		   	  tag2: resultSet.fieldByName('tag2'),
		   	  tag3: resultSet.fieldByName('tag3'),
		   	  desc: resultSet.fieldByName('desc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getPhotos() {
	var sql = "SELECT * FROM photos ORDER BY image ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  image: resultSet.fieldByName('image'),
		   	  year: resultSet.fieldByName('year'),
		   	  tag1: resultSet.fieldByName('tag1'),
		   	  tag2: resultSet.fieldByName('tag2'),
		   	  tag3: resultSet.fieldByName('tag3'),
		   	  desc: resultSet.fieldByName('desc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	
//Video details

function insertVideo(newvideo, newimage, newyear, newtag1, newtag2, newtag3, newdesc) {
	db.execute('INSERT INTO videos (video, image, year, tag1, tag2, tag3, desc) VALUES (?, ?,?,?,?,?,?)', newvideo, newimage, newyear, newtag1, newtag2, newtag3, newdesc);
	return db.lastInsertRowId;
}

function deleteVideo(video) {
	//var sql = 'DELETE FROM videos WHERE video =?', video;
	var sql = "DELETE FROM videos WHERE video = " + video;
	
	db.execute(sql);
}

function getVideo(video) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM videos WHERE video =?', video); 
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		      video: resultSet.fieldByName('video'),
		   	  image: resultSet.fieldByName('image'),
		   	  year: resultSet.fieldByName('year'),
		   	  tag1: resultSet.fieldByName('tag1'),
		   	  tag2: resultSet.fieldByName('tag2'),
		   	  tag3: resultSet.fieldByName('tag3'),
		   	  desc: resultSet.fieldByName('desc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getVideoImage(photo) {
	var results = [];  
	var resultSet = db.execute('SELECT * FROM videos WHERE image =?', photo);
    while (resultSet.isValidRow()) {
			results.push({
		     id: resultSet.fieldByName('id'),
		      video: resultSet.fieldByName('video'),
		   	  image: resultSet.fieldByName('image'),
		   	  year: resultSet.fieldByName('year'),
		   	  tag1: resultSet.fieldByName('tag1'),
		   	  tag2: resultSet.fieldByName('tag2'),
		   	  tag3: resultSet.fieldByName('tag3'),
		   	  desc: resultSet.fieldByName('desc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	


function getVideos() {
	var sql = "SELECT * FROM videos ORDER BY video ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		      video: resultSet.fieldByName('video'),
		   	  image: resultSet.fieldByName('image'),
		   	  year: resultSet.fieldByName('year'),
		   	  tag1: resultSet.fieldByName('tag1'),
		   	  tag2: resultSet.fieldByName('tag2'),
		   	  tag3: resultSet.fieldByName('tag3'),
		   	  desc: resultSet.fieldByName('desc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

// end video details

//user details
function insertUser(newEmail, newUsername, newPassword, newPhoto, newMainuser, newFlickrAcc, newYouTubeAcc) {
	db.execute('INSERT INTO users (email, username, password, photo, mainuser, flickracc, youtubeacc) VALUES (?,?,?,?,?,?,?)', newEmail, newUsername, newPassword, newPhoto, newMainuser, newFlickrAcc, newYouTubeAcc);
	return db.lastInsertRowId;
}

function amendUser(id, username, newFlickrAcc) {
	db.execute('UPDATE users SET flickracc = ? WHERE id = ?', newFlickrAcc, id);
	return getUser(username);
};

// e.g. .execute('UPDATE uzerz SET image = ? WHERE username = ?', changedImage, USERNAMElogin);

function deleteUser(id) {
	var sql = "DELETE from users WHERE id = " + id;
	
	// delete record from the database
	db.execute(sql);
};

function getMainUser(mainuser) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM users WHERE mainuser =?', mainuser);
	while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  email: resultSet.fieldByName('email'),
		   	  username: resultSet.fieldByName('username'),
			  password: resultSet.fieldByName('password'),
		   	  photo: resultSet.fieldByName('photo'),
		   	  mainuser: resultSet.fieldByName('mainuser'),
		   	  flickracc: resultSet.fieldByName('flickracc'),
		   	  youtubeacc: resultSet.fieldByName('youtubeacc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getUser(username) {
	var results = [];
	var resultSet = db.execute('SELECT * FROM users WHERE username =?', username);
	while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  email: resultSet.fieldByName('email'),
		   	  username: resultSet.fieldByName('username'),
			  password: resultSet.fieldByName('password'),
		   	  photo: resultSet.fieldByName('photo'),
		   	  mainuser: resultSet.fieldByName('mainuser'),
		   	  flickracc: resultSet.fieldByName('flickracc'),
		   	  youtubeacc: resultSet.fieldByName('youtubeacc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function getUsers() {
	var results = [];
	var resultSet = db.execute('SELECT * FROM users ORDER BY username ASC');
	while (resultSet.isValidRow()) {
			results.push({
		     id: resultSet.fieldByName('id'),
		   	 email: resultSet.fieldByName('email'),
		   	 username: resultSet.fieldByName('username'),
			 password: resultSet.fieldByName('password'),
		   	 photo: resultSet.fieldByName('photo'),
		   	  mainuser: resultSet.fieldByName('mainuser'),
		   	 flickracc: resultSet.fieldByName('flickracc'),
		   	 youtubeacc: resultSet.fieldByName('youtubeacc')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

// end user details

function insertSong(title, artist, youtubeid, youtubeurl, youtubeembed) {
	var sql = "INSERT INTO songs (title, artist, youtubeid, youtubeurl, youtubeembed) VALUES (";
	sql = sql + "'" + title.replace("'", "''") + "', ";
	sql = sql + "'" + artist.replace("'", "''") + "', ";
	sql = sql + "'" + youtubeid.replace("'", "''") + "', ";
	sql = sql + "'" + youtubeurl.replace("'", "''") + "', ";
	sql = sql + "'" + youtubeembed.replace("'", "''") +"')";
	db.execute(sql);
	return db.lastInsertRowId;
}

function deleteSong(id) {
	var sql = "DELETE FROM songs WHERE id = " + id;
	db.execute(sql);
}

function getSongs() {
	var sql = "SELECT * FROM songs ORDER BY title ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		   	  title: resultSet.fieldByName('title'),
		   	  artist: resultSet.fieldByName('artist'),
			  youtubeid: resultSet.fieldByName('youtubeid'),
		   	  youtubeurl: resultSet.fieldByName('youtubeurl'),
		   	  youtubeembed: resultSet.fieldByName('youtubeembed')
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}	

function insertFavorite(songid, title, artist, youtubeembed) {
	var sql = "SELECT * FROM favorites WHERE songid = " + songid;
	var rows = db.execute(sql);
	if(rows.isValidRow()){
    	//means already saved in favorites
	}
	else{
    	//need to add it in
    	sql = "";
    	sql = sql+"INSERT INTO favorites (songid, title, artist, youtubeembed) VALUES (";
		sql = sql + "'" + songid.replace("'", "''") + "', ";
		sql = sql + "'" + title.replace("'", "''") + "', ";
		sql = sql + "'" + artist.replace("'", "''") + "', ";
		sql = sql + "'" + youtubeembed.replace("'", "''") +"')";
		db.execute(sql);
	}   	
	return db.lastInsertRowId;		
};

function deleteFavorite(id) {
	var sql = "DELETE FROM favorites WHERE songid = " + id;
	db.execute(sql);
};

function deleteAllFavorites() {
	var sql = "DELETE FROM favorites";
	db.execute(sql);
};

function getFavorites() {
var sql = "SELECT * FROM favorites ORDER BY title ASC";
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		      songid: resultSet.fieldByName('songid'),
		   	  title: resultSet.fieldByName('title'),
		   	  artist: resultSet.fieldByName('artist'),
			  youtubeembed: resultSet.fieldByName('youtubeembed')
	        });
	resultSet.next();
    }
    resultSet.close();		
	return results;	
}