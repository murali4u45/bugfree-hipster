console.log("fghfh")
var http = require("http");

var url = require("url");

var requestHandlers = require("../routes/requestHandlers");

require('heapdump');

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/trackdata"] = requestHandlers.track;

//var count=0;
var server = http.createServer(function(request, response)
{
	//count++;
	var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received." +count);

	
	if (typeof handle[pathname] === 'function')
	{
		handle[pathname](response, request);
	}
	else
	{
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {
			"Content-Type" : "text/plain"
		});
		response.write("404 Not found");
		response.end();
	}
	
	/*if(count==1000)
		{
		console.log("count--- "+count);
		global.gc();
		count=0;
		}*/
	
});



/*Below Checks the error.log file and sends the mail if there are any ERROR OR the server Starts*/
//require('chokidar').watch('../logs/error.log', {ignored: /[\/\\]\./}).on('all', function(event, path) {	
//	console.log(event, path);
//	mailer.sendmail();
//});

server.listen(3000);
console.log("SERVER STARTED")
