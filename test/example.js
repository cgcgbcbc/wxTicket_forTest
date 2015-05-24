/**
 * Created by guangchen on 5/13/15.
 */

var request = require('supertest')
    , should = require('should')
    , app = require('../app')
    , agent = request.agent(app);

describe('example', function() {
    it('should return 200 when get /', function(done) {
        agent
            .get('/')
            .expect(200)
            .expect(function(res) {
                res.text.indexOf('Welcome to Express').should.be.above(0);
            })
            .end(done);
    });
    it('should login', function(done) {
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