const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: 'https://mingmoth.github.io/shop-forum/#/home',
  failureRedirect: 'https://mingmoth.github.io/shop-forum/#/signin'
}))

module.exports = router