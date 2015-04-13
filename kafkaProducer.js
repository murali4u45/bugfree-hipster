var kafka = require('kafka-node');
//var logger = require('../util/bunyan.js');
var client = new kafka.Client('192.168.50.53:2181');
var producer = new kafka.Producer(client, {
	requireAcks : 0,
	ackTimeoutMs : 100
});

client.once('error', function(err)
{
	//logger.info({err: err}, "Error in client");
	client = new kafka.Client('192.168.50.53:2181');
	producer = new kafka.Producer(client, {
		requireAcks : 0,
		ackTimeoutMs : 100
	});
	return;
});

client.once('close', function(err)
{
	//logger.info({err: err}, "Closing client");
	client = new kafka.Client('192.168.50.53:2181');
	producer = new kafka.Producer(client, {
		requireAcks : 0,
		ackTimeoutMs : 100
	});
	return;
});

producer.once('error', function(err)
{
	//logger.info({err: err}, "Error in producer");
	producer = new kafka.Producer(client, {
		requireAcks : 0,
		ackTimeoutMs : 100
	});
	return;
})

console.log("kafkaProducer");
function kafkaProducer(params/*,callback*/)
{
	////logger.info({req: params}, "Request in producer");
	var payloads = [{
		topic : 'testKafkatopicMurali',
		messages : params
	}];
	
	producer.send(payloads, function(err, data)
	{
		if (err)
		{
			// return callback(err);
			////logger.info({err: err}, "Send error!");
			return;
		}
		console.log("data--"+JSON.stringify(data))
		return;
	});
	payloads = null;
	return;
}
exports.kafkaProducer = kafkaProducer;
