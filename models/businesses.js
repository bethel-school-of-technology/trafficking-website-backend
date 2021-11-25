'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class businesses extends Model {

    static associate(models) {
      businesses.hasMany(models.Testimonials, { constraints:false,foreignKey: "BusinessId"})
    }
  };
  businesses.init({
    BusinessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ContactName:
      DataTypes.STRING,
    OrganizationName: {
    type: DataTypes.STRING,
    unique: true
    },
    Email: {
    type: DataTypes.STRING,
    unique: true
    },
    Username: {
      type: DataTypes.STRING,
      unique: true
    },
    Password: DataTypes.STRING,
    BusinessURL: DataTypes.STRING,
    Admin: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'businesses',
  });
  return businesses;
};