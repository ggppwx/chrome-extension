
  // Handler for .ready() called.
  function onchange() {
  	console.log('afasfasfadsfafa');
  }

  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);








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


function resetDetector() {
	for (var i = timers.length - 1; i >= 0; i--) {
		clearTimeout(timers[i]);
	}	
	timers.push(setTimeout(stopBackgroundTimer, timeoutInMs));
}


startBackgroundTimer();

$(window).scroll(function() {
	// clear all timer 
	// startBackgroundTimer();
	// resetDetector();
});


$(window).focus(function() {
    window_focus = true;
    console.log('focus');
    startBackgroundTimer();

}).blur(function() {
    window_focus = false;
    console.log('blur');
    stopBackgroundTimer();
    chrome.runtime.sendMessage({ "backgroundTimer": "blur"}, function(response) {
  		console.log('------------');
	});


});
document.addEventListener('visibilitychange', function(){
    console.log('change');
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

      console.log('hello world');

      // This line is new!

    } 
    if (request.message === "reset_detector") {
    	// resetDetector();
    }
  }
);
