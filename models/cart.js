'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsToMany(models.Product, {
        as: 'items',
        through: {
          model: models.CartItem, unique: false
        },
        foreignKey: 'CartId'
      });
      // Cart.belongsTo(models.User)
    }
  };
  Cart.init({
    // quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};