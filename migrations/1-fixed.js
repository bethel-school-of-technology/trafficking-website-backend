'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "businesses", deps: []
 * createTable "Testimonials", deps: [businesses]
 *
 **/

var info = {
    "revision": 1,
    "name": "fixed",
    "created": "2021-11-14T00:57:49.211Z",
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
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Testimonials",
            {
                "testimonyId": {
                    "type": Sequelize.INTEGER,
                    "field": "testimonyId",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "allowNull": false
                },
                "Title": {
                    "type": Sequelize.STRING,
                    "field": "Title"
                },
                "Body": {
                    "type": Sequelize.STRING,
                    "field": "Body"
                },
                "Approved": {
                    "type": Sequelize.BOOLEAN,
                    "field": "Approved"
                },
                "BusinessId": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "businesses",
                        "key": "BusinessId"
                    },
                    "allowNull": true,
                    "field": "BusinessId"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
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
