// Query string parsing
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Markdown
var rules = SimpleMarkdown.defaultRules; // for example
var parser = SimpleMarkdown.parserFor(rules);
var htmlOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'html'));

var markdown = function(source) {
    return htmlOutput(parser(source + "\n\n", {inline: false}));
};

// Loading doc and parsing
$(document).ready(function() {
	var loc = getParameterByName('txt')
	var url = "https://cdn.discordapp.com/attachments/"+loc+".txt";
	if(loc)
		$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
			// filter html
			var text = data.contents.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\n').join('<br>');
			// reformat for logs (<md> tokens for markdown later)
			// text = text.replace(/\[(.*)\] (\S.{0,70}\S) : (.*)/g,'<md/><span class="name">$2</span> <span class="time">$1</span><br><md>$3');
            // changed this line to add support for user IDs
            text = text.replace(/\[(.*)\] (\S.{0,70}?\S) (\(\d{17,20}\) )?: (.*)/g,'<md/><span class="name">$2</span> <span class="time">$3$1</span><br><md>$4');
			// markdown
			text = text.split('<md').map(s => {
				if(s.startsWith('/>'))
					return s.substring(2);
			  else if(s.startsWith('>'))
					return markdown(s.substring(1));
				else
					return markdown(s);
			}).join('');
			// custom emotes
			text = text.replace(/&lt;(:[A-Za-z0-9-_]{2,64}:)(\d{17,20})&gt;/g,'<img src="https://cdn.discordapp.com/emojis/$2.png" class="emote" alt="$1">');
			// update
			$('#output').html('<a class="button" href="'+url+'">Download Original</a><br><br>'+(text.replace(/  /g,' &nbsp;')));
			twemoji.size = '16x16';
			twemoji.parse(document.body);
		});
	else
		$('#output').html('Invalid text file');
});
