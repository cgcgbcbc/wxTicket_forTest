var activityInfo = require('../../weixin_basic/activity_info');
var util = require('../util');
var should = require('should');
var activity = require('../fixtures/activity');
var sinon = require('sinon');

describe('unit test activity_info', function() {
    before(function(done) {
        util.clearData(function(err) {
            if (err != null) done(err);
            util.loadActivity(done);
        });
    });
    describe('#getCurrentActivity', function() {
        it('should return activities whose book_end is late after now', function(done) {
            function callback(docs) {
                should(docs.length).be.eql(activity.length);
                done();
            }
            activityInfo.getCurrentActivity(callback);
        });
    });
    describe('#getCurrentActivity_EX', function() {
        it('should should return activities that book ended', function(done) {
            function callback(docs) {
                should(docs.length).be.eql(activity.length);
                should(docs).match({name:/\(抢票已结束\)/});
                done();
            }
            var clock = sinon.useFakeTimers(Date.now() + 360000 * 10, 'Date');
            activityInfo.getCurrentActivity_EX(callback);
            clock.restore();
        });
    });
});