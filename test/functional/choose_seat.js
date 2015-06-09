var baseUrl = '/chooseseat';
var util = require('../util');

const Browser = require('zombie');
Browser.localhost('127.0.0.1', process.env.PORT || 4600);

describe("choose seat", function() {
    before(function(done) {
        util.clearData(function(err) {
            if (err != null) done(err);
            util.loadChooseTicket(done);
        });
    });
    describe("GET " + baseUrl, function() {
        var browser;
        before(function() {
            browser = new Browser();
        });
        after(function() {
            browser.destroy();
        });
        it('should send ticketid is required! with no ticketid', function(done) {
            browser
                .visit(baseUrl)
                .then(function() {
                    browser.assert.text('body', 'ticketid is required!');
                })
                .then(done, done);
        });
        it('should send No such a ticket.', function(done) {
            browser
                .visit(baseUrl + '?ticketid=qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                .then(function() {
                    browser.assert.text('body', 'No such a ticket.');
                })
                .then(done, done);
        });
        it('should render seat_litang', function(done) {
            this.timeout(10000);
            browser
                .visit(baseUrl + '?ticketid=wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf')
                .then(function() {
                    browser.assert.text('title', '紫荆之声-抢票选座');
                    browser.assert.evaluate('$("#A .06").hasClass("seat_Stu")');
                    browser.assert.evaluate('$("#A .07").hasClass("seat_Stu")');
                    browser.assert.evaluate('$("#A_show .06").hasClass("seat_Stu")');
                    browser.assert.evaluate('$("#A_show .07").hasClass("seat_Stu")');
                    browser.assert.elements('.seat_Stu', 4);
                })
                .then(done, done);
        });
    });
    // POST not test here, move to route
});