'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Admin" to table "businesses"
 *
 **/

var info = {
    "revision": 5,
    "name": "adminfield",
    "created": "2021-11-15T20:28:08.132Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "businesses",
        "Admin",
        {
            "type": Sequelize.BOOLEAN,
            "field": "Admin"
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
