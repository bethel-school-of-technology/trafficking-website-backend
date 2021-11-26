'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "businesses", deps: []
 * createTable "Testimonials", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "initialmiggg",
    "created": "2021-11-26T04:43:04.183Z",
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
                "OrganizationName": {
                    "type": Sequelize.STRING,
                    "field": "OrganizationName",
                    "unique": true
                },
                "Email": {
                    "type": Sequelize.STRING,
                    "field": "Email",
                    "unique": true
                },
                "Username": {
                    "type": Sequelize.STRING,
                    "field": "Username",
                    "unique": true
                },
                "Password": {
                    "type": Sequelize.STRING,
                    "field": "Password"
                },
                "BusinessURL": {
                    "type": Sequelize.STRING,
                    "field": "BusinessURL"
                },
                "Admin": {
                    "type": Sequelize.BOOLEAN,
                    "field": "Admin"
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
                "Synopsis": {
                    "type": Sequelize.STRING,
                    "field": "Synopsis"
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
                    "type": Sequelize.DATE,
                    "field": "Approved"
                },
                "Declined": {
                    "type": Sequelize.DATE,
                    "field": "Declined"
                },
                "Deleted": {
                    "type": Sequelize.BOOLEAN,
                    "field": "Deleted",
                    "defaultValue": false
                },
                "BusinessId": {
                    "type": Sequelize.INTEGER,
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
