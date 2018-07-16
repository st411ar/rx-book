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

function mapUsersToRandomUser(click, listUsers) {
	return listUsers[ Math.floor(Math.random() * listUsers.length) ];
}

function renderSuggestion(orderNumber, suggestion) {
	var isHide = suggestion === null;

	var selector = '#suggestion' + orderNumber;
	var element = $(selector);
	if (isHide) {
		element.hide();
	} else {
		$('img', element)[0].src = suggestion.avatar_url;
		var link = $('a', element)[0];
		link.href = suggestion.html_url;
		link.textContent = suggestion.login;

		element.show();
	}
}

var renderSuggestionFunctions = [];
for(var i = 0; i < SUGGESTIONS_COUNT; i++) {
	var suggestion = 'suggestion';

	renderSuggestionFunctions[i] = new Function(
		suggestion,
		"var orderNumber = " + i + " + 1;" +
		"renderSuggestion(orderNumber, suggestion);"
	);
}


var refreshClickStream = Rx.Observable.fromEvent($('.refresh'), 'click');

var closeClickStreams = [];
for (var i = 0; i < SUGGESTIONS_COUNT; i++) {
	var selector = '#close' + (i + 1);
	closeClickStreams.push(Rx.Observable.fromEvent($(selector), 'click'));
}

var responseStream = refreshClickStream
	.startWith('startup click')
	.map(mapClickEventToUrlString)
	.flatMap(mapUrlStringToResponseStream)
	.catch(
		function(error, caught) {
			console.log('error interception');
			return refreshClickStream.map(getNull);
		}
	);

var suggestionStreams = [];
for (var i = 0; i < SUGGESTIONS_COUNT; i++) {
	var stream = closeClickStreams[i]
		.startWith('startup click')
		.combineLatest(responseStream, mapUsersToRandomUser)
		.merge(refreshClickStream.map(getNull))
		.startWith(null);
	suggestionStreams.push(stream);
}

for (var i = 0; i < SUGGESTIONS_COUNT; i++) {
	suggestionStreams[i].subscribe(
		renderSuggestionFunctions[i],
		function(error) {
			console.log('catch error');
			console.log(error);
		}
	);
}

console.log('"main.js" stop');