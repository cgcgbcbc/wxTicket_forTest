
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
                    db[models.students].insert([{weixin_id: "student", stu_id: "2014311933", status:1}, {weixin_id: "student1", stu_id: "2014311934", status:1}, {weixin_id: "student2", stu_id: "2014311935", status:1}, {weixin_id: "student3", stu_id: "2014311936", status:1}], function(err) {
                        if(err != null) throw err;
                        done();
                    });
                });
            })
        });
    });
});