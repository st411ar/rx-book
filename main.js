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

function mapClickEventToUrlString() {
	var randomOffset = Math.floor(Math.random() * 500);
	return 'https://api.github.com/users?since=' + randomOffset;
}

function mapUrlStringToResponseStream(requestUrl) {
	return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
}

var responseStream = Rx.Observable
	.fromEvent($('.refresh'), 'click')
	.startWith('startup click')
	.map(mapClickEventToUrlString)
	.flatMap(mapUrlStringToResponseStream);

responseStream.subscribe(
	function(response) {
		// render `response` to the DOM however you wish
		console.log('subscriber catch event');
	},
	function(error) {
		// catch error event
		console.log('caught error');
		console.log(error);
	}
);

// design guidelines introduction stop


console.log('"main.js" stop');