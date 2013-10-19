var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true, safe:false});
db = new Db('jpmorgan', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'jpmorgan' database");
    }
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
	db.collection('people', function(err, collection){
		if(err){ res.send(404); }
		else{
			collection.find({}).sort({group_id:-1}).toArray(function(err,people){
				res.send(people);
			});
		}
	});
}

//Person
exports.getPersonInfo= function(req, res){

}

//Group
exports.writeFeed = function(req, res){
	var date = new Date();
	var id = req.params.myid;
	var groupid = req.params.groupid;
	var content = req.params.content;

	db.collection('feed', function(err, collection){
		if(err){res.send(404);}
		else{
			db.collection('people', function(people_error, collection_people){
				collection_people.findOne({"_id":new BSON.ObjectID(id)}, function(error,person){
					if(error){ res.send(404);}
					else{
						var feedcontent = {'group_id':groupid, 'author': person.name,
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

exports.getGroupInfo = function(req, res){
	var groupid = req.params.groupid;
	db.collection('groups', function(err, collection){
		if(err){ res.send(404); }
		else{
			collection.findOne({'_id':new BSON.ObjectID(groupid)}, function(err,group){
				res.send(group);
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
				res.send(groups);
			});
		}
	});
	
}
