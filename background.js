
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    console.log('background hello');


    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});


chrome.tabs.onUpdated.addListener( function( tabId,  changeInfo,  tab) {
       chrome.extension.getBackgroundPage().console.log(tab.url);
       if(tab.url=="https://www.google.co.in/"){
            chrome.tabs.update(tab.id, {url: 'https://www.yahoo.com/'});
       }
});