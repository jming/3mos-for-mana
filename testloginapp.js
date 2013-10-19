var express = require('express'), request = require('request');
var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/');
  //app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.get('/loginauth', function(req,res){
	var url = 'https://runkeeper.com/apps/token';
	var headers = {'Content-Type':'application/x-www-form-urlencoded'};
	var form = {
		grant_type: 'authorization_code',
		code: req.query.code,
		client_id: '4ddf3756df6c4be489cb71397e9f36cb',
		client_secret: '765a2ba6ee61447ba9bb8a3d3c558291',
		redirect_uri: 'http://localhost:3000/loginauth'
	}
	if(req.query.code){
	request.post({url: url, form: form, headers: headers}, function(e,r,body){
		console.log("BODY");
		console.log(body);
		console.log("-----");
		res.cookie('cookiename', body, { maxAge: 900000, httpOnly: false });
		res.send(200);
	});
	}
});
app.get('/runkeeperid',function(req,res){
	res.send(req.cookies.cookiename.split("\"access_token\":\"")[1].split("\"")[0]);
});
app.get('/index.html', function(req, res){
  res.render('index.html');
});

app.get('/about.html', function(req, res){
	res.render('about.html');
});

app.get('/boards.html', function(req, res){
	res.render('boards.html');
});

app.get('/profile.html', function(req,res){
	res.render('profile.html');
});

app.listen(3000);

