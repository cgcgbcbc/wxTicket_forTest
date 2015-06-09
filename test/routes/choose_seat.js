/**
 * Created by guangchen on 6/8/15.
 */

var request = require('supertest')
    , sinon = require('sinon')
    , should = require('should')
    , app = require('../../app')
    , agent = request.agent(app)
    , util = require('../util');

var baseUrl = '/chooseseat';

describe('test route/choose_seat', function() {
    before(function(done) {
        util.clearData(function(err) {
            if (err != null) done(err);
            util.loadChooseTicket(done);
        });
    });
    describe('#POST', function() {
        it('should send ticketid is required! with no ticketid', function(done) {
            agent
                .post(baseUrl)
                .expect(function(res) {
                    should(res.text).be.eql('ticketid is required!');
                })
                .end(done);
        });
        it('should send No such a ticket.', function(done) {
            agent
                .post(baseUrl + '?ticketid=qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                .expect(function(res) {
                    should(res.text).be.eql('No such a ticket.');
                })
                .end(done);
        });
        it('should redirect to error', function(done) {
            agent
                .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'B06'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/chooseseat\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf&err=1$/);
                    done();
                });
        });
        it('should redirect to ticket info', function(done) {
            agent
                .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'A06'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/ticketsinfo\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf$/);
                    done();
                });
        });
        it('should not choose seat twice for one ticket', function(done) {
            agent
                .get(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .expect(function(res) {
                    should(res.text).be.match(/已经选过座位啦！座位是1排21座/);
                })
                .end(done);
        });
        it('should not choose seat twice for one ticket', function(done) {
            agent
                .get(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'A07'})
                .expect(function(res) {
                    should(res.text).be.match(/已经选过座位啦！座位是1排21座/);
                })
                .end(done);
        });
        it('should not choose seat twice for one seat', function(done) {
            agent
                .post(baseUrl + '?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw')
                .send({'seat':'A06'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/chooseseat\?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw&err=1$/);
                    done();
                });
        });
    });

    describe('concurrent choosing seat', function() {
        before(function(done) {
            util.clearData(function(err) {
                if (err != null) done(err);
                util.loadChooseTicket(done);
            });
        });
        beforeEach(function() {
            this.clock = sinon.useFakeTimers(Date.now());
        });
        afterEach(function() {
            this.clock.restore();
        });
        it('should deliver exact one seat to one ticket', function(done) {
            var callCount = 0;
            function callback(err, res) {
                callCount += 1;
                if (callCount == 2) {
                    done();
                }
            }
            agent
                .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'A06'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/ticketsinfo\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf$/);
                    callback(err, res);
                });
            agent
                .post(baseUrl + '?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw')
                .send({'seat':'A06'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/chooseseat\?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw&err=1$/);
                    callback(err, res);
                });
            this.clock.tick(10);
        });
        it('should allow choosing one seat for one ticket', function(done) {
            var callCount = 0;
            function callback(err, res) {
                callCount += 1;
                if (callCount == 2) {
                    done();
                }
            }
            agent
                .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'A06'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/ticketsinfo\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf$/);
                    callback(err, res);
                });
            agent
                .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'A07'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.text).be.match(/已经选过座位啦！座位是1排21座/);
                    callback(err, res);
                });
            this.clock.tick(10);
        })
    });
});
