$(document).ready(function() {
  chrome.storage.sync.get(function(items) {
    if (!chrome.runtime.error) {
        console.log(items);
        
        var urlList = []
        for( let k in items) {
            let url = k;
            let secs = items[k].total_time_in_seconds;
            urlList.push({url : url, totalSeconds: secs});
        }

        urlList.sort(function(a, b) { return b.totalSeconds - a.totalSeconds });

        for( let i = 0; i <  urlList.length; ++i) {
            let urlObj = urlList[i];
            let rowContent = '<tr>'
            rowContent += '<td>' + urlObj.url + '</td>';
            rowContent += '<td>' + urlObj.totalSeconds + '</td>';
            rowContent += '</tr>'

            $('#stat table').append(rowContent);
        }
      
    }
  });
});