/**
 * Created by guangchen on 5/14/15.
 */

const Browser = require('zombie');

var util = require('../util');

function fillDetailPage(browser, config) {
    var operation,data;
    function forEach(o, f) {
        var k,v;
        for (k in Object.keys(o)) {
            v = o[k];
            f(k,v);
        }
    }
    for (operation in Object.keys(config)) {
        data = config[operation];
        switch(operation) {
            case 'fill':
                forEach(data, browser.fill);
                break;
            case 'select':
                forEach(data, browser.select)
        }
    }
    return browser;
}

describe("functional test", function() {
    Browser.localhost('127.0.0.1', process.env.PORT || 4600);

    before(function(done) {
        util.clearData(function(err) {
            if (err != null) done(err);
            util.loadUser(done);
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

        it("should render detail page", function(done) {
            browser
                .clickLink("新增活动")
                .then(function() {
                    browser.assert.text('title', '新建活动- 紫荆之声票务管理系统');
                    done()
                });
        });
        it("should not submit empty form" ,function(done) {
            browser
                .pressButton("发布")
                .then(function() {
                    browser.assert.text('title', '新建活动- 紫荆之声票务管理系统');
                    done();
                })
        });
    });
});