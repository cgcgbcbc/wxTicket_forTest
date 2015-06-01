const Browser = require('zombie');
Browser.localhost('127.0.0.1', process.env.PORT || 4600);

var util = require('../util');
var moment = require('moment');

describe('functional test', function () {
    before(function (done) {
        util.clearData(function (err) {
            if (err != null) done(err);
            util.loadActivity(function (err) {
                if (err != null) done(err);
                util.loadTickets(done);
            });
        })
    });
    describe('show tickets info', function () {
        var browser;
        before(function () {
            browser = new Browser();
        });
        after(function () {
            browser.destroy();
        });
        it('should render correct tickets info', function (done) {
            browser
                .visit('/ticketsinfo?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .then(function () {
                    browser.assert.text('title', '我的票夹');
                    browser.assert.text('#ticket_title', /for checkin/);
                    browser.assert.text('#ticket_place', /some place/);
                    moment.locale('zh-cn');
                    browser.assert.text('#ticket_time', new RegExp(moment().format('LL')));
                })
                .then(done, done);
        });
    });
});