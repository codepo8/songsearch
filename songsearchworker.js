onmessage = function(e) {
  postMessage(searchsong(e.data[0], e.data[1], e.data[2]));
}

function searchsong(songs, item, what) {
  var out = [];
  var i;
  var msg;
  var itemmatch = new RegExp(item, "i");
  var all = songs.length;
  for (i = 0; i < all; i++) {
      var s = (+what === 2) ? songs[i][0] + ' ' + songs[i][1] : songs[i][what];
      if (s.search(itemmatch) !== -1) {
        out.push( 
          '<tr><td>' +
              songs[i][0].replace(item,'<strong>'+item+'</strong>') +
          '</td><td>' + 
              songs[i][1].replace(item,'<strong>'+item+'</strong>') + 
          '</td></tr>' 
        );
      }
  }
  if (!out[0]) {
      msg = '<tr class="error"><td colspan="2">' +
        'Nothing found for <strong>' + item + '</strong> :(' +
        '</td></tr>';
  } else {
      msg = '<tr><th>Artist</th><th>Song</th><tr>' + out.join(''); 
  }
  return msg;
}
