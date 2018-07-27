// rxjs v 5

console.log('"main.js" start');

var inputField = $('#input');
var resultsField = $('#results');

/* Only get the value from each key up */
var keyups = Rx.Observable.fromEvent(inputField, 'keyup')
        .map(e => e.target.value)
        .filter(text => text.length > 2);

/* Now throttle/debounce the input for 500ms */
// migration 4 -> 5 : throttle -> throttleTime
var throttled = keyups.throttleTime(500);

/* Now get only distinct values,
so we eliminate the arrows and other control characters */
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

// migration 4 -> 5 : flatMapLatest -> switchMap
var suggestions = usedObservable.switchMap(searchWikipedia);

suggestions.subscribe(
    data => {
        var res = data[1];

        /* Do something with the data like binding */
        resultsField.empty();

        $.each(
            res,
            (_, value) => $('<li>' + value + '</li>').appendTo(resultsField)
        );
    },
    error => {
        /* handle any errors */
        resultsField.empty();

        $('<li>Error: ' + error + '</li>').appendTo(resultsField);
    }
);

console.log('"main.js" stop');