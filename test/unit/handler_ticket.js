var handlerTicket = require('../../weixin_handler/handler_ticket');
var basicInfo = require('../../weixin_basic/settings');
var models = require('../../models/models')
    , db = models.db;
var should = require('should');
var sinon = require('sinon');
var fixture = require('../fixtures/activity_detail');
var freeze = false;
var clock;

describe('unit test', function () {
    describe('weixin_handler/handler_ticket', function () {
        function generator(testCase, func) {
            testCase.check = testCase.check || function () {
                };
            if (testCase.check.length == 0)
                return function () {
                    should(func.apply(this, testCase.args)).eql(testCase.return);
                    testCase.check();
                };
            else return function (done) {
                should(func.apply(this, testCase.args)).eql(testCase.return);
                testCase.check(done);
            }
        }

        describe('#verifyStu', function () {
            it('should fail with non exist weixin id', function (done) {
                var ifFail = function () {
                    done();
                };
                var ifSuccess = function () {
                    done("should not called");
                };
                handlerTicket.verifyStu('nonexist', ifFail, ifSuccess);
            });

            it('should success with exist weixin id', function (done) {
                var ifFail = function () {
                    done("should not called");
                };
                var ifSuccess = function (studentId) {
                    should(studentId).be.a.String.and.eql('2014311933');
                    done();
                };
                handlerTicket.verifyStu('student', ifFail, ifSuccess);
            });
        });

        describe('#check_get_ticket', function () {
            var testSuit = {
                'should not be pattern-matched anyway.': {
                    args: [{
                        MsgType: []
                    }],
                    return: false
                },
                'should return true for menu click': {
                    args: [{
                        MsgType: ['event'],
                        Event: ['CLICK'],
                        EventKey: [basicInfo.WEIXIN_BOOK_HEADER]
                    }],
                    return: true
                },
                'should return true for text qiangpiao': {
                    args: [{
                        MsgType: ['text'],
                        Content: ['抢票']
                    }],
                    return: true
                },
                'should return true for text qiangpiao as sub string': {
                    args: [{
                        MsgType: ['text'],
                        Content: ['抢票 haha']
                    }],
                    return: true
                }
            };

            for (var description in testSuit) {
                it(description, generator(testSuit[description], handlerTicket.check_get_ticket));
            }
        });

        describe('#faire_get_ticket', function () {
            var send = sinon.stub();
            send.returnsArg(0);

            var EventEmitter = require('events').EventEmitter;
            var sendAsyncCallStub = new EventEmitter();
            sendAsyncCallStub.stub = function (msg) {
                if (freeze) clock.restore();
                setImmediate(function () {
                    sendAsyncCallStub.emit('called');
                });
                return msg;
            };
            var stubSpy = sinon.spy(sendAsyncCallStub, 'stub');

            beforeEach(function () {
                stubSpy.reset();
                sendAsyncCallStub.removeAllListeners();
                if (freeze) {
                    clock.restore();
                    freeze = false;
                }
            });

            var testSuit = {
                'should send 请使用“抢票 活动代称”的命令或菜单按钮完成指定活动的抢票。': {
                    args: [
                        {
                            MsgType: ['text'],
                            Content: ['抢票'],
                            FromUserName: ['from'],
                            ToUserName: ['to']
                        },
                        {
                            send: send
                        }
                    ],
                    check: function () {
                        should(send.callCount).be.eql(1);
                        should(send.firstCall.returnValue).be.a.String.and.match(/请使用“抢票 活动代称”的命令或菜单按钮完成指定活动的抢票。/);

                    }
                },
                'should send 请先绑定学号。 for nonexist from user': {
                    args: [
                        {
                            MsgType: ['text'],
                            Content: ['抢票 haha'],
                            FromUserName: ['from'],
                            ToUserName: ['to']
                        },
                        {
                            send: sendAsyncCallStub.stub
                        }
                    ],
                    check: function (done) {
                        sendAsyncCallStub.on('called', function () {
                            should(stubSpy.callCount).be.eql(1);
                            should(stubSpy.firstCall.returnValue).be.a.String.and.match(/请先绑定学号。/);
                            done();
                        });
                    }
                },
                'should send 目前没有符合要求的活动处于抢票期。': {
                    args: [
                        {
                            MsgType: ['text'],
                            Content: ['抢票 haha'],
                            FromUserName: ['student'],
                            ToUserName: ['to']
                        },
                        {
                            send: sendAsyncCallStub.stub
                        }
                    ],
                    check: function (done) {
                        sendAsyncCallStub.on('called', function () {
                            should(stubSpy.callCount).be.eql(1);
                            should(stubSpy.firstCall.returnValue).be.a.String.and.match(/目前没有符合要求的活动处于抢票期。/);
                            done();
                        });
                    }
                },
                'should send 后开始抢票，请耐心等待！': {
                    args: [
                        {
                            MsgType: ['text'],
                            Content: ['抢票 simple'],
                            FromUserName: ['student'],
                            ToUserName: ['to']
                        },
                        {
                            send: sendAsyncCallStub.stub
                        }
                    ],
                    check: function (done) {
                        clock = sinon.useFakeTimers(fixture.NOW);
                        freeze = true;
                        sendAsyncCallStub.on('called', function () {
                            should(stubSpy.callCount).be.eql(1);
                            should(stubSpy.firstCall.returnValue).be.a.String.and.match(/后开始抢票，请耐心等待！/);
                            done();
                        });
                        clock.tick(100);
                    }
                },
                'should send 恭喜，抢票成功！': {
                    args: [
                        {
                            MsgType: ['text'],
                            Content: ['抢票 simple'],
                            FromUserName: ['student'],
                            ToUserName: ['to']
                        },
                        {
                            send: sendAsyncCallStub.stub
                        }
                    ],
                    check: function (done) {
                        clock = sinon.useFakeTimers(fixture.NOW_CAN_BOOK);
                        freeze = true;
                        sendAsyncCallStub.on('called', function () {
                            should(stubSpy.callCount).be.eql(1);
                            should(stubSpy.firstCall.returnValue).be.a.String.and.match(/恭喜，抢票成功！/);
                            done();
                        });
                        clock.tick(100);
                    }
                },
                'should send 你已经有票啦，请用查票功能查看抢到的票吧！': {
                    args: [
                        {
                            MsgType: ['text'],
                            Content: ['抢票 simple'],
                            FromUserName: ['student'],
                            ToUserName: ['to']
                        },
                        {
                            send: sendAsyncCallStub.stub
                        }
                    ],
                    check: function (done) {
                        clock = sinon.useFakeTimers(fixture.NOW_CAN_BOOK);
                        freeze = true;
                        sendAsyncCallStub.on('called', function () {
                            should(stubSpy.callCount).be.eql(1);
                            should(stubSpy.firstCall.returnValue).be.a.String.and.match(/你已经有票啦，请用查票功能查看抢到的票吧！/);
                            done();
                        });
                        clock.tick(100);
                    }
                },
                'should send 对不起，票已抢完': {
                    args: [
                        {
                            MsgType: ['text'],
                            Content: ['抢票 no_ticket'],
                            FromUserName: ['student'],
                            ToUserName: ['to']
                        },
                        {
                            send: sendAsyncCallStub.stub
                        }
                    ],
                    check: function (done) {
                        clock = sinon.useFakeTimers(fixture.NOW_CAN_BOOK);
                        freeze = true;
                        sendAsyncCallStub.on('called', function () {
                            should(stubSpy.callCount).be.eql(1);
                            should(stubSpy.firstCall.returnValue).be.a.String.and.match(/对不起，票已抢完/);
                            done();
                        });
                        clock.tick(100);
                    }
                }
            };
            for (var des in testSuit) {
                it(des, generator(testSuit[des], handlerTicket.faire_get_ticket));
            }
            it('should deliver one ticket on race condition', function (done) {
                handlerTicket.faire_get_ticket({
                        MsgType: ['text'],
                        Content: ['抢票 race'],
                        FromUserName: ['student1'],
                        ToUserName: ['to']
                    },
                    {
                        send: sendAsyncCallStub.stub
                    });
                handlerTicket.faire_get_ticket({
                        MsgType: ['text'],
                        Content: ['抢票 race'],
                        FromUserName: ['student2'],
                        ToUserName: ['to']
                    },
                    {
                        send: sendAsyncCallStub.stub
                    });
                clock = sinon.useFakeTimers(fixture.NOW_CAN_BOOK);
                freeze = true;
                sendAsyncCallStub.on('called', function () {
                    should(stubSpy.callCount).be.above(0);
                    if (stubSpy.callCount === 2) {
                        should(stubSpy.firstCall.returnValue).be.a.String.and.match(/对不起，票已抢完/);
                        should(stubSpy.secondCall.returnValue).be.a.String.and.match(/点我查看电子票/);
                        db[models.tickets].find({$or: [{stu_id:"2014311934"}, {stu_id:"2014311935"}]}, function(err, docs) {
                            if (err) done(err);
                            should(docs.length).be.eql(1);
                            done();
                        });
                    }
                });
                clock.tick(100);
            });
            it('should deliver one ticket on race condition for single people', function (done) {
                handlerTicket.faire_get_ticket({
                        MsgType: ['text'],
                        Content: ['抢票 race_single'],
                        FromUserName: ['student3'],
                        ToUserName: ['to']
                    },
                    {
                        send: sendAsyncCallStub.stub
                    });
                handlerTicket.faire_get_ticket({
                        MsgType: ['text'],
                        Content: ['抢票 race_single'],
                        FromUserName: ['student3'],
                        ToUserName: ['to']
                    },
                    {
                        send: sendAsyncCallStub.stub
                    });
                clock = sinon.useFakeTimers(fixture.NOW_CAN_BOOK);
                freeze = true;
                sendAsyncCallStub.on('called', function () {
                    should(stubSpy.callCount).be.above(0);
                    if (stubSpy.callCount === 2) {
                        should(stubSpy.secondCall.returnValue).be.a.String.and.match(/点我查看电子票/);
                        should(stubSpy.firstCall.returnValue).be.a.String.and.match(/您的抢票请求正在处理中，请稍后通过查票功能查看抢票结果/);
                        db[models.tickets].find({stu_id:"2014311936"}, function(err, docs) {
                            if (err) done(err);
                            should(docs.length).be.eql(1);
                            done();
                        });
                    }
                });
                clock.tick(100);
            });
        });
    });
});