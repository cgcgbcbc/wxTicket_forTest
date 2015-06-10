/**
 * Created by guangchen on 5/27/15.
 */
var models = require('../../models/models')
    , db = models.db;
var userFixture = require('../fixtures/manager.json');
var studentFixture = require('../fixtures/student.json');
var activityFixture = require('../fixtures/activity');
var ticketFixture = require('../fixtures/tickets');
var chooseSeatFixture = require('../fixtures/choose_seat');
var chooseAreaFixture = require('../fixtures/choose_area');

exports = module.exports;
exports.loadFixture = loadFixture;
exports.clearData = clearData;
exports.loadUser = loadUser;
exports.loadStudent = loadStudent;
exports.loadActivity = loadActivity;
exports.loadTickets = loadTickets;
exports.loadChooseTicket = loadChooseSeat;
exports.loadChooseArea = loadChooseArea;
exports.addStudent = addStudent;
exports.generateStudent = generateStudent;


function loadFixture(collection, data, callback) {
    db[collection].insert(data, callback);
}

function clearData(callback) {
    db.dropDatabase(callback);
}

function loadUser(callback) {
    loadFixture(models.admins, userFixture, callback);
}

function loadStudent(callback) {
    loadFixture(models.students, studentFixture, callback);
}

function loadActivity(callback) {
    loadFixture(models.activities, activityFixture, callback);
}

function loadTickets(callback) {
    loadFixture(models.tickets, ticketFixture, callback);
}

function loadChooseSeat(callback) {
    loadFixture(models.activities, chooseSeatFixture.activity, function(err) {
        if (err != null) callback(err);
        loadFixture(models.seats, chooseSeatFixture.seat, function(err) {
            if (err != null) callback(err);
            loadFixture(models.tickets, chooseSeatFixture.ticket, callback);
        });
    });
}

function loadChooseArea(callback) {
    loadFixture(models.activities, chooseAreaFixture.activity, function(err) {
        if (err != null) callback(err);
        loadFixture(models.seats, chooseAreaFixture.seat, function(err) {
            if (err != null) callback(err);
            loadFixture(models.tickets, chooseAreaFixture.ticket, callback);
        });
    });
}

function addStudent(weixin_id, stu_id, callback) {
    loadFixture(models.students, {
        "weixin_id": weixin_id,
        "stu_id": stu_id,
        "status":1
    }, callback);
}

function generateStudent(callback){
    for(var i = 1; i <=3000;i ++) {
        i = String(i);
        var length=i.length;
        var str = new Array(5-length).join("0") + i;
        var weixinId = "test"+str;
        var stu_id = "201431" + str;
        callback(weixinId,stu_id);
    }
}