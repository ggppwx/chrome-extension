
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    console.log('background hello');


    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

/*
chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

   // since only one tab should be active and in the current window at once
   // the return variable should only have one entry
   var activeTab = arrayOfTabs[0];
   var activeTabId = activeTab.id; // or do whatever you need
    console.log(activeTab.url);
});
*/

var CURRENT_BROWERSING_URL = undefined;
var CURRENT_TIMER_IN_SECONDS = 0; 
var CURRENT_TIMER = new Timer("global");

// timer class 
function Timer(name) {
  this.name = name;
  this.reset();
}

Timer.prototype.reset = function() {
  this.start_time_in_seconds = undefined;
  this.timer_counter = 0;
  this.interval_id = undefined;
}

Timer.prototype.start = function() {
  if (this.start_time_in_seconds) {
    console.log('the timer is running.')
  } else {
    this.start_time_in_seconds = Date.now()/1000;
    this.timer_counter = 0;
    this.interval_id = setInterval( () => { // we can use 'this'
      console.log('tick');
      this.timer_counter += 1;
    }, 1000);
    console.log('start ticking');
  }
};

Timer.prototype.stop = function() {
  if (this.interval_id) {
    clearInterval(this.interval_id);
  }
  var result = {
    "end_time_in_seconds" : this.start_time_in_seconds + this.timer_counter,
    "count_in_seconds" : this.timer_counter
  }
  this.reset();
  return result;
};


function startTimer(url) {
  // if url is another, stop current timer. 


  CURRENT_TIMER.start()
}

function stopTimer() {
  CURRENT_TIMER.stop();
}

function getUrlTimerStatus(url) {

  chrome.storage.sync.get(url, function(records) {
    // Notify that we saved.
    console.log('current status for url ' + url);
    console.log(records);

  });


} 


function saveUrlTimerStatus(url) {

}



// data storage 
// data structre for timer
// [
//   { url , timers per day , daily limit }
// ]

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    let url = new URL(sender.tab.url);
    let hostname = url.origin;
    console.log(hostname);



    if (request.backgroundTimer == "start") {
      console.log('start timer');

    } else if (request.backgroundTimer == "stop") {
      console.log('stop timer');
    }


});











// start 
chrome.tabs.onActivated.addListener(function(evt){ 

  chrome.tabs.getSelected(null, function(tab) {
    // alert(tab.url);  //the URL you asked for in *THIS QUESTION*
    console.log(tab.url);
    // get timer for current url 
    let url = new URL(sender.tab.url);
    let hostname = url.origin;
    startTimer(hostname);


  });

});


chrome.tabs.onUpdated.addListener( function( tabId,  changeInfo,  tab) {
       console.log(tab.url);
       if(tab.url=="https://www.google.co.in/"){
            chrome.tabs.update(tab.id, {url: 'https://www.yahoo.com/'});
       }
});
