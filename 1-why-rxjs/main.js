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

console.log('"main.js" stop');