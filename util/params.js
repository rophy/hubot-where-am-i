'use strict';

var _ = require('lodash');
var moment = require('moment');
var DATE_REGEX = /today|tomorrow|[\d]+\/[\d]+\/[\d]+/i;

module.exports = {

    today: function today() {
        return moment().startOf('day');
    },

    tomorrow: function tomorrow() {
        return moment().startOf('day').add(1, 'days');
    },

    resolveDate: function resolveDate(str) {
        var dateStr = str.match(DATE_REGEX);

        // no date found
        if (!dateStr) {
            return null;
        }

        // match 'today'
        if (dateStr[0].toLowerCase() === 'today') {
            return this.today();
        }

        // match 'tomorrow'
        if (dateStr[0].toLowerCase() === 'tomorrow') {
            return this.tomorrow();
        }

        // else use moments to parse XX/XX/XXXX format
        return moment(dateStr, 'MM-DD-YYYY');
    },

    resolveMessage: function resolveMessage(str) {
        // remove any date and spaces
        return str.replace(DATE_REGEX, '').trim();
    },

    resolveUser: function resolveUser(str, robot) {
        if (str.toLowerCase() === 'everyone') {
            return _.map(robot.brain.users(), 'name');
        }

        if (str.match(/@(.*)/i)) {
            return [ str.substr(1) ];
        }

        // not supported format
        return null;
    }
};
