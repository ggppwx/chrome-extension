document.body.onload = function() {
  chrome.storage.sync.get(function(items) {
    if (!chrome.runtime.error) {
      console.log(items);

    }
  });
}