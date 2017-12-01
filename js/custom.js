function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {
	var loc = getParameterByName('txt')
	var url = "https://cdn.discordapp.com/attachments/"+loc+".txt";
	if(loc)
		$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
			// filter html
			var text = data.contents.split('<').join('&lt').split('>').join('&gt').split('\n').join('<br>');
			// reformat for logs
			text = text.replace(/\[(.*)\] (\S.{0,30}\S) : (.*)/g,'<span class="name">$2</span> <span class="time">$1</span><br>$3');
			// custom emotes
			text = text.replace(/&lt(:[A-Za-z0-9-_]{2,64}:)(\d{17,20})&gt/g,'<img src="https://cdn.discordapp.com/emojis/$2.png" alt="$1">');
			$('#output').html('<a class="button" href="'+url+'">View Original</a><br><br>'+text);
			twemoji.size = '16x16';
			twemoji.parse(document.body);
		});
	else
		$('#output').html('Invalid text file');
});
