/**
 * Created by guangchen on 5/25/15.
 */

var request = require('supertest')
    , should = require('should')
    , app = require('../../app')
    , agent = request.agent(app);

var baseUrl = '/users/manage/checkin';
describe('test routes/checkin', function() {
    before(function(done) {
        agent
            .post("/login")
            .send({
                username: "admin",
                password: "pwd"
            })
            .expect(function(res) {
                should(res.text).be.a.String.and.match(/success/);
            })
            .end(done);
    });
    describe('/', function() {
        describe('#GET', function() {
            it('should return Must have actid if no actid', function(done) {
                agent
                    .get(baseUrl)
                    .expect(200)
                    .expect(function(res) {
                        should(res.text).be.a.String.and.eql('Must have actid.');
                    })
                    .end(done);
            });
            it('should render checkin page', function(done) {
                agent
                    .get(baseUrl + '?actid=5562dd803164564a23b7269f')
                    .expect(200)
                    .expect(/检票 - simple activity - 紫荆之声/)
                    .end(done);
            });
        });
        describe('#POST', function() {
            it('should return err if no actid', function(done) {
                agent
                    .post(baseUrl)
                    .expect(200)
                    .expect(function(res) {
                        should(res.body.result).be.a.String.and.eql('error');
                    })
                    .end(done);
            });
            it('should return success if valid checkin with stuId', function(done) {
                agent
                    .post(baseUrl + '?actid=5562e19b61fe7b8f24a70b3a')
                    .send({uid: '2014311933'})
                    .expect(200)
                    .expect(function(res) {
                        should(res.body.result).be.a.String.and.eql('success');
                        should(res.body.msg).be.a.String.and.eql('accepted');
                    })
                    .end(done);
            });
            it('should return success if valid checkin with uniqueId', function(done) {
                agent
                    .post(baseUrl + '?actid=5562e19b61fe7b8f24a70b3a')
                    .send({uid: 'ylvmhEij5tZkwRnpm4DFzIQvxueI8WGw'})
                    .expect(200)
                    .expect(function(res) {
                        should(res.body.result).be.a.String.and.eql('success');
                        should(res.body.msg).be.a.String.and.eql('accepted');
                    })
                    .end(done);
            });
        });
    });
});