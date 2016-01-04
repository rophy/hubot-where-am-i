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
//   _<date>_ - It can be `today`, `tomorrow` or `MM/DD/YYYY`.  Defaults to `today`.
//   _<user>_ - It can be `everyone` or `@<username`.
//   *hubot (ooo|wfh|pto) <date> <message>* - Sets your out of office.  <date> and <message> are optional.
//   *hubot clear <date>* - Clears your out of office.  <date> is optional.
//   *hubot where am i* - Prints your out of office dates.
//   *hubot where is <user> <date>* - Prints <person>'s out of office.  <date> is optional.
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   <johnkchiu@yahoo.com>

'use strict';

var _ = require('lodash');
var moment = require('moment');

module.exports = function (robot) {

    var DATE_REGEX = /today|tomorrow|[\d]+\/[\d]+\/[\d]+/i;

    function resolveDate(str) {
        var dateStr = str.match(DATE_REGEX);

        // default to today if no match
        if (!dateStr) {
            return moment().startOf('day');
        }

        // match 'today'
        if (dateStr[0].toLowerCase() === 'today') {
            return moment().startOf('day');
        }

        // match 'tomorrow'
        if (dateStr[0].toLowerCase() === 'tomorrow') {
            return moment().startOf('day').add(1, 'days');
        }

        // else use moments to parse XX/XX/XXXX format
        return moment(dateStr, 'MM-DD-YYYY');
    }

    function resolveMessage(str) {
        // remove any date and spaces
        return str.replace(DATE_REGEX, '').trim();
    }

    function resolveUser(str) {
        if (str.toLowerCase() === 'everyone') {
            return _.map(robot.brain.users(), 'name');
        }

        if (str.match(/@/i)) {
            // FIXME: (jchiu) ...
        }

        // not supported format
        return null;
    }

    function formatDisplay(obj) {
        return '*[' + obj.date + ']* *' + obj.user + '* is _' + obj.reason + '... ' + obj.message + '_';
    }

    // Handles `(wfh|pto|ooo) <date> <message>`
    robot.respond(/(wfh|pto|ooo)[\s]*(.*)/i, function (res) {
        var user = res.message.user.name;
        var reason = res.match[1].toUpperCase();
        var date = resolveDate(res.match[2]);   // moment object
        var message = resolveMessage(res.match[2]);

        robot.logger.info('** SET: [user=%s] [reason=%s] [date=%s] [message=%s]', user, reason, date.format(), message);

        // if invalid date
        if (!date.isValid()) {
            return res.send('Invalid <date> format.  It can be `today`, `tomorrow` or `MM/DD/YYYY`.');
        }

        // get and append data
        var data = robot.brain.get(user) || {};
        var newData = {
            user: user,
            date: date.format('MM/DD/YYYY'),
            reason: reason,
            message: message
        };
        data[date.format('MM/DD/YYYY')] = newData;
        robot.brain.set(user, data);

        res.send('Gotcha!');
        res.send(formatDisplay(newData));
    });

    // Handles `clear <date>`
    robot.respond(/clear[\s]*([^\s]*)/i, function (res) {
        var found = false;
        var user = res.message.user.name;
        var data = robot.brain.get(user) || {};

        // FIXME: (jchiu) Need to match by <date>!

        _.forEach(data, function (obj) {
            found = true;
            res.send(formatDisplay(obj));
        });

        if (!found) {
            res.send('I have no information for you.');
        }
    });

    // Handles `where am i`
    robot.respond(/where am i/i, function (res) {
        var found = false;
        var user = res.message.user.name;
        var data = robot.brain.get(user) || {};
        _.forEach(data, function (obj) {
            found = true;
            res.send(formatDisplay(obj));
        });

        if (!found) {
            res.send('I have no information for you.');
        }
    });

    // Handles `where is <user> <date>`
    robot.respond(/where is[\s]*([^\s]*)[\s]*([^\s]*)/i, function (res) {
        var found = false;
        var users = resolveUser(res.match[1]);
        var date = resolveDate(res.match[2]);

        // if invalid user
        if (!users) {
            return res.send('Invalid <user> format.  It can be `everyone` or `@<username`.');
        }

        // if invalid date
        if (!date.isValid()) {
            return res.send('Invalid <date> format.  It can be `today`, `tomorrow` or `MM/DD/YYYY`.');
        }

        robot.logger.info('** GET: [users=%s]', users);

        // FIXME: (jchiu) Need to match by <date>!

        _.forEach(users, function (user) {
            var data = robot.brain.get(user) || {};
            _.forEach(data, function (obj) {
                found = true;
                res.send(formatDisplay(obj));
            });
        });

        if (!found) {
            res.send('I have no information for ' + res.match[1] + '.');
        }
    });

};
