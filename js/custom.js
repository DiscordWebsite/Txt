const cors_url = 'https://api.allorigins.win/get?url='

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

// Document Parsing
function parseAndShowDocument(data, url, raw) {
    // filter html
    var text = data.contents.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\n').join('<br>');
    if(!raw)
    {
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
        text = text.replace(/&lt;(:[A-Za-z0-9-_]{2,64}:)(\d{17,20})&gt;/g,'<img src="https://cdn.discordapp.com/emojis/$2.png?v=1" class="emote" alt="$1">');
        text = text.replace(/&lt;a(:[A-Za-z0-9-_]{2,64}:)(\d{17,20})&gt;/g,'<img src="https://cdn.discordapp.com/emojis/$2.gif?v=1" class="emote" alt="$1">');
    }
    else
        text += "\n\n"
    // update
    $('#output').html('<a class="button" href="'+url+'">Download Original</a><br><br>'+(text.replace(/  /g,' &nbsp;')));
    //twemoji
    if(!raw)
    {
        twemoji.size = '16x16';
        twemoji.parse(document.body);
    }
}

// Loading doc and parsing
$(document).ready(function() {
    var loc = getParameterByName('txt')
    var raw = getParameterByName('raw')
    var url = "https://cdn.discordapp.com/attachments/"+loc+".txt";
    if(loc) {
        $.ajax({
            url: cors_url + url ,
            headers: {'x-requested-with': 'Discord Text Webview'},
            method: 'GET',
            success: function(data) { parseAndShowDocument(data, url, raw) },
            error: function( jqXHR, textStatus, errorThrown) {
                $('#output').html('Failed to load <b>' + url + '</b> : ' + errorThrown);
            }
        });
    } else {
        $('#output').html('No text file provided.<br><br>'
            +'This site is used to view .txt files that have been uploaded to Discord.<br><br>'
            +'For example, the file uploaded here: https://cdn.discordapp.com/attachments/147698382092238848/506154212124786689/example.txt<br><br>'
            +'Can be viewed here: https://txt.discord.website/?txt=147698382092238848/506154212124786689/example');
    }
});
