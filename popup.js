document.body.onload = function() {
  chrome.storage.sync.get(function(items) {
    if (!chrome.runtime.error) {
      console.log(items);
      
      for( let k in items) {
      	let url = k;
      	let secs = items[k].total_time_in_seconds;
      	let rowContent = '<tr>'
      	rowContent += '<td>' + url + '</td>';
      	rowContent += '<td>' + secs + '</td>';
      	rowContent += '</tr>'

      	$('#stat table').append(rowContent);
      }
      
    }
  });
}