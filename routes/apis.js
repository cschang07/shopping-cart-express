const express = require('express')
const router = express.Router()
const passport = require("../config/passport");

//JWT
const jwt = require('jsonwebtoken')


const authenticated = passport.authenticate('jwt', { session: false })
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn

const ensureLoggedIn = ensureLogIn();

const adminController = require('../controllers/api/adminController')
const cartController = require('../controllers/api/cartController')
const orderController = require('../controllers/api/orderController')
const productController = require('../controllers/api/productController')
const userController = require('../controllers/api/userController')

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
router.post('/search/product', productController.searchProduct)
router.put('/edit/product', productController.editProduct)

router.get('/cart', authenticated, cartController.getCart)

router.post('/cartItem', authenticated, cartController.postCart)
router.put('/cartItem/add', authenticated, cartController.addCartItem)
router.put('/cartItem/sub', authenticated, cartController.subCartItem)
router.put('/cartItem/del', authenticated, cartController.deleteCartItem)

router.get('/orders', authenticated, orderController.getOrders) //for the admin to get all users' orders
router.get('/order', ensureLoggedIn, orderController.getOrder) //get the user's orders
router.post('/order', authenticated, orderController.postOrder)
router.post('/orders/:id/cancel', authenticated, orderController.cancelOrder)

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/getuser', authenticated, userController.getUser)
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    session: false
  }), (req, res) => {
    const payload = { id: req.user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    req.user.password = undefined
    return res.redirect(`${process.env.BASE_URL}/#/_=_?UserId=${req.user.id}&token=${token}`)
    // return res.redirect('https://mingmoth.github.io/shop-forum/#/home')
  }
)
router.delete('/user/delete', userController.deleteUser)

router.get('/order/:id/payment', authenticated, orderController.getPayment)
router.post('/newebpay/callback', authenticated, orderController.newebpayCallback)

router.get('/admin/products', authenticated, authenticatedAdmin, adminController.getProducts)
router.get('/admin/product/:id', authenticated, authenticatedAdmin, adminController.getProduct)
router.put('/admin/product', authenticated, authenticatedAdmin, adminController.editProduct)

module.exports = router
