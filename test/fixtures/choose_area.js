var mongojs = require('mongojs');

var seat = [
    {
        "_id": mongojs.ObjectId("5576aae73f1b65d4f70944e0"),
        "activity": mongojs.ObjectId("5576aae73f1b65d4f70944df"),
        "A_area": 1,
        "B_area": 1,
        "C_area": 0,
        "D_area": 0,
        "E_area": 0
    }
];

var activity = [
    {
        "_id": mongojs.ObjectId("5576aae73f1b65d4f70944df"),
        "status": 1,
        "name": "choose seat",
        "key": "choose_seat",
        "place": "place",
        "description": "choose seat",
        "pic_url": "pic",
        "need_seat": 1,
        "remain_tickets": 2,
        "price": "",
        "start_time": Date.now() + 3600000 * 2,
        "end_time": Date.now() + 3600000 * 3,
        "book_start": Date.now() - 3600000,
        "book_end": Date.now() + 3600000
    }

];

var ticket = [
    {
        "stu_id": "2014311933",
        "unique_id": "wdLNvbtd2eRzPbTVrhEH7e16RzG5xsbf",
        "activity": mongojs.ObjectId("5576aae73f1b65d4f70944df"),
        "status": 1,
        "seat": "",
        "cost": 0
    }, {
        "stu_id": "2014311937",
        "unique_id": "ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw",
        "activity": mongojs.ObjectId("5576aae73f1b65d4f70944df"),
        "status": 1,
        "seat": "",
        "cost": 0
    }
];

exports = module.exports;

exports.ticket = ticket;
exports.activity = activity;
exports.seat = seat;