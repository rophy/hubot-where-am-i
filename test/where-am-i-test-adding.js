'use strict';

var expect = require('chai').expect;
var Helper = require('hubot-test-helper');
var helper = new Helper('../src');
var moment = require('moment');

describe('where-am-i adding', function () {
    var room;
    var today = moment().startOf('day').format('MM/DD/YYYY');
    var tomorrow = moment().startOf('day').add(1, 'days').format('MM/DD/YYYY');

    beforeEach(function () {
        room = helper.createRoom();
    });

    afterEach(function () {
        room.destroy();
    });

    context('handles *hubot (ooo|wfh|pto) <date> <message>* command', function () {

        it('should add for "OOO" (no date or message)', function () {
            return room.user.say('johnkchiu', '@hubot OOO').then(function () {
                expect(room.messages).to.deep.equal([
                    [ 'johnkchiu', '@hubot OOO' ],
                    [ 'hubot', '@johnkchiu Gotcha!' ],
                    [ 'hubot', '@johnkchiu *['+today+']* *johnkchiu* is _OOO ..._' ]
                ]);
            });
        });

        it('should add for "OOO today" (no message)', function () {
            return room.user.say('johnkchiu', '@hubot OOO today').then(function () {
                expect(room.messages).to.deep.equal([
                    [ 'johnkchiu', '@hubot OOO today' ],
                    [ 'hubot', '@johnkchiu Gotcha!' ],
                    [ 'hubot', '@johnkchiu *['+today+']* *johnkchiu* is _OOO ..._' ]
                ]);
            });
        });

        it('should add for "OOO today because some reason"', function () {
            return room.user.say('johnkchiu', '@hubot OOO today because some reason').then(function () {
                expect(room.messages).to.deep.equal([
                    [ 'johnkchiu', '@hubot OOO today because some reason' ],
                    [ 'hubot', '@johnkchiu Gotcha!' ],
                    [ 'hubot', '@johnkchiu *['+today+']* *johnkchiu* is _OOO because some reason..._' ]
                ]);
            });
        });

        it('should add for "OOO tomorrow" (tomorrow)', function () {
            return room.user.say('johnkchiu', '@hubot OOO tomorrow').then(function () {
                expect(room.messages).to.deep.equal([
                    [ 'johnkchiu', '@hubot OOO tomorrow' ],
                    [ 'hubot', '@johnkchiu Gotcha!' ],
                    [ 'hubot', '@johnkchiu *['+tomorrow+']* *johnkchiu* is _OOO ..._' ]
                ]);
            });
        });

        it('should add for "OOO 12/31/2016" (specific date)', function () {
            return room.user.say('johnkchiu', '@hubot OOO 12/31/2016').then(function () {
                expect(room.messages).to.deep.equal([
                    [ 'johnkchiu', '@hubot OOO 12/31/2016' ],
                    [ 'hubot', '@johnkchiu Gotcha!' ],
                    [ 'hubot', '@johnkchiu *[12/31/2016]* *johnkchiu* is _OOO ..._' ]
                ]);
            });
        });

        it('should add for "WFH"', function () {
            return room.user.say('johnkchiu', '@hubot WFH').then(function () {
                expect(room.messages).to.deep.equal([
                    [ 'johnkchiu', '@hubot WFH' ],
                    [ 'hubot', '@johnkchiu Gotcha!' ],
                    [ 'hubot', '@johnkchiu *['+today+']* *johnkchiu* is _WFH ..._' ]
                ]);
            });
        });

        it('should add for "PTO"', function () {
            return room.user.say('johnkchiu', '@hubot PTO').then(function () {
                expect(room.messages).to.deep.equal([
                    [ 'johnkchiu', '@hubot PTO' ],
                    [ 'hubot', '@johnkchiu Gotcha!' ],
                    [ 'hubot', '@johnkchiu *['+today+']* *johnkchiu* is _PTO ..._' ]
                ]);
            });
        });

    });

});
