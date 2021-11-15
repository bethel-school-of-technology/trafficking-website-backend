'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "bId" from table "Testimonials"
 * changeColumn "Approved" on table "Testimonials"
 * changeColumn "BusinessId" on table "Testimonials"
 *
 **/

var info = {
    "revision": 4,
    "name": "datetimechange",
    "created": "2021-11-15T20:17:27.764Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "removeColumn",
        params: ["Testimonials", "bId"]
    },
    {
        fn: "changeColumn",
        params: [
            "Testimonials",
            "Approved",
            {
                "type": Sequelize.DATE,
                "field": "Approved"
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
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "businesses",
                    "key": "BusinessId"
                },
                "allowNull": true,
                "field": "BusinessId"
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
