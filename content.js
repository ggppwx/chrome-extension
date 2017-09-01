

console.log('---------------- load content ---------------------');

var stopBackgroundTimer = function(){
	console.log('stop');
	chrome.runtime.sendMessage({ "backgroundTimer": "stop"}, function(response) {
  		console.log('---------');
	});
};
var startBackgroundTimer = function(){
	console.log('start');
	chrome.runtime.sendMessage({ "backgroundTimer": "start"}, function(response) {
  		console.log('------------');
	});
};

var timers = []
let gracePeriodInMs = 2000;
let timeoutInMs = 1000 * 60;
resetDetector();


function resetDetector() {
	for (var i = timers.length - 1; i >= 0; i--) {
		clearTimeout(timers[i]);
	}
	startBackgroundTimer();
	timers.push(setTimeout(stopBackgroundTimer, timeoutInMs));
}



$(window).scroll(function() {
	// clear all timer 
	resetDetector();
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

      console.log('hello world');

      // This line is new!

    } 
    if (request.message === "reset_detector") {
    	resetDetector();
    }
  }
);