const express = require('express')
const router = express.Router()
const cartController = require('../controllers/api/cartController')
const orderController = require('../controllers/api/orderController.js')
const productController = require('../controllers/api/productController')
const userController = require('../controllers/api/userController.js')

router.get('/products', productController.getProducts)
router.get('/product/:id', productController.getProduct)

router.get('/cart', cartController.getCart)

router.post('/cartItem', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

router.get('/orders', orderController.getOrders)
router.post('/order', orderController.postOrder)
router.post('/orders/:id/cancel', orderController.cancelOrder)

router.post('/signin', userController.signIn)

module.exports = router
