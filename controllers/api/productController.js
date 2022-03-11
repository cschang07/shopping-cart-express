const db = require('../../models')
const Product = db.Product
const pageLimit = 10;

const productController = {
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

      return res.json({ products: result, totalPage, page, prev, next })
    })
  },
  getProduct: (req, res) => {
    return Product.findByPk(req.params.id)
      .then(product => {
        return res.json(product.dataValues)
      })
  },
  searchProduct: (req, res) => {
    return Product.findAll()
      .then(products => {
        const keyword = req.body.keyword
        const targets = products.filter(product => product.dataValues.name.toLowerCase().includes(keyword.toLowerCase()) || product.dataValues.description.toLowerCase().includes(keyword.toLowerCase()))
        return res.json(targets)
      })
  },
  editProduct: (req, res) => {
    return Product.findByPk(req.body.id)
      .then(product => {
        product.update({
          name: req.body.name,
          description: req.body.description,
          image: req.body.image,
          price: req.body.price
        })
          .then(result => {
            return res.json('Product edit successfully.')
          })
      })
  }
}

module.exports = productController