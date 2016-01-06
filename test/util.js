'use strict';

var moment = require('moment');

module.exports = {
    today: moment().startOf('day').format('MM/DD/YYYY'),
    tomorrow: moment().startOf('day').add(1, 'days').format('MM/DD/YYYY'),

    /**
     * getLastResponse - Returns the last message from 'room.messages'
     *
     * @param  {Object} room    Instance of Room object.
     * @return {Array}          Array of the response message [ username, message ]
     */
    getLastResponse: function getLastResponse(room) {
        return room.messages[room.messages.length-1];
    }
};
