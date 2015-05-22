

var hostIP='127.0.0.1';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    if (process.env.PORT) {
        hostIP += ":" + process.env.PORT
    } else {
        hostIP += ":4600";
    }
}

exports.IP=hostIP;
exports.validateAddress=    "http://"+hostIP+"/validate";
exports.ticketInfo=         "http://"+hostIP+"/ticketsinfo";
exports.userPage=           "http://"+hostIP+"/users";
exports.activityInfo=       "http://"+hostIP+"/actinfo";
exports.choosearea=         "http://"+hostIP+"/choosearea";
exports.chooseseat=         "http://"+hostIP+"/chooseseat";
exports.help=               "http://"+hostIP+"/help/help.html";

exports.autoRefresh=false;
