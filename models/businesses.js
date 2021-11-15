'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class businesses extends Model {

    static associate(models) {
      businesses.hasMany(models.Testimonials, { foreignKey: "BusinessId"})
    }
  };
  businesses.init({
    BusinessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ContactName: DataTypes.STRING,
    Email: DataTypes.STRING,
    Username: DataTypes.STRING,
    Password: DataTypes.STRING,
    BusinessURL: DataTypes.STRING,
    Admin: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'businesses',
  });
  return businesses;
};