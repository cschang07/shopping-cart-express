const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')

// home page
router.get('/', (req, res) => res.redirect('/products'));

router.get('/products', productController.getProducts)


router.get('/cart', cartController.getCart)

// 匯出路由器
module.exports = router