/**
 * Created by guangchen on 5/14/15.
 */

var models = require('../../models/models')
    , db = models.db;
const Browser = require('zombie');
describe("functional test", function() {
    Browser.localhost('127.0.0.1', 4600);
    before(function(done) {
        db.dropDatabase(function(err) {
            if (err != null) throw  err;
            db[models.admins].save({user:'admin',password:'pwd',manager:true}, function(err) {
                if (err != null) throw err;
                done();
            });
        });
    });

    describe("add detail", function() {
        var browser;
        before(function(){
            browser = new Browser();
            return browser
                .visit('/login')
                .then(function() {
                    return browser
                        .fill('username', 'admin')
                        .fill('password', 'pwd')
                        .pressButton('#loginnow');
                });
        });
        after(function() {
            browser.destroy();
        });

        function fillDetailPage(browser, data) {
            var k,v;
            for (k in Object.keys(data)) {
                v = data[v];
                browser = browser.fill(k,v);
            }
            return browser;
        }

        it("should render detail page", function(done) {
            browser
                .clickLink("新增活动")
                .then(function() {
                    browser.assert.text('title', '新建活动- 紫荆之声票务管理系统');
                    done()
                });
        });

    });
});