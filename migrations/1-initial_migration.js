'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "businesses", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "initial_migration",
    "created": "2021-11-07T22:06:54.272Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "businesses",
        {
            "BusinessId": {
                "type": Sequelize.INTEGER,
                "field": "BusinessId",
                "primaryKey": true,
                "autoIncrement": true,
                "allowNull": false
            },
            "ContactName": {
                "type": Sequelize.STRING,
                "field": "ContactName"
            },
            "Email": {
                "type": Sequelize.STRING,
                "field": "Email"
            },
            "Username": {
                "type": Sequelize.STRING,
                "field": "Username"
            },
            "Password": {
                "type": Sequelize.STRING,
                "field": "Password"
            },
            "BusinessURL": {
                "type": Sequelize.STRING,
                "field": "BusinessURL"
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": true
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": true
            }
        },
        {}
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
