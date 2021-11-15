'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testimonials extends Model {
  
    static associate(models) { 
      Testimonials.belongsTo(models.businesses, {as: "Business", foreignKey: "BusinessId"})
        // foreignKey: "BusinessId",  targetKey: "BusinessId"})
    }
  };
  Testimonials.init({
    testimonyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Synopsis: DataTypes.STRING,
    Title: DataTypes.STRING,
    Body: DataTypes.STRING,
    Approved: DataTypes.DATE,
    BusinessId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Testimonials',
  });
  return Testimonials;
};