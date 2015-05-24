/**
 * Created by guangchen on 5/24/15.
 */
var connect_verify_mock = {
    check_weixin_signature: function (signature, timestamp, nonce) {
        return true;
    },
    echo_back_weixin: function (req, res) {
        res.send("mock");
    },
    '@global': true
};

var stub = {
    '../weixin_basic/connect_verify': connect_verify_mock
};

var proxyquire = require('proxyquire');

var request = require('supertest')
    , should = require('should')
    , app = proxyquire('../../app', stub)
    , agent = request.agent(app);


describe("test routes/weixin.js", function () {


    describe("mock should work", function() {
        it("should return echo string with mock", function(done) {

            agent
                .get('/weixin')
                .expect(200)
                .expect(function(res) {
                    should(res.text).be.a.String.and.eql('mock');
                })
                .end(done);
        })
    })
});