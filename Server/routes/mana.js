var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true, safe:false});
db = new Db('jpmorgan', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'trackerdb' database");
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

}

//Person
exports.getPersonInfo= function(req, res){

}

//Group
exports.getFeed= function(req, res){

}

exports.getBadges= function(req, res){

}

exports.getPictures= function(req, res){

}

exports.getCalories= function(req, res){

}

exports.getMembers= function(req, res){

}

//Corporation
exports.getGroups= function(req, res){

}
