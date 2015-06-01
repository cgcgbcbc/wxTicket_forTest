/**
 * Created by guangchen on 6/1/15.
 */
var request = require('supertest')
    , should = require('should')
    , app = require('../../app')
    , agent = request.agent(app);

var baseUrl = '/ticketsinfo';

describe('test ' + baseUrl, function() {
    it('should send 不要捣乱，要有ticketid！！ if no ticketid', function(done) {
        agent
            .get(baseUrl)
            .expect(200)
            .expect(function(res) {
                should(res.text).be.a.String.and.eql('不要捣乱，要有ticketid！！');
            })
            .end(done);
    });
    it('should send 不要捣乱，你的ticketid没有对应的票！！ if ticketid not valid', function(done) {
        agent
            .get(baseUrl + '?ticketid=wrongticketid')
            .expect(200)
            .expect(function(res) {
                should(res.text).be.eql('不要捣乱，你的ticketid没有对应的票！！');
            })
            .end(done);
    });
});