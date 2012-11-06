var querystring = require("querystring"),
		fs = require("fs"),
		awsclient = require("./awsclient");

function start(response) {
	console.log("Request handler 'start' was called.");

var body = '<html>'+
  '<head>'+
  '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
  '</head>'+
  '<body>'+
  '<form action="/query" method="post">'+
  '<select name="operation">'+
  '<option value="ItemSearch">ItemSearch</option>'+
  '</select>'+
  '<select name="searchindex">'+
  '<option value="Books">Books</option>'+
  '<option value="Video">Video</option>'+
  '</select>'+
  '<input type="text" name="keywords" />'+
  '<input type="submit" value="Query" />'+
  '</form>'+
  '</body>'+
  '</html>';

  response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function query(response, request) {
	var operation = "";
	var searchindex = "";
	var keywords = "";
	var searchresult = "empty";

	console.log("Request handler 'query' was called.");

	request.setEncoding("utf8");

  request.addListener("data", function(queryArgs) {
    console.log("Received POST data chunk '" + queryArgs + "'.");

    operation = querystring.parse(queryArgs)["operation"];
    searchindex = querystring.parse(queryArgs)["searchindex"];
    keywords = querystring.parse(queryArgs)["keywords"];
  });

  request.addListener("end", function() {
  	/* create function keeps credentials hidden for now */
    var prodAdv = awsclient.create();

		prodAdv.call(operation, {SearchIndex: searchindex, Keywords: keywords}, function(err, result) {
		  //console.log(JSON.stringify(result, null, 2));
		  searchresult = JSON.stringify(result, null, 2);

	  	response.writeHead(200, {"Content-Type": "text/plain"});
			response.write(searchresult);
			response.end();
		});
  });
}

exports.start = start;
exports.query = query;