const express = require('express')
const router = express.Router()
const cartController = require('../controllers/api/cartController')
const orderController = require('../controllers/api/orderController.js')
const productController = require('../controllers/api/productController')
const userController = require('../controllers/api/userController.js')
const passport = require("../config/passport");

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

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
router.post('/signup', userController.signUp)

router.get('/order/:id/payment', orderController.getPayment)
router.post('/newebpay/callback', orderController.newebpayCallback)

module.exports = router
