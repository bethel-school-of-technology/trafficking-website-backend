'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testimonials extends Model {
  
    static associate(models) { 
      Testimonials.hasOne(models.businesses, {as: "Business",constraints: false, foreignKey: "BusinessId"})
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
    Declined:DataTypes.DATE,
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    BusinessId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Testimonials',
  });
  return Testimonials;
};