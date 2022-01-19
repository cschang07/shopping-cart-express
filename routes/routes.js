const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js')
const productController = require('../controllers/productController.js')

// home page
router.get('/', (req, res) => res.redirect('/products'));

router.get('/products', productController.getProducts)

router.get('/cart', cartController.getCart)

router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

router.get('/orders', orderController.getOrders)
router.post('/order', orderController.postOrder)
router.post('/orders/:id/cancel', orderController.cancelOrder)

// 匯出路由器
module.exports = router