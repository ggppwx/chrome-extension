

console.log('---------------- load content ---------------------');
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

      console.log('hello world');

      // This line is new!

    }
  }
);
var stopBackgroundTimer = function(){
	console.log('stop');
	chrome.runtime.sendMessage({backgroundTimer: "stop"}, function(response) {
  		
	});
};
var startBackgroundTimer = function(){
	console.log('start');
	chrome.runtime.sendMessage({backgroundTimer: "start"}, function(response) {
  		
	});
};

var timers = []
let gracePeriodInMs = 2000;
let timeoutInMs = 1000 * 30;
startBackgroundTimer();
timers.push(setTimeout(stopBackgroundTimer, timeoutInMs));

$(window).scroll(function() {
	// clear all timer 
	for (var i = timers.length - 1; i >= 0; i--) {
		clearTimeout(timers[i]);
	}
	timers.push(setTimeout(startBackgroundTimer, gracePeriodInMs));
	timers.push(setTimeout(stopBackgroundTimer, timeoutInMs));
	

});