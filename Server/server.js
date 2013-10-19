var express= require('express'), mana = require('./routes/mana');
 
var app = express();

function sendSuccess(req, res){
	res.send(200);
}

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
	  app.use(express.session({secret: '1234567890QWERTY'}));
	  app.use(express.favicon());
});

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers: X-Requested-With', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

//Search
app.post('/creategroup/:myid/:personid',mana.createGroup);
app.post('/joingroup/:myid/:groupid',mana.joinGroup);
app.options('/searchpeople',sendSuccess);
app.get('/searchpeople', mana.searchPeople); 
//Person
app.options('/getinformation/:personid', sendSuccess);
app.get('/getinformation/:personid', mana.getPersonInfo);
//Group
app.options('/getfeed/:groupid',sendSuccess);
app.get('/getfeed/:groupid', mana.getFeed); 
app.post('/writefeed/:myid/:groupid/:content', mana.writeFeed);
app.options('/getgroupinfo/:groupid',sendSuccess);
app.get('/getgroupinfo/:groupid', mana.getGroupInfo); 
app.post('/addpicture/:groupid/:picturelink', mana.addPicture);

//Corporation
app.options('/getgroups',sendSuccess);
app.get('/getgroups',  mana.getGroups); 

app.listen(1337);
console.log('Listening on port 1337...');
