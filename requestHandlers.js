var kafkaProducer = require('../util/kafkaProducer');
//var logger = require('../util/bunyan');


function start(response, request) {
	console.log("Request handler 'start' was called.");
	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" '
			+ 'content="text/html; charset=UTF-8" />' + '</head>' + '<body>'
			+ 'Hi there...!'
			+ '</body>' + '</html>';
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}
function track(response, request) 
{
		var body = "";
		//console.log("Request handler 'track' was called.");
		var origin = request.headers['origin'];
		if( !origin || origin.indexOf(".rummycircle.com")==-1 )
		{
			origin = "https://www.rummycircle.com";
		}
		response.setHeader("Access-Control-Allow-Origin", origin);
		response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,X-PINGOTHER,Origin,X-Forwarded-For');
		response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');	   
		response.setHeader('Access-Control-Allow-Credentials', 'true');

		var allCookies="";
		var cookieName="";
		var cookieValue="";
		
		origin=null;
		request.on('data', function (chunk) {
		    body += chunk;
		  });
		
		request.once('end', function ()
		{ 
				if(!body)
				{
					console.log("body is null--"+body)
					response.writeHead(404, {
						"Content-Type" : "text/plain"
					});
					response.write("404 Not found");
					response.end();
					response = request = null;
					return;
				}
					
				
				try
				{
					body = JSON.parse(body);
				}
				catch(e)
				{
					console.log("JSON parsing error:"+e+", for "+body);
					response.writeHead(404, {
						"Content-Type" : "text/plain"
					});
					response.write("404 Not found");
					response.end();
					body = response = request = null;
					return;
				}

				if(body.ajaxResponse)
				{
					body.ajaxResponse = new Buffer(body.ajaxResponse).toString('base64');
				}
					
				if(request.headers.cookie)
				{
				    allCookies = request.headers.cookie.split(";");
				    
				    for(var i=0; i<allCookies.length; i++)
				    {
				    	cookieName=allCookies[i].split("=")[0].trim();
				    	cookieValue=allCookies[i].split("=")[1].trim();
				    	if(cookieName=="new_analytics_visitor")
				    	{
				    		body.logininfoid=cookieValue;
				    	}
				    	else if(cookieName=="ga24x7_jsessionid")
				    	{
					    	cookieValue = cookieValue.substring(1,cookieValue.length-1);
					    	body.sessionid=cookieValue.split(":")[0];
					    	body.userid=cookieValue.split(":")[1];
				    	}
				    }
				}
			    var remoteIPs = "";
			    if(request.connection.remoteAddress)
			    {
			    	remoteIPs = request.connection.remoteAddress.split(":");
			    }

			    body.clientIP=request.headers['x-forwarded-for'] || remoteIPs[remoteIPs.length-1];;
			    body.http_header=JSON.stringify(request.headers);
			    
			    
			    console.log("BODY---"+JSON.stringify(body))
			    
			    request.removeAllListeners(['error','data', 'end']);
			    remoteIPs=cookieValue=allCookies=cookieName=null;
			    
			    //global.gc();
			    response.write("track called");
				response.end();
				request = response = null;
				
				kafkaProducer.kafkaProducer(JSON.stringify(body));
			    
			    body=null;
			    return;
		});
}
exports.start = start;
exports.track = track;
