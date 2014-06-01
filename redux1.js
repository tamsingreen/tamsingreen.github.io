function createRedux1Link(path) {
	getTXDetails(path, convertToRedux1Link);
}

function getTXDetails(path, callback) {
  //call to retrieve TV schedule
  $.ajax({
    url: path + '.json',
    dataType: 'json',
    beforeSend: function() {}
  }).done(function(response) {
    if (response.programme.type == 'episode') {
    	var title = response.programme.display_title.title;
    	var date = response.programme.first_broadcast_date;
    	var channel = response.programme.ownership.service.id;
    	console.log("This is an episode of " + title + " at " + date + " on " + channel);   
    	callback(date,channel);
    } else {
    	console.log("This is not an episode");
    	return "Failed to retrieve tx";
    }
  }).fail(function() {
  	return "Failed to retrieve tx";
  });
}

//Convert to Redux 1 link format, eg: g.bbcredux.com/programme/bbcr4/2014-05-26/18-00-00
function convertToRedux1Link(date,channel) {
	console.log("Converting link...");
	var url = "http://devapi.bbcredux.com/programme/" + convertChannel(channel) + "/" + convertDateAndTime(date);
	console.log(url);
	return url;
}

//Convert an offset time (eg +01:00 aka BST) to UTC
function convertISODatetoUTC(date) {
	var d = new Date(Date.parse(date));
	var n = d.toISOString();
	return n;
}

//convert a programmes date & time from /programmes format eg 2012-08-22T20:45:00+01:00 
//to Redux 1 format eg 2012-08-22/19-45-00
function convertDateAndTime(dateAndTime) {
	var utcTime = convertISODatetoUTC(dateAndTime);
	var date = utcTime.substr(0,10);
	var time = utcTime.substr(11,8);
	time = time.replace(":", "-");
	time = time.replace(":", "-");
	return date + "/" + time;
}

//TODO: a default if no match found? take them to that day in the schedule?
function convertChannel(channel) {
	switch (channel) {
		case "bbc_one": //id
			return "bbcone"; //key
		case "bbc_two":
			return "bbctwo";
		case "bbc_three":
			return "bbcthree";
		case "bbc_four":
			return "bbcfour";
		case "cbbc":
			return "cbbc";
		case "cbeebies":
			return "cbeebies";
		case "bbc_news24": 
			return "bbcnews24"; 
		case "bbc_radio_one":
			return "bbcr1";
		case "bbc_1xtra":
			return "bbc1x"; 
		case "bbc_radio_two":
			return "bbcr2"; 
		case "bbc_radio_three":
			return "bbcr3"; 
		case "bbc_radio_four":
			return "bbcr4";
		case "bbc_radio_five_live":
			return "bbcr5l"; 
		case "bbc_radio_five_live_sports_extra":
			return "r5lsx";
		case "bbc_6music":
			return "bbc6m"; 
		case "bbc_radio_four_extra":
			return "bbc7";
		case "bbc_asian_network":
			return "bbcan";
		case "bbc_world_service":	 
			return "bbcws"; 
		case "bbc_parliament":
			return "bbcparl";
	}
}


