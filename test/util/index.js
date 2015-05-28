/**
 * Created by guangchen on 5/27/15.
 */
var models = require('../../models/models')
    , db = models.db;
var userFixture = require('../fixtures/manager.json');
var studentFixture = require('../fixtures/student.json');
var activityFixture = require('../fixtures/activity');

exports = module.exports;
exports.loadFixture = loadFixture;
exports.clearData = clearData;
exports.loadUser = loadUser;
exports.loadStudent = loadStudent;
exports.loadActivity = loadActivity;


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