/*function iniciarGAPI(){
	gapi.client.init({
		'apiKey':'AIzaSyD6-FIASfSMJH36me_ROIHvFtrnXvVW4OI',
		'discoveryDocs':['https://people.googleapis.com/$discovery/rest'],
		'clientId':'602606606274-ecquf7or8dp2fs51q332hqrt7sdk55eu.apps.googleusercontent.com',
		'scope':'profile',
	}).then(function(){
		GoogleAuth = gapi.auth2.getAuthInstance();
		console.log(GoogleAuth);
		GoogleAuth.isSignedIn.listen(updateSigninStatus);
	}).then(function(response){
		console.log(response);
	}, function(reason){
		console.log(reason);
	});
}*/

function iniciarGAPI(){
	var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
	
	gapi.client.init({
		'apiKey': key,
		'discoveryDocs': [discoveryUrl],
		'clientId': CLIENT_ID,
		'scope' : SCOPE
	}).then(function(){
		GoogleAuth = gapi.auth2.getAuthInstance();
		GoogleAuth.isSignedIn.listen(updateSigninStatus);
		var user = GoogleAuth.currentUser.get();
		console.log(user);

		$("#btn_login").click(function (){
			handleAuthClick();
		});

	}).then(function(response){
		console.log(response);
	},function(reason){
		console.log(reason);
	});


}

function handleAuthClick() {
	if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
  } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
  }
}

function updateSigninStatus(isSignedIn){
	if(isSignedIn){
		var request = gapi.client.youtube.channels.list({
			mine: true,
			part: 'contentDetails'
		});
		request.execute(function(response){
			playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
			requestVideoPlayList(playlistId);
			console.log(playlistId);
		});
	}else{
		console.log("Sin logeo");
	}
}

function validate(nombreUsuario,password){
	if(nombreUsuario != "" && password != ""){
		return true;
	}else{
		return false;
	}
}


function requestVideoPlayList(playlistId,pageToken){
	var requestOptions = {
		playlistId: playlistId,
		part: 'snippet',
		maxResults: 10
	};
	if (pageToken) {
		requestOptions.pageToken = pageToken;
	}
	var request = gapi.client.youtube.playlistItems.list(requestOptions);
	request.execute(function(response){
		nextPageToken = response.result.nextPageToken;
		var nextVis = nextPageToken ? 'visible' : 'hidden';
		console.log("nextVis",nextVis);
		prevPageToken = response.result.prevPageToken;
		var prevVis = prevPageToken ? 'visible' : 'hidden';
		console.log("prevVis",prevVis);

		var playlistItems = response.result.items;

		if(playlistItems){
			$.each(playlistItems, function(index,item){
				console.log(item);
			});
		}else{
			console.log("SIN VIDEOS");
		}

	});
}


