var expect = require('chai').expect,
    fs = require('fs'),
    extractDepVars = require('../');

describe('extractDepVars', function () {
    it('extract deps from normal script', function () {
        var code = fs.readFileSync('test/js/sample3.js', 'utf8'),
            deps = extractDepVars(code);
        expect(deps).to.eql(['Human']);
    });

    describe('find', function () {
        it('var defined after.', function () {
            var code = fs.readFileSync('test/js/sample1.js', 'utf8'),
                deps = extractDepVars(code);
            expect(deps).to.eql([]);
        });

        it('defun.', function () {
            var code = fs.readFileSync('test/js/sample2.js', 'utf8'),
                deps = extractDepVars(code);
            expect(deps).to.eql([]);
        });

        it('access name through window', function () {
            var code = fs.readFileSync('test/js/sample4.js', 'utf8'),
                deps = extractDepVars(code);
            expect(deps).to.eql(['mogera']);
        });

        it('define name through window', function () {
            var code = fs.readFileSync('test/js/sample5.js', 'utf8'),
                deps = extractDepVars(code);
            expect(deps).to.eql([]);
        });
    });
});
