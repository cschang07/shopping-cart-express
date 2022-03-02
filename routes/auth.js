const express = require('express')
const router = express.Router()

const passport = require('passport')
const userController = require('../controllers/api/userController')

router.post('/auth/facebook', passport.authenticate('facebookToken', {session: false}), userController.facebookOAuth)
// router.get('/facebook', passport.authenticate('facebook', {
//   scope: ['email', 'public_profile']
// }))

// router.get('/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: 'https://mingmoth.github.io/shop-forum/#/home',
//   failureRedirect: 'https://mingmoth.github.io/shop-forum/#/signin'
// }))

module.exports = router