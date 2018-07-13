// rxjs v 5

console.log('"main.js" start');

// introduction start

var inputField = $('#input');
var resultsField = $('#results');

var keyups = Rx.Observable.fromEvent(inputField, 'keyup')
		.map(e => e.target.value)
		.filter(text => text.length > 2);

var throttled = keyups.throttleTime(500);

var distinct = throttled.distinctUntilChanged();

var usedObservable = distinct;

usedObservable.subscribe(
	(text) => {
		console.log('keyups event with result value: "' + text + '"');
	}
);

function searchWikipedia (term) {
    return $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: term
        }
    }).promise();
}

var suggestions = usedObservable.switchMap(searchWikipedia);

suggestions.subscribe(data => {
    var res = data[1];

    /* Do something with the data like binding */
    resultsField.empty();

    $.each(res, (_, value) => $('<li>' + value + '</li>').appendTo(resultsField));
}, error => {
    /* handle any errors */
    resultsField.empty();

    $('<li>Error: ' + error + '</li>').appendTo(resultsField);
});

// introduction stop


// design guidelines introduction start

function mapClickEventToUrlString(input) {
	console.log('mapClickEventToUrlString start');
	console.log(input);
	var randomOffset = Math.floor(Math.random() * 500);
	var urlString = 'https://api.github.com/users?since=' + randomOffset;
	console.log('mapClickEventToUrlString stop');
	return urlString;
}

function mapUrlStringToResponseStream(requestUrl) {
	console.log('mapUrlStringToResponseStream start');
	console.log('requestUrl: "' + requestUrl + '"');
	var responseStream = Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
	console.log('mapUrlStringToResponseStream stop');
	return responseStream;
}

function getNull() {
	return null;
}

function mapUsersToRandomUser(listUsers) {
	return listUsers[ Math.floor(Math.random() * listUsers.length) ];
}

function renderSuggestion1(suggestion) {
	// render the 1st suggestion to the DOM
	console.log('render suggestion 1 start');
	if (suggestion === null) {
		// hide suggestion 1 DOM element
		console.log('hide suggestion 1 DOM element start');
		console.log(suggestion);
		console.log('hide suggestion 1 DOM element stop');
	} else {
		// show suggestion 1 DOM element and render the data
		console.log('show suggestion 1 DOM element and render the data start');
		console.log(suggestion);
		console.log('show suggestion 1 DOM element and render the data stop');
	}
	console.log('render suggestion 1 stop');
}


var refreshClickStream = Rx.Observable.fromEvent($('.refresh'), 'click');

var responseStream = refreshClickStream
	.startWith('startup click')
	.map(mapClickEventToUrlString)
	.flatMap(mapUrlStringToResponseStream);

var suggestion1Stream = responseStream
	.map(mapUsersToRandomUser)
//	.startWith(null)
	.merge(refreshClickStream.map(getNull));


responseStream.subscribe(
	function(response) {
		// render `response` to the DOM however you wish
		console.log('subscriber receive event');
		console.log(response);
	},
	function(error) {
		// catch error event
		console.log('subscriber caught error');
		console.log(error);
	}
);

suggestion1Stream.subscribe(renderSuggestion1);


// design guidelines introduction stop


console.log('"main.js" stop');