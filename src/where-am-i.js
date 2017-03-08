// Description:
//   Hubot for tracking OOO, WFH, PTO, etc.
//
// Dependencies:
//   "hubot-redis-brain": "*",
//   "moment": "*",
//   "lodash": "*"
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
//
// Commands:
//   _<date>_ - It can be `today`, `tomorrow` or `MM/DD/YYYY`..
//   _<user>_ - It can be `everyone` or `@<username`.
//   hubot OOO|WFH <date> <message> - Sets your out of office.  <date> is optional and defaults to `today`.  <message> are optional.
//   hubot clear <date> - Clears your out of office.  <date> is optional and defaults to `today`.
//   hubot where am i - Prints your out of office dates.
//   hubot where is <user> <date> - Prints <user>'s out of office.  <date> is optional and defaults to all dates.
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   <johnkchiu@yahoo.com>

'use strict';

var _ = require('lodash');
var params = require('../util/params');
var brain = require('../util/brain');
var moment = require('moment');

module.exports = function (robot) {

    function formatDisplay(obj) {
        return '*[' + obj.date + ']* *' + obj.user + '* is _' + obj.reason + ' ' + obj.message + '..._';
    }

    // Handles `(wfh|pto|ooo) <date> <message>`
    robot.respond(/(wfh|ooo)[\s]*(.*)/i, function (res) {
        var user = res.message.user.name;
        var reason = res.match[1].toUpperCase();
        var date = params.resolveDate(res.match[2]) || params.today();
        var message = params.resolveMessage(res.match[2]);

        robot.logger.debug('** SET: [user=%s] [reason=%s] [date=%s] [message=%s]', user, reason, date.format(), message);

        // if invalid date
        if (!date.isValid()) {
            return res.reply('Invalid <date> format.  It can be `today`, `tomorrow` or `MM/DD/YYYY`.');
        }

        // get and append data
        brain.add(robot, user, date, reason, message);

        res.reply(formatDisplay( brain.get(robot, user, date) ));
    });

    // Handles `clear <date>`
    robot.respond(/clear[\s]*([^\s]*)/i, function (res) {
        var found = false;
        var user = res.message.user.name;
        var date = params.resolveDate(res.match[1]) || params.today();
        var data = robot.brain.get(user) || {};

        _.forEach(data, function (obj) {
            if (obj.date === date.format('MM/DD/YYYY')) {
                found = true;
                // delete from brain
                brain.remove(robot, user, date);
                // reply
                res.reply('~'+formatDisplay(obj)+'~');
            }
        });

        if (!found) {
            res.reply('I have no information for you.');
        }
    });

    // Handles `where am i`
    robot.respond(/where am i/i, function (res) {
        var found = false;
        var user = res.message.user.name;
        var data = robot.brain.get(user) || {};

        _.forEach(data, function (obj) {
            found = true;
            res.reply(formatDisplay(obj));
        });

        if (!found) {
            res.reply('I have no information for you.');
        }
    });

    // Handles `where is <user> <date>`
    robot.respond(/where is[\s]*([^\s]*)[\s]*([^\s]*)/i, function (res) {
        var users = params.resolveUser(res.match[1], robot);
        var date = params.resolveDate(res.match[2]);
        var response = [];

        // if invalid user
        if (!users) {
            return res.reply('Invalid <user> format.  It can be `everyone` or `@<username`.');
        }

        // if invalid date
        if (date && !date.isValid()) {
            return res.reply('Invalid <date> format.  It can be `today`, `tomorrow` or `MM/DD/YYYY`.');
        }

        robot.logger.debug('** GET: [users=%s]', users);

        _.forEach(users, function (user) {
            var data = robot.brain.get(user) || {};
            _.forEach(data, function (obj) {
                if ( (moment(obj.date, 'MM-DD-YYYY').isSameOrAfter(params.today())) &&
                    (!date || obj.date === date.format('MM/DD/YYYY')) ) {
                    response.push(formatDisplay(obj));
                }
            });
        });

        if (response.length) {
            _.forEach(response.sort(), function(line) {
                res.reply(line);
            });
        } else {
            res.reply('I have no information for ' + res.match[1] + '.');
        }
    });

};
