(function(){

var songs;

function init(dataset) {
    document.body.classList.add('loaded');
    document.querySelector('#load').innerHTML = 'Searching please wait…';
    songs = dataset;
    document.querySelector('form').addEventListener('submit', getresults);
}

function getresults(ev) {
  ev.preventDefault();
  var what = +document.querySelector('input[type="radio"][name="what"]:checked').value;
  var item = document.querySelector('#s').value;
  if (item === '') {
    writeresult('<tr class="error"><td colspan="2">Please enter a search term</td></tr>');
  } else {
    if (window.Worker) { 
      var searchworker = new Worker('songsearchworker.js');
      document.body.classList.add('searching');
      searchworker.postMessage([songs, item, what]);
      searchworker.onmessage = function(e) {
        document.body.classList.remove('searching');
        writeresult(e.data);
      };
    } else {
      writeresult(searchsong(songs, item, what)); 
    }
  }
};

function writeresult(msg) {
  document.querySelector('table').innerHTML = msg;
}

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec( strData )){
        var strMatchedDelimiter = arrMatches[ 1 ];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){
            arrData.push( [] );
        }
        var strMatchedValue;
        if (arrMatches[ 2 ]){
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );
        } else {
            strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

function ajaxfetch(url){
  var request = new XMLHttpRequest();
  request.open('get',url,true);
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status && /200|304/.test(request.status)) {
        init(CSVToArray(request.responseText, ','));
      } 
    }
  }
  request.setRequestHeader('If-Modified-Since','Wed, 05 Apr 2006 00:00:00 GMT');
  request.send(null);
}
var data = ajaxfetch('/songsearch/songs.csv');

})();

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/songsearch/songsearch-sw.js', { scope: '/songsearch/' })
    .then(function(registration) {
      console.log('Service Worker Registered');
    });
  navigator.serviceWorker.ready.then(function(registration) {
      console.log('Service Worker Ready');
  });
}
