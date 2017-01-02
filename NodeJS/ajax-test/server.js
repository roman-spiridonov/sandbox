var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.', {
    cache: 0
});


function accept(req, res) {
    if (req.url == '/phones.json') {  // JSON endpoint
        // искусственная задержка для наглядности
        setTimeout(function() {
            file.serve(req, res);
        }, 2000);
    } else if(req.url == '/digits') {  // запрос к digits: plain text endpoint + постепенное формирование запроса
    	res.writeHead(200, {
    		'Content-Type': 'text/plain',
    		'Cache-Control': 'no-cache'
    	});

    	var i = 0;
    	var timer = setInterval(write, 1000);  // искусственно затягиваем формирование ответа res
    	//write();

    	function write() {
    		var str = new Array(10000).join(++i + '') + ' ';
    		console.log('Sending: ' + str.length);
    		res.write(str);  // add "11111..1 " to response
    		if(i == 9) {
    			clearInterval(timer);
    			res.end();  // send final packet
    		}
    	}

    } else {  // отдать файл, если запрос не к phones.json
        file.serve(req, res);
    }
}


// ------ запустить сервер -------

if (!module.parent) {
    http.createServer(accept).listen(8080);
} else {
    exports.accept = accept;
}
