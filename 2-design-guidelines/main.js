// rxjs v 5

console.log('"main.js" start');

const SUGGESTIONS_COUNT = 3;

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

var renderSuggestionFunctions = [];
for(var i = 0; i < SUGGESTIONS_COUNT; i++) {
	var suggestion = 'suggestion';

	var func = new Function(suggestion, 
		"var operation = suggestion === null ? 'hide' : 'render';" +
		"console.log(operation + ' suggestion ' + (" + i + "+1));" +
		"console.log(suggestion);"
	);

	renderSuggestionFunctions[i] = func;
}


var refreshClickStream = Rx.Observable.fromEvent($('.refresh'), 'click');

var responseStream = refreshClickStream
	.startWith('startup click')
	.map(mapClickEventToUrlString)
	.flatMap(mapUrlStringToResponseStream)
;

var suggestionStreams = [];
for (var i = 0; i < SUGGESTIONS_COUNT; i++) {
	var stream = responseStream
		.map(mapUsersToRandomUser)
		.startWith(null)
		.merge(refreshClickStream.map(getNull))
	;
	suggestionStreams.push(stream);
}

for (var i = 0; i < SUGGESTIONS_COUNT; i++) {
	suggestionStreams[i].subscribe(renderSuggestionFunctions[i]);
}

console.log('"main.js" stop');