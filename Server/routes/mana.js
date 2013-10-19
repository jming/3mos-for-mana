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
exports.joinGroup(req, res){

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
