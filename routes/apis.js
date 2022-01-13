const express = require('express')
const router = express.Router()
// const cartController = require('../controllers/api/cartController')
const productController = require('../controllers/api/productController')

router.get('/products', productController.getProducts)

module.exports = router
