var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render("index");	
});

var server = http.listen(3000);
