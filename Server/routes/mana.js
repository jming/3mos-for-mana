var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true, safe:false});
db = new Db('trackerdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'trackerdb' database");
    }
});

//Search
exports.createGroup(req, res){
	var id = req.params.myid;
	var otherid = req.parems.personid;
//	var people = db.people.find({'_id': { $in :[new BSON.ObjectID(myid), new BSON.ObjectID(otherid)]});
	/*people.forEach(function(person){
		people.add(person);
	});*/
	var group = {'people_list':[id,otherid], 'badge_list':[], 'pictures':[], 'calories':0};
	db.collection('groups',function(err,collection){
		if(err){ res.send(404);}
		else{
			collection.insert(group, {safe: true}, function(err, results){
				if(err){ res.send(404);}
				else{
					result.send(results[0]);
				}					
			});
		}
	});
}

exports.joinGroup(req, res){
	var id = req.parems.groupid;
	var groupid = req.parems.groupid;
	db.collection('groups', function(err,collection){
		if(err){ res.send(404);}
		else{
			collection.update({"_id": new BSON.ObjectID(groupid)},{$push: {'people_list': id}}, {safe:true}, function(err, results){
				if(err){ res.send(404);}
				else{
					result.send(results[0]);
				}
			});
		}
	});
};

exports.searchPeople(req, res){

}

//Person
exports.getPersonInfo(req, res){

}

//Group
exports.getFeed(req, res){

}

exports.getBadges(req, res){

}

exports.getPictures(req, res){

}

exports.getCalories(req, res){

}

exports.getMembers(req, res){

}

//Corporation
exports.getGroups(req, res){

}
