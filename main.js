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


responseStream.subscribe(
	function(response) {
		console.log('subscriber receive event');
		console.log(response);
	},
	function(error) {
		console.log('subscriber caught error');
		console.log(error);
	}
);

suggestion1Stream.subscribe(renderSuggestion1);


// design guidelines introduction stop


console.log('"main.js" stop');