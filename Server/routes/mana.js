/*var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var mongoUri =  process.env.MONGOLAB_URI || 'mongodb://localhost/27017';

 
var server = new Server('localhost', 27017, {auto_reconnect: true, safe:false});
db = new Db('jpmorgan', server);*/

/*mongo.Db.connect(mongoUri, function (err, db) {
    if(!err) {
        console.log("Connected to 'jpmorgan' database");
    }
});*/
 
/*db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'jpmorgan' database");
    }
});*/

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/27017';

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('people', function(er, collection) {
    collection.insert({'group_id': 11}, {safe: true}, function(er,rs) {
    	if(!err){
    		console.log("DID INSERT");
    	}
    });
  });
});

//Search
exports.createGroup = function(req, res){
	var id = req.params.myid;
	var otherid = req.params.personid;
	var group = {'people_list':[id,otherid], 'badge_list':[], 'pictures':[], 'calories':0};
	db.collection('groups',function(err,collection){
		if(err){ res.send(404);}
		else{
			collection.insert(group, {safe: true}, function(err, results){
				if(err){ res.send(404);}
				else{
					db.collection('people').update({'_id':new BSON.ObjectID(id)},{$set:
					{'in_group': 1, 'group_id': results[0]._id.toString()}});
					db.collection('people').update({'_id':new BSON.ObjectID(otherid)},{$set:
					{'in_group': 1, 'group_id': results[0]._id.toString()}});
					res.send(results[0]);
				}					
			});
		}
	});
}

exports.joinGroup= function(req, res){
	var id = req.params.myid;
	var groupid = req.params.groupid;
	db.collection('groups', function(err,collection){
		if(err){ res.send(404);}
		else{
			collection.update({"_id": new BSON.ObjectID(groupid)},{$push: {'people_list': id}}, {safe:true}, function(err, results){
				if(err){ res.send(404);}
				else{
					db.collection('people').update({'_id':new BSON.ObjectID(id)},{$set:
					{'in_group': 1, 'group_id': groupid}});
					res.send(200);
				}
			});
		}
	});
};

exports.searchPeople= function(req, res){
	console.log("search people");
	db.collection('people', function(err, collection){
		if(err){ console.log("ERROR"); res.send(404); }
		else{
			console.log("people");
			collection.find({}).sort({group_id:-1}).toArray(function(err,people){
				res.send(people);
			});
		}
	});
}

//Person
exports.getPersonInfo= function(req, res){
	var id= req.params.personid;
	db.collection('people', function(err,collection){
		if(err){ res.send(404);}
		else{
			collection.findOne({'_id':new BSON.ObjectID(id)}, function(err,person){
				res.send(person);
			});
		}
	});
	
}

//Group
exports.writeFeed = function(req, res){
	var date = new Date();
	var id = req.params.myid;
	var content = req.params.content;

	db.collection('feed', function(err, collection){
		if(err){res.send(404);}
		else{
			db.collection('people', function(people_error, collection_people){
				collection_people.findOne({"_id":new BSON.ObjectID(id)}, function(error,person){
					if(error){ res.send(404);}
					else{
						var feedcontent = {'group_id':person.group_id, 'author': person.name,
						'date': date, 'content':content};
						collection.insert(feedcontent, {safe:true}, function(inserterror,
						results){
							if(inserterror){ res.send(404);}
							else{
								res.send(results);
							}
						});
					}
				});
			});
		}
	});
}

exports.getFeed= function(req, res){
	var groupid = req.params.groupid;
	db.collection('feed', function(err,collection){
		if(err){ res.send(404);}
		else{
			collection.find({'group_id':groupid}).sort({date:-1}).toArray(function(err,posts){
				res.send(posts);
			});
		}
	});
}

exports.addPicture = function(req, res){
	var groupid = req.params.groupid;
	var picture = req.params.picturelink;
	db.collection('groups', function(err,collection){
		if(err){ res.send(404);}
		else{
			collection.update({'_id':new BSON.ObjectID(groupid)},{$push: {'pictures': picture}});
			res.send(200);
		}
	});
}
function convertBSON(idList){
	return idList.map(function(id){
		return BSON.ObjectID(id);
	});
}

function getPeopleObjects(group,res){
	var people = convertBSON(group.people_list);
	db.collection('people', function(people_err, people_collections){
		if(people_err){ res.send(404)}
		else{
			people_collections.find({"_id":{$in:people}}).toArray(function(people_find_err,
			people_names){
				group.people_list = people_names;
				res.send(group);
			});
		}
	});
}
exports.getGroupInfo = function(req, res){
	var groupid = req.params.groupid;
	db.collection('groups', function(err, collection){
		if(err){ res.send(404); }
		else{
			collection.findOne({'_id':new BSON.ObjectID(groupid)}, function(err,group){
				if(err){ res.send(404);}
				else{
					getPeopleObjects(group,res);
				}
			});
		}	
	});
}



//Corporation
exports.getGroups= function(req, res){
	db.collection('groups', function(err, collection){
		if(err){ res.send(404); }
		else{
			collection.find({}).toArray(function(err,groups){
				if(err){ res.send(404);}
				else{
					var numcompleted = 0;
					for(var i =0; i < groups.length;i++){
						var group = groups[i];
						var people = convertBSON(group.people_list);
						db.collection('people', function(people_err, people_collections){
							if(people_err){ res.send(404)}
							else{
								people_collections.find({"_id":{$in:people}}).toArray(function(people_find_err,
								people_names){
									numcompleted++;
									groups[numcompleted-1].people_list = people_names;
									if(numcompleted == groups.length){
										res.send(groups);
									}
								});
							}
						});
					}
				}
			});
		}
	});
	
}
