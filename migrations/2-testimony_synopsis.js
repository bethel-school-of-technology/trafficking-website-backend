'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Synopsis" to table "Testimonials"
 *
 **/

var info = {
    "revision": 2,
    "name": "testimony_synopsis",
    "created": "2021-11-15T01:05:11.782Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "Testimonials",
        "Synopsis",
        {
            "type": Sequelize.STRING,
            "field": "Synopsis"
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
