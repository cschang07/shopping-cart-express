const express = require('express')
const router = express.Router()
const cartController = require('../controllers/api/cartController')
const productController = require('../controllers/api/productController')

router.get('/products', productController.getProducts)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.postCart)

module.exports = router
