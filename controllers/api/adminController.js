const db = require('../../models')
const Product = db.Product
const pageLimit = 10;

const adminController = {
  getProducts: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Product.findAndCountAll({
      raw: true,
      nest: true,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      //if page - 1 < 1, then it is 1, otherwise it's page -1
      const prev = page - 1 < 1 ? 1 : page - 1
      //if page + 1 > pages, then it is pages, otherwise it's page +1
      const next = page + 1 > pages ? pages : page + 1

      return res.json({ products: result, totalPage, prev, next })
    })
  },
  getProduct: (req, res) => {
    return Product.findByPk(req.params.id)
      .then(product => {
        return res.json(product.dataValues)
      })
  },
  editProduct: (req, res) => {
    return Product.findByPk(req.body.id)
    .then(product => {
      console.log(product)
      product.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      })
    })
    .then(result => {
      return res.json({ status: 'success', message: 'Edit successfully' })
    })
  }
}

module.exports = adminController