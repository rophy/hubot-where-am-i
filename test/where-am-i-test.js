'use strict';

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('sinon-chai'));

describe('where-am-i', function () {

    beforeEach(function() {
        this.robot = {
            respond: sinon.spy(),
            hear: sinon.spy()
        };
        return require('../src/where-am-i')(this.robot);
    });

    it('registers a respond listener', function () {
        expect(this.robot.respond).to.have.been.calledWith(/(wfh|pto|ooo)[\s]*(.*)/i);
        expect(this.robot.respond).to.have.been.calledWith(/where am i/i);
        expect(this.robot.respond).to.have.been.calledWith(/where is[\s]*([^\s]*)[\s]*([^\s]*)/i);
    });
});
