// rxjs v 5

console.log('"main.js" start');

function mapClickEventToUrlString(input) {
	var randomOffset = Math.floor(Math.random() * 500);
	return 'https://api.github.com/users?since=' + randomOffset;
}

function mapUrlStringToResponseStream(requestUrl) {
	return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
}

function getNull() {
	return null;
}

function mapUsersToRandomUser(listUsers) {
	return listUsers[ Math.floor(Math.random() * listUsers.length) ];
}

function renderSuggestion1(suggestion) {
	if (suggestion === null) {
		console.log('hide suggestion 1');
		console.log(suggestion);
	} else {
		console.log('render suggestion 1');
		console.log(suggestion);
	}
}


var refreshClickStream = Rx.Observable.fromEvent($('.refresh'), 'click');

var responseStream = refreshClickStream
	.startWith('startup click')
	.map(mapClickEventToUrlString)
	.flatMap(mapUrlStringToResponseStream)
;

var suggestion1Stream = responseStream
	.map(mapUsersToRandomUser)
	.startWith(null)
	.merge(refreshClickStream.map(getNull))
;

suggestion1Stream.subscribe(renderSuggestion1);

console.log('"main.js" stop');