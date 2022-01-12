const db = require('../models')
const Product = db.Product


const productController = {
  getProducts: (req, res) => {
    Product.findAll({  raw: true, nest: true })
      .then(products => {
        console.log(products)
        return res.render('products', {
          products
        })
      })
  },
}

module.exports = productController