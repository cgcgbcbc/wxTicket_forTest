/**
 * Created by guangchen on 5/27/15.
 */
var models = require('../../models/models')
    , db = models.db;
var userFixture = require('../fixtures/manager.json');

exports = module.exports;
exports.loadFixture = loadFixture;
exports.clearData = clearData;
exports.loadUser = loadUser;


function loadFixture(collection, data, callback) {
    db[collection].insert(data, callback);
}

function clearData(callback) {
    db.dropDatabase(callback);
}

function loadUser(callback) {
    loadFixture(models.admins, userFixture, callback);
}