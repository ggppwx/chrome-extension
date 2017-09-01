
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
var CURRENT_TOTAL_TIMER_IN_SECONDS = 0; 
var CURRENT_TIMER = new Timer("global");

// timer class 
function Timer(name) {
  var name = name;
  this.start_time_in_seconds = undefined;
  this.timer_counter = 0;
  this.interval_id = undefined;    

}

Timer.prototype.reset = function() {
    this.start_time_in_seconds = undefined;
    this.timer_counter = 0;
    this.interval_id = undefined;    
};

Timer.prototype.tick = function() {
	 let total = this.timer_counter + CURRENT_TOTAL_TIMER_IN_SECONDS;
     console.log('tick ' + total);
     this.timer_counter += 1;
};


Timer.prototype.start = function() {
  if (this.start_time_in_seconds) {
    console.log('the timer is already running.')
  } else {
    this.start_time_in_seconds = Date.now()/1000;
    this.timer_counter = 0;
    this.interval_id = setInterval( () => { // we can use 'this'
    	this.tick();
    }, 1000);
    console.log('start ticking');
  }
};

Timer.prototype.stop = function() {
  if (this.interval_id) {
    clearInterval(this.interval_id);
    var result = {
      "end_time_in_seconds" : this.start_time_in_seconds + this.timer_counter,
      "count_in_seconds" : this.timer_counter
    }
    this.reset();
    return result;
  } else {
    console.log('no timer is running');
    return undefined;
  }

};


function startTimer(url) {
  // if url is another, stop current timer. 
  console.log('ACTIVATE TIMER -----');
  if (url !== CURRENT_BROWERSING_URL) {
    // reset 
      stopTimer();  

	  CURRENT_BROWERSING_URL = url;
	  getUrlTimerStatus(CURRENT_BROWERSING_URL, function(url, record) {
	  	if(record && record[url] && record[url].	total_time_in_seconds) {
			CURRENT_TOTAL_TIMER_IN_SECONDS = record[url].total_time_in_seconds;
		} else {
			CURRENT_TOTAL_TIMER_IN_SECONDS = 0;
		}
	  });


  } else {
  	console.log('CURRENT_TOTAL_TIMER_IN_SECONDS: '+ CURRENT_TOTAL_TIMER_IN_SECONDS); 
  }
  




  CURRENT_TIMER.start();
}

function stopTimer() {
  console.log('CLEAR TIMER -----');
  let previous = CURRENT_TIMER.stop();
  if (previous === undefined) {
    console.log('no timer found ');

  } else {

     // save it to database
    console.log('SAVING ' + CURRENT_BROWERSING_URL + ' after ' + previous.count_in_seconds);
      let total = previous.count_in_seconds + CURRENT_TOTAL_TIMER_IN_SECONDS;
      let last_run = previous.end_time_in_seconds;
      saveUrlTimerStatus(CURRENT_BROWERSING_URL, total, last_run);


  }

  CURRENT_BROWERSING_URL = undefined;
  CURRENT_TOTAL_TIMER_IN_SECONDS = 0;

}

function getUrlTimerStatus(url , callback) {
  chrome.storage.sync.get(url, function(records) {
    // Notify that we saved.
    console.log('current status for url ' + url);
    console.log(records);
    callback(url, records);
  });


} 


function saveUrlTimerStatus(url, time_in_seconds, last_run){
  chrome.storage.sync.set({ [url] : {
    total_time_in_seconds : time_in_seconds,
    last_run: last_run
  }}, function() {
    // Notify that we saved.
    console.log('url saved: ' + url);

  });
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
      console.log('start timer message');
      startTimer(hostname);

    } else if (request.backgroundTimer == "stop") {

      if (hostname === CURRENT_BROWERSING_URL) {
        console.log('stop timer message');
        stopTimer();
      } else {
        console.log('not browsing this site ignore stop ');
      }



    }


});




function resetContentScrollingDetector(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    console.log('reset windows scrolling dector');
    chrome.tabs.sendMessage(activeTab.id, {"message": "reset_detector"});
  });
}






// start 
chrome.tabs.onActivated.addListener(function(evt){ 
  console.log('tab onActivated');
  chrome.tabs.getSelected(null, function(tab) {
    // alert(tab.url);  //the URL you asked for in *THIS QUESTION*
    console.log(tab.url);
    // get timer for current url 
    let url = new URL(tab.url);
    let hostname = url.origin;
    // startTimer(hostname);
    resetContentScrollingDetector();

  });

});


/*
chrome.tabs.onUpdated.addListener( function( tabId,  changeInfo,  tab) {
  let url = new URL(tab.url);
  let hostname = url.origin;
  startTimer(hostname);

});
*/