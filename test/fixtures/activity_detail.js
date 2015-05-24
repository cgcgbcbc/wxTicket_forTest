/**
 * Created by guangchen on 5/24/15.
 */

var success = "success";
var data = {};

var start_time = new Date(2015, 5-1, 31, 0, 0, 0).getTime().toString();
var end_time = new Date(2015, 5-1, 31, 1, 0, 0).getTime().toString();
var book_start = new Date(2015, 5-1, 1, 0, 0, 0).getTime().toString();
var book_end = new Date(2015, 5-1, 1, 1, 0, 0).getTime().toString();

data[success] = {
    name: "test activity",
    key: "test",
    place: "some place",
    description: "this is an activity",
    remain_tickets: 4,
    pic_url: "pic",
    start_time: start_time,
    end_time: end_time,
    book_start: book_start,
    book_end: book_end,
    need_seat: 0
};

exports = module.exports = data;

exports.SUCCESS = success;

exports.NOW = new Date(2015, 4-1, 30, 0, 0, 0).getTime();