
var models = require('../models/models')
    , db = models.db;

var activity_fixture = require('./fixtures/activity.json')
    , tickets_fixture = require('./fixtures/tickets.json')
    , i
    ;

for(i = 0; i < activity_fixture.length; i++) {
    if (activity_fixture[i].key === 'not_start') {
        activity_fixture[i]['book_start']= Date.now()+3600000;
        activity_fixture[i]['book_end']= Date.now()+2*3600000;
        continue;
    }
    activity_fixture[i]['book_start']= Date.now()-3600000;
    activity_fixture[i]['book_end']= Date.now()+3600000;
    if ('_id' in activity_fixture[i]) {
        activity_fixture[i]._id = models.getIDClass(activity_fixture[i]._id);
    }
}

tickets_fixture = tickets_fixture.map(function(item) {
    item._id = item._id && models.getIDClass(item._id);
    item.activity = models.getIDClass(item.activity);
    return item;
});

before(function(done) {
    db.dropDatabase(function(err) {
        if (err != null) throw  err;
        db[models.admins].save({user:'admin',password:'pwd',manager:true}, function(err) {
            if (err != null) throw err;
            db[models.admins].save({user:'user', password:'pwd', manager:false}, function(err) {
                if (err != null) throw err;
                db[models.activities].insert(activity_fixture, function(err) {
                    if (err != null) throw err;
                    db[models.students].insert([{weixin_id: "student", stu_id: "2014311933", status:1}, {weixin_id: "student1", stu_id: "2014311934", status:1}, {weixin_id: "student2", stu_id: "2014311935", status:1}, {weixin_id: "student3", stu_id: "2014311936", status:1}, {weixin_id: "checkin", stu_id: "2014311937", status:1}], function(err) {
                        if(err != null) throw err;
                        db[models.tickets].insert(tickets_fixture, function(err) {
                            if (err !=null) throw err;
                            done();
                        });
                    });
                });
            })
        });
    });
});