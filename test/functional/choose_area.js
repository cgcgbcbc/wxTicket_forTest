var util = require('../util');
describe('test choose area', function() {
    before(function(done) {
        util.clearData(function(err) {
            if (err != null) done(err);
            util.loadChooseArea(done);
        });
    });
    it('should', function(done) {
        done();
    });
});