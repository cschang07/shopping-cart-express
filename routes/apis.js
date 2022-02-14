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

router.get('/cart', authenticated, cartController.getCart)

router.post('/cartItem', authenticated, cartController.postCart)
router.post('/cartItem/add', authenticated, cartController.addCartItem)
router.post('/cartItem/sub', authenticated, cartController.subCartItem)
router.delete('/cartItem', authenticated, cartController.deleteCartItem)

router.get('/orders', authenticated, orderController.getOrders)
router.post('/order', authenticated, orderController.postOrder)
router.post('/orders/:id/cancel', authenticated, orderController.cancelOrder)

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/getuser', authenticated, userController.getUser)

router.get('/order/:id/payment', authenticated, orderController.getPayment)
router.post('/newebpay/callback', authenticated, orderController.newebpayCallback)

module.exports = router
