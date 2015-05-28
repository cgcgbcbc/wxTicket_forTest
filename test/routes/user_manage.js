/**
 * Created by guangchen on 5/23/15.
 */

var request = require('supertest')
    , should = require('should')
    , app = require('../../app')
    , agent = request.agent(app)
    , util = require('../util');

var fixture = require('../fixtures/activity_detail');

var sinon = require('sinon');

describe('test routes/user_manage', function() {
    before(function(done) {
        util.clearData(function(err) {
            if (err != null) done(err);
            util.loadUser(function(err) {
                if (err != null) done(err);
                agent
                    .post("/login")
                    .send({
                        username: "admin",
                        password: "pwd"
                    })
                    .expect(function(res) {
                        should(res.text).be.a.String.and.match(/success/);
                    })
                    .end(done);
            })
        });
    });
    describe('/users/manage/detail', function() {
        describe('#POST', function() {
            it('should successfully create activity', function(done) {
                var clock = sinon.useFakeTimers(fixture.NOW);
                agent
                    .post("/users/manage/detail")
                    .send(fixture[fixture.SUCCESS])
                    .expect(function(res) {
                        should(res.text).be.a.String.and.match(/200/).and.match(/无选座票务/);
                    })
                    .end(function() {
                        clock.restore();
                        done();
                    });
                clock.tick(1000);
            })
        });
    })
});