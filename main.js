// rxjs v 5

console.log('"main.js" start');

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


var startupRequestStream = Rx.Observable.of('https://api.github.com/users');

var refreshButton = $('.refresh');
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

function mapClickEventToUrlString() {
	var randomOffset = Math.floor(Math.random() * 500);
	return 'https://api.github.com/users?since=' + randomOffset;
}

var requestOnRefreshStream = refreshClickStream.map(mapClickEventToUrlString);

var requestStream = Rx.Observable.merge(
	startupRequestStream, requestOnRefreshStream
);

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });

responseStream.subscribe(function(response) {
  // render `response` to the DOM however you wish
});


console.log('"main.js" stop');