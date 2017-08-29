
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



$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
        console.log('Scroll up');
    }
    else {
        console.log('Scroll down');
    }
});



chrome.tabs.onActivated.addListener(function(evt){ 

  chrome.tabs.getSelected(null, function(tab) {
    alert(tab.url);  //the URL you asked for in *THIS QUESTION*

    // get timer for current url 




  });

});


chrome.tabs.onUpdated.addListener( function( tabId,  changeInfo,  tab) {
       console.log(tab.url);
       if(tab.url=="https://www.google.co.in/"){
            chrome.tabs.update(tab.id, {url: 'https://www.yahoo.com/'});
       }
});
