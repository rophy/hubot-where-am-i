'use strict';

var expect = require('chai').expect;
var Helper = require('hubot-test-helper');
var helper = new Helper('../src');
var util = require('./util');

//   *hubot where am i*                     - Prints your out of office dates.
//   *hubot where is <user> <date>*         - Prints <person>'s out of office.  <date> is optional.

describe('where-am-i handles *hubot where am i* or *hubot where is <user> <date>* command', function () {
    var room;

    beforeEach(function () {
        room = helper.createRoom();
    });

    afterEach(function () {
        room.destroy();
    });

    context('user has added OOO', function () {
        beforeEach(function() {
            return room.user.say('user1', '@hubot OOO')
                .then(room.user.say('user2', '@hubot OOO'))
                .then(room.user.say('user2', '@hubot OOO tomorrow'))
                .then(room.user.say('user2', '@hubot OOO 12/31/2016'));
        });

        it('should find for "where am i"', function () {
            return room.user.say('user1', '@hubot where am i').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@user1 *['+util.today+']* *user1* is _OOO ..._' ]
                );
            });
        });

        it('should find for "where is <user>"', function () {
            return room.user.say('user1', '@hubot where is @user2').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@user1 *['+util.today+']* *user2* is _OOO ..._' ]
                );
            });
        });

        it('should find for "where is <user> today"', function () {
            return room.user.say('user1', '@hubot where is @user2 today').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@user1 *['+util.today+']* *user2* is _OOO ..._' ]
                );
            });
        });

        it('should find for "where is <user> 12/31/2016" (specific date)', function () {
            return room.user.say('user1', '@hubot where is @user2 12/31/2016').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@user1 *[12/31/2016]* *user2* is _OOO ..._' ]
                );
            });
        });

        it('should find for "where is <user> tomorrow"', function () {
            return room.user.say('user1', '@hubot where is @user2 tomorrow').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@user1 *['+util.tomorrow+']* *user2* is _OOO ..._' ]
                );
            });
        });

    });

    context('user has NOT added OOO previously', function () {

        it('should return an info/error message for "where am i"', function () {
            return room.user.say('johnkchiu', '@hubot where am i').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@johnkchiu I have no information for you.' ]
                );
            });
        });

        it('should return an info/error message for "where is <user>"', function () {
            return room.user.say('johnkchiu', '@hubot where is @user1').then(function () {
                expect(util.getLastResponse(room)).to.deep.equal(
                    [ 'hubot', '@johnkchiu I have no information for @user1.' ]
                );
            });
        });

    });


});
