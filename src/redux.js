var TMTR = {

	//TODO: when on a brand or series page, search for it and present the Redux search results page
	goToRedux: function (path) {
		var txData = this.getTXDetails(path),
				self = this;
		
		txData.done(function(response) {
			if (response.programme.type === 'episode') {
		    var date = response.programme.first_broadcast_date;
			  var channel = response.programme.ownership.service.id;   
			  var reduxURL = self.convertToRedux1Link(date, channel);
				self.openReduxLink(reduxURL);
	    } else {
		    displayErrorMessage(
	        'This looks like a ' + response.programme.type + ' page URL - please supply an episode page URL'
	      );
	    }
		});
		
		txData.fail(function() {
			self.displayErrorMessage(
	      'Failed to retrieve programme information - have you entered a bbc.co.uk/programmes URL?'
	    );
		});
	},

	displayErrorMessage: function (message) {
	  var errorDiv = $('#url-error')
	  errorDiv.attr({
	    class: 'alert alert-danger',
	    role: 'alert',
	    display: 'inline-block'
	  });
	  errorDiv.html(message);
	},

	openReduxLink: function (link) {
		window.open(link, '_self');
	},

	//call to receive JSON data from the page
	getTXDetails: function (path) {
	  var reduxURL;
	  return $.ajax({
			url: path + '.json',
	    dataType: 'json'
	  });
	},

	/*Convert a date, time and programme title supplied from the /programmes API to Redux 1 link
	 format, eg: g.bbcredux.com/programme/bbcr4/2014-05-26/18-00-00 */
	convertToRedux1Link: function (date,channel) {
		var url = "https://g.bbcredux.com/programme/" + this.convertChannel(channel) + "/" + this.convertDateAndTime(date);
		return url;
	},

	//Convert an offset time (eg +01:00 aka BST) to UTC
	convertISODatetoUTC: function (date) {
		var d = new Date(Date.parse(date));
		var n = d.toISOString();
		return n;
	},

	//Convert a programme's date & time from /programmes format eg 2012-08-22T20:45:00+01:00 
	//to Redux 1 format eg 2012-08-22/19-45-00
	convertDateAndTime: function (dateAndTime) {
		var utcTime = this.convertISODatetoUTC(dateAndTime);
		var date = utcTime.substr(0,10);
		var time = utcTime.substr(11,8);
		time = time.replace(":", "-");
		time = time.replace(":", "-");
		return date + "/" + time;
	},

	//TODO: a default if no match found? take them to that day in the schedule?
	convertChannel: function (channel) {
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
	},

	onClick: function (event) {
		event.preventDefault();
		var url = $('#url').val();
		TMTR.goToRedux(url);
	}
}

