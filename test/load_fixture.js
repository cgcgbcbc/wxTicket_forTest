
var models = require('../models/models')
    , db = models.db;

var activity_fixture = require('./fixtures/activity.json')
    ;

before(function(done) {
    db.dropDatabase(function(err) {
        if (err != null) throw  err;
        db[models.admins].save({user:'admin',password:'pwd',manager:true}, function(err) {
            if (err != null) throw err;
            db[models.admins].save({user:'user', password:'pwd', manager:false}, function(err) {
                if (err != null) throw err;
                db[models.activities].insert(activity_fixture, function(err) {
                    if (err != null) throw err;
                    done();
                });
            })
        });
    });
});