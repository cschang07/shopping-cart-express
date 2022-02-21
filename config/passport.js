const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const db = require('../models')
const ExtractJwt = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
const JwtStrategy = passportJWT.Strategy
const User = db.User

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy_JWT = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: db.Order
    
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: db.Order
  }).then((user) => {
    console.log(user) // 暫時添加
    user = user.toJSON();

    return cb(null, user);
  });
})

let strategy_FACEBOOK = new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile)
})

passport.use(strategy_JWT)
passport.use(strategy_FACEBOOK)

module.exports = passport