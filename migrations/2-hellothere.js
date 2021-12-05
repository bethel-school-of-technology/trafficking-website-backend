'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Deleted" to table "businesses"
 *
 **/

var info = {
    "revision": 2,
    "name": "hellothere",
    "created": "2021-12-05T00:17:59.635Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "businesses",
        "Deleted",
        {
            "type": Sequelize.BOOLEAN,
            "field": "Deleted",
            "defaultValue": false
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
