var mongojs = require('mongojs');
var tickets = "ticket";
var activities = "activity";
var students = "student";
var admins = "manager";
var seats = "seat";


exports.tickets = tickets;
exports.activities = activities;
exports.students = students;
exports.admins = admins;
exports.seats = seats;

var dbUrl = 'mongodb://localhost/test23';
if (process.env.NODE_ENV === 'development') {
    dbUrl = 'mongodb://localhost/dev';
} else if (process.env.NODE_ENV === 'test') {
    dbUrl = 'mongodb://localhost/test';
}

exports.db = mongojs(dbUrl, [tickets, activities, students, admins, seats]);

exports.getIDClass = function (idValue) {
    idValue = "" + idValue;
    return mongojs.ObjectId(idValue);
};
