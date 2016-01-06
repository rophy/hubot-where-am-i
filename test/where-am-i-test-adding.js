'use strict';

var expect = require('chai').expect;
var Helper = require('hubot-test-helper');
var helper = new Helper('../src');
var util = require('./util');

describe('where-am-i handles *hubot (ooo|wfh|pto) <date> <message>* command', function () {
    var room;

    beforeEach(function () {
        room = helper.createRoom();
    });

    afterEach(function () {
        room.destroy();
    });

    it('should add for "OOO" (no date or message)', function () {
        return room.user.say('johnkchiu', '@hubot OOO').then(function () {
            expect(util.getLastResponse(room)).to.deep.equal(
                [ 'hubot', '@johnkchiu *['+util.today+']* *johnkchiu* is _OOO ..._' ]
            );
        });
    });

    it('should add for "OOO today" (no message)', function () {
        return room.user.say('johnkchiu', '@hubot OOO today').then(function () {
            expect(util.getLastResponse(room)).to.deep.equal(
                [ 'hubot', '@johnkchiu *['+util.today+']* *johnkchiu* is _OOO ..._' ]
            );
        });
    });

    it('should add for "OOO today because some reason"', function () {
        return room.user.say('johnkchiu', '@hubot OOO today because some reason').then(function () {
            expect(util.getLastResponse(room)).to.deep.equal(
                [ 'hubot', '@johnkchiu *['+util.today+']* *johnkchiu* is _OOO because some reason..._' ]
            );
        });
    });

    it('should add for "OOO tomorrow" (tomorrow)', function () {
        return room.user.say('johnkchiu', '@hubot OOO tomorrow').then(function () {
            expect(util.getLastResponse(room)).to.deep.equal(
                [ 'hubot', '@johnkchiu *['+util.tomorrow+']* *johnkchiu* is _OOO ..._' ]
            );
        });
    });

    it('should add for "OOO 12/31/2016" (specific date)', function () {
        return room.user.say('johnkchiu', '@hubot OOO 12/31/2016').then(function () {
            expect(util.getLastResponse(room)).to.deep.equal(
                [ 'hubot', '@johnkchiu *[12/31/2016]* *johnkchiu* is _OOO ..._' ]
            );
        });
    });

    it('should add for "WFH"', function () {
        return room.user.say('johnkchiu', '@hubot WFH').then(function () {
            expect(util.getLastResponse(room)).to.deep.equal(
                [ 'hubot', '@johnkchiu *['+util.today+']* *johnkchiu* is _WFH ..._' ]
            );
        });
    });

    it('should add for "PTO"', function () {
        return room.user.say('johnkchiu', '@hubot PTO').then(function () {
            expect(util.getLastResponse(room)).to.deep.equal(
                [ 'hubot', '@johnkchiu *['+util.today+']* *johnkchiu* is _PTO ..._' ]
            );
        });
    });

});
