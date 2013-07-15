var expect = require('chai').expect,
    fs = require('fs'),
    extractDepVars = require('../');

describe('extractDepVars', function () {
    it('extract deps from normal script', function (done) {
        var code = fs.readFileSync('test/js/sample3.js', 'utf8');

        extractDepVars(code, function (deps) {
            expect(deps).to.eql(['Human']);
            done();
        });
    });

    describe('find', function () {
        it('var defined after.', function (done) {
            var code = fs.readFileSync('test/js/sample1.js', 'utf8');

            extractDepVars(code, function (deps) {
                expect(deps).to.eql([]);
                done();
            });
        });

        it('defun.', function (done) {
            var code = fs.readFileSync('test/js/sample2.js', 'utf8');

            extractDepVars(code, function (deps) {
                expect(deps).to.eql([]);
                done();
            });
        });
    });
});
