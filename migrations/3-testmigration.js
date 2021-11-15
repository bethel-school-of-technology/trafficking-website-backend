'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "bId" to table "Testimonials"
 * changeColumn "BusinessId" on table "Testimonials"
 *
 **/

var info = {
    "revision": 3,
    "name": "testmigration",
    "created": "2021-11-15T17:26:33.388Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "Testimonials",
            "bId",
            {
                "type": Sequelize.INTEGER,
                "field": "bId"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Testimonials",
            "BusinessId",
            {
                "type": Sequelize.INTEGER,
                "field": "BusinessId",
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "businesses",
                    "key": "BusinessId"
                },
                "allowNull": true
            }
        ]
    }
];

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
