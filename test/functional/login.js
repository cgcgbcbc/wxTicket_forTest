/**
 * Created by guangchen on 5/13/15.
 */

var app = require('../../app');
var models = require('../../models/models')
    , db = models.db;
var server;
const Browser = require('zombie');
before(function(done) {
    app.set('port', process.env.PORT || 4600);
    if (process.env.CI) {
        server = app.listen(app.get('port'), function(err) {
            if (err != null) throw err;
            done();
        });
    } else {
        done()
    }
});

describe('functional test', function() {
    Browser.localhost('127.0.0.1', process.env.PORT || 4600);
    before(function(done) {
        db.dropDatabase(function(err) {
            if (err != null) throw  err;
            db[models.admins].save({user:'admin',password:'pwd',manager:true}, function(err) {
                if (err != null) throw err;
                db[models.admins].save({user:'user', password:'pwd'}, function(err) {
                    if (err != null) throw err;
                    done();
                })
            });
        });
    });
    describe('login', function() {
        var browser;
        beforeEach(function() {
            browser = new Browser();
            return browser.visit('/login');
        });
        afterEach(function() {
            browser.destroy();
        });

        it('should render login page', function() {
            browser.assert.text('title', 'Login');
        });
        it('should not login with user',function(done) {
            browser
                .fill('username','user')
                .fill('password','pwd')
                .pressButton('#loginnow', function() {
                    browser.assert.success();
                    browser.assert.text('title', 'Login');
                    done();
                });
        });
        it('should not login with wrong password manager', function(done) {
            browser
                .fill('username','admin')
                .fill('password','other')
                .pressButton('#loginnow', function() {
                    browser.assert.success();
                    browser.assert.text('title', 'Login');
                    browser.assert.text('#alert', '密码错误，请重新输入');
                    done();
                });
        });
        it('should login with manager', function(done) {
            browser
                .fill('username','admin')
                .fill('password','pwd')
                .pressButton('#loginnow', function() {
                    browser.assert.success();
                    browser.assert.text('title', '活动列表 - 紫荆之声票务管理系统');
                    done();
                });
        });
    });
    describe('logout', function() {
        var browser;
        before(function() {
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
        it('should logout', function(done) {
            browser
                .visit('/logout')
                .then(function () {
                    browser.assert.text('title', 'Login');
                    return browser.visit('/users');
                })
                .then(function () {
                    browser.assert.text('title', 'Login');
                    done();
                })
        })
    });

});
