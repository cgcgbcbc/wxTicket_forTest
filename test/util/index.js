/**
 * Created by guangchen on 5/27/15.
 */
var models = require('../../models/models')
    , db = models.db;

exports = module.exports;
exports.loadFixture = loadFixture;
exports.clearData = clearData;


function loadFixture(collection, data, callback) {
    db[collection].insert(data, callback);
}

function clearData(callback) {
    db.dropDatabase(callback);
}