var request = require('supertest')
    , sinon = require('sinon')
    , should = require('should')
    , app = require('../../app')
    , agent = request.agent(app)
    , util = require('../util');

var baseUrl = '/choosearea';

describe('test route/choose_area',function() {
    before(function(done) {
        util.clearData(function(err) {
            if (err != null) done(err);
            util.loadChooseArea(done);
        });
    });

    describe('GET', function() {
        it('should send ticketid is required! if not ticketid', function(done) {
            agent
                .get(baseUrl)
                .expect(function(res) {
                    should(res.text).be.eql('ticketid is required!');
                })
                .end(done);
        });
        it('should send No such a ticket. if ticketid invalid', function(done) {
            agent
                .get(baseUrl + '?ticketid=qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                .expect(function(res) {
                    should(res.text).be.eql('No such a ticket.');
                })
                .end(done);
        });
        it('should render choose area page', function(done) {
            agent
                .get(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .expect(function(res) {
                    should(res.text).be.match(/ticketLeft\.A = 1/);
                    should(res.text).be.match(/ticketLeft\.B = 1/);
                })
                .end(done);
        });
    });

    describe('POST', function() {
        it('should not choose seat if invalid parameter', function(done) {
            agent
                .post(baseUrl + '?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw')
                .send({'seat':'wrong'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/choosearea\?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw&err=1$/);
                    done();
                });
        });
        it('should deliver seat', function(done) {
            agent
                .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'A_area'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/ticketsinfo\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf$/);
                    done();
                });
        });
        it('should deliver seat once', function(done) {
            agent
                .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .send({'seat':'A_area'})
                .expect(function(res) {
                    should(res.text).be.match(/已经选过座位啦！座位是A/);
                })
                .end(done);
        });
        it('should deliver seat once', function(done) {
            agent
                .get(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .expect(function(res) {
                    should(res.text).be.match(/已经选过座位啦！座位是A/);
                })
                .end(done);
        });
        it('should not choose seat if no seat', function(done) {
            agent
                .post(baseUrl + '?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw')
                .send({'seat':'A_area'})
                .redirects(0)
                .end(function(err, res) {
                    should(res.header.location).be.match(/\/choosearea\?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw&err=1$/);
                    done();
                });
        });


        describe('concurrent choose area', function() {
            beforeEach(function(done) {
                util.clearData(function(err) {
                    if (err != null) done(err);
                    util.loadChooseArea(done);
                });
            });
            beforeEach(function() {
                this.clock = sinon.useFakeTimers(Date.now());
            });
            afterEach(function() {
                this.clock.restore();
            });
            it('should deliver exact one seat to one ticket in one area', function(done) {
                var callCount = 0;
                function callback(err, res) {
                    callCount += 1;
                    if (callCount == 2) {
                        done();
                    }
                }
                agent
                    .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                    .send({'seat':'A_area'})
                    .redirects(0)
                    .end(function(err, res) {
                        should(res.header.location).be.match(/\/ticketsinfo\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf$/);
                        callback(err, res);
                    });
                agent
                    .post(baseUrl + '?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw')
                    .send({'seat':'A_area'})
                    .redirects(0)
                    .end(function(err, res) {
                        should(res.header.location).be.match(/\/choosearea\?ticketid=ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw&err=1$/);
                        callback(err, res);
                    });
                this.clock.tick(10);
            });
            it('should deliver exact one seat to one ticket in one area', function(done) {
                var callCount = 0;
                function callback(err, res) {
                    callCount += 1;
                    if (callCount == 2) {
                        done();
                    }
                }
                agent
                    .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                    .send({'seat':'A_area'})
                    .redirects(0)
                    .end(function(err, res) {
                        should(res.header.location).be.match(/\/ticketsinfo\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf$/);
                        callback(err, res);
                    });
                agent
                    .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                    .send({'seat':'A_area'})
                    .redirects(0)
                    .end(function(err, res) {
                        should(res.text).be.match(/您的选座请求正在处理中，请稍等\.\.\./);
                        callback(err, res);
                    });
                this.clock.tick(10);
            });
            it('should deliver exact one seat to one ticket in different area', function(done) {
                var callCount = 0;
                function callback(err, res) {
                    callCount += 1;
                    if (callCount == 2) {
                        done();
                    }
                }
                agent
                    .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                    .send({'seat':'A_area'})
                    .redirects(0)
                    .end(function(err, res) {
                        should(res.header.location).be.match(/\/ticketsinfo\?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf$/);
                        callback(err, res);
                    });
                agent
                    .post(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                    .send({'seat':'B_area'})
                    .redirects(0)
                    .end(function(err, res) {
                        should(res.text).be.match(/您的选座请求正在处理中，请稍等\.\.\./);
                        callback(err, res);
                    });
                this.clock.tick(10);
            });
        });
    });
});