'use strict';

var expect = require('chai').expect;
var Helper = require('hubot-test-helper');
var helper = new Helper('../src');
var util = require('./util');

describe('where-am-i handles *hubot clear <date>* command', function () {
    var room;

    beforeEach(function () {
        room = helper.createRoom();
    });

    afterEach(function () {
        room.destroy();
    });

    context('user has added OOO', function () {
        beforeEach(function() {
            return room.user.say('johnkchiu', '@hubot OOO')
                .then(room.user.say('johnkchiu', '@hubot OOO tomorrow'))
                .then(room.user.say('johnkchiu', '@hubot OOO 12/31/2020'));
        });

        it('should clear for "clear" (no date)', function () {
            expect(room.robot.brain.get('johnkchiu')[util.today]).is.not.empty;
            return room.user.say('johnkchiu', '@hubot clear').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@johnkchiu ~*['+util.today+']* *johnkchiu* is _OOO ..._~' ]
                );
                expect(room.robot.brain.get('johnkchiu')[util.today]).is.empty;
            });
        });

        it('should clear for "clear today"', function () {
            expect(room.robot.brain.get('johnkchiu')[util.today]).is.not.empty;
            return room.user.say('johnkchiu', '@hubot clear today').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@johnkchiu ~*['+util.today+']* *johnkchiu* is _OOO ..._~' ]
                );
                expect(room.robot.brain.get('johnkchiu')[util.today]).is.empty;
            });
        });

        it('should clear for "clear tomorrow"', function () {
            expect(room.robot.brain.get('johnkchiu')[util.tomorrow]).is.not.empty;
            return room.user.say('johnkchiu', '@hubot clear tomorrow').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@johnkchiu ~*['+util.tomorrow+']* *johnkchiu* is _OOO ..._~' ]
                );
                expect(room.robot.brain.get('johnkchiu')[util.tomorrow]).is.empty;
            });
        });

        it('should clear for "clear 12/31/2020" (specific date)', function () {
            expect(room.robot.brain.get('johnkchiu')['12/31/2020']).is.not.empty;
            return room.user.say('johnkchiu', '@hubot clear 12/31/2020').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@johnkchiu ~*[12/31/2020]* *johnkchiu* is _OOO ..._~' ]
                );
                expect(room.robot.brain.get('johnkchiu')['12/31/2020']).is.empty;
            });
        });

    });

    context('user has NOT added OOO previously', function () {

        it('should return an info/error message', function () {
            return room.user.say('johnkchiu', '@hubot clear').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@johnkchiu I have no information for you.' ]
                );
            });
        });

    });
});
