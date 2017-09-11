
// Called when the user clicks on the browser action.


var CURRENT_BROWERSING_URL = undefined;
var CURRENT_TOTAL_TIMER_IN_SECONDS = 0; 
var CURRENT_TIMER = {};

setUpCleanup();
function setUpCleanup() {
  chrome.storage.sync.get("CLEAN_UP_SCHEDULER", function(record) {
    console.log(record);
    let last_cleanup =  record.last_cleanup;
    let today = new Date();
    let today_cleanup = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    console.log('today cleanup: ' + new Date(today_cleanup));
    if (last_cleanup < today_cleanup) {
      // clear first 
      cleanup();
    }

    // set clear up alarm 
    let next_cleanup = today_cleanup + 24*60*60*1000;
    console.log('next cleanup: ' + new Date(next_cleanup));
    chrome.alarms.create('job', {
        when: next_cleanup,
        periodInMinutes: 24*60
    });
  });

}

function cleanup() {
  chrome.storage.sync.clear(function(){
    chrome.storage.sync.set({ "CLEAN_UP_SCHEDULER": {
      last_cleanup : Date.now()
    }}, function() {
      // Notify that we saved.
      console.log('clean up database');
    });
  });

}

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'job') {
        cleanup();
    }
});



// utility function 
function getUrlObj(url) {
    let l = document.createElement("a");
    l.href = url;
    return l;
}




// timer class 
function Timer(name) {
  this.name = name;
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
     console.log(this.name + ' tick ' + total);
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
      "name" : this.name,
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

function initTimer(url, tabid) {
  console.log('INIT TIMER -----' + url + " tab " + tabid);

  // stop exsisiting 

  if (CURRENT_TIMER[tabid]) {

    stopTimerNew(tabid)
  }

  CURRENT_TIMER[tabid] = new Timer(url);
}



function startTimerNew(url, tabid) {
  console.log('start tab: ' + tabid);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    console.log(tabs);
    var activeUrl = getUrlObj(activeTab.url).hostname;
    console.log('current tab is ' + activeUrl);

    if (url == activeUrl) {      
      getUrlTimerStatus(url, function(url, record) {
        if(record && record[url] && record[url].  total_time_in_seconds) {
          CURRENT_TOTAL_TIMER_IN_SECONDS = record[url].total_time_in_seconds;
        } else {
          CURRENT_TOTAL_TIMER_IN_SECONDS = 0;
        }
      });

      
      CURRENT_TIMER[tabid].start();

    } else {
      console.log(url + ' is diffrent with current tab ' + activeUrl);
    }

  });
}


function stopTimerNew(tabid) {
     // save it to database

  console.log('stop tab: ' + tabid);
  if (CURRENT_TIMER[tabid] == undefined) {
    console.log();
    return;
  }

  let previous = undefined;
  if (CURRENT_TIMER[tabid]) {
    previous = CURRENT_TIMER[tabid].stop();;
  }

  if (previous === undefined) {
    console.log('no timer found ');

  } else {

     // save it to database
    let url = previous.name;
    console.log('SAVING ' + url + ' after ' + previous.count_in_seconds);
    let total = previous.count_in_seconds + CURRENT_TOTAL_TIMER_IN_SECONDS;
    let last_run = previous.end_time_in_seconds;
    saveUrlTimerStatus(url, total, last_run);

  }

}

function clearTimer(tabid) {
  stopTimerNew(tabid);
  CURRENT_TIMER[tabid] = undefined;
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


chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    console.log('background hello');


    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});




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
      let id = sender.tab.id;
      let hostname = getUrlObj(sender.tab.url).hostname;
    console.log(hostname);

    if (request.backgroundTimer == "start") {
      console.log('start timer message');
      startTimerNew(hostname, id );

    } else if (request.backgroundTimer == "stop") {
      // if out of window, stop

      // if in other window
      console.log('stop timer message');
      stopTimerNew(id);
      /*
      if (hostname === CURRENT_BROWERSING_URL) {
        console.log('stop timer message');
        stopTimer();
      } else {
        console.log('not browsing this site ignore stop ');
      }
      */

    } else if (request.backgroundTimer == 'init') {
      console.log('init backgroundTimer');
      initTimer(hostname, id);

    } else if (request.backgroundTimer == "blur") {

      console.log(hostname + ' is bluring out !!!!! ');

    }


});




chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  console.log('tab onRemoved');
  clearTimer(tabId);
});


