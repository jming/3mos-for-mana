var = require('express'), mana = require('./routes/mana');
 
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
app.post('/joingroup',mana.joinGroup);
app.options('/searchpeople',sendSuccess);
app.get('/searchpeople', mana.searchPeople); 
//Person
app.options('/getinformation/:personID', sendSuccess);
app.get('/getinformation/:personID', mana.getPersonInfo);
//Group
app.options('/getfeed/:groupID',sendSuccess);
app.get('/getfeed/:groupID', mana.getFeed); 
app.options('/getbadges/:groupID',sendSuccess);
app.get('getbades/:groupID', mana.getBadges); 
app.options('/getpictures/:groupID',sendSuccess);
app.get('/getpictures/:groupID', mana.getPictures); 
app.options('/getcalories/:groupID',sendSuccess);
app.get('/getcalories/:groupID', mana.getCalories); 
app.options('/getmembers/:groupID',sendSuccess);
app.get('/getmembers/:groupID',  mana.getMembers); 
//Corporation
app.options('/getgroups',sendSuccess);
app.get('/getgroups',  mana.getGroups); 

app.options('/items', sendSuccess);
app.get('/items', items.findAll);
app.options('/item/:id', sendSuccess);
app.get('/item/:id', items.findById);
app.post('/items', items.addItem);
app.options('/user/:id', sendSuccess);
app.get('/user/:id', items.getProfile);

app.listen(1337);
console.log('Listening on port 1337...');
