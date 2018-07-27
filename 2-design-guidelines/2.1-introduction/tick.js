// rxjs v 5

console.log('"tick.js" start');

var tickButton = $('#tick');
var tickStream = Rx.Observable.fromEvent(tickButton, 'click');
var tickUnitStream = tickStream.mapTo(1);
var tickCounterStream = tickUnitStream.scan(
	(accumulator, nextValue) => accumulator + nextValue
);

tickStream.subscribe(() => console.log('"tick" button has been clicked'));
tickUnitStream.subscribe(console.log);
tickCounterStream.subscribe(console.log);

console.log('"tick.js" stop');