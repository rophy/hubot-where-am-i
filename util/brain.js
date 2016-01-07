'use strict';

var _ = require('lodash');

module.exports = {
    get: function get(robot, user, date) {
        var data = robot.brain.get(user) || {};
        return data[date.format('MM/DD/YYYY')];
    },

    add: function add(robot, user, date, reason, message) {
        var data = robot.brain.get(user) || {};
        var newData = {
            user: user,
            date: date.format('MM/DD/YYYY'),
            reason: reason,
            message: message
        };
        data[date.format('MM/DD/YYYY')] = newData;
        robot.brain.set(user, data);
    },

    remove: function remove(robot, user, date) {
        var data = robot.brain.get(user) || {};
        data = _.omit(data, date.format('MM/DD/YYYY'));
        robot.brain.set(user, data);
    }
};
