const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const db = require('../models')
const User = db.User

const FacebookStrategy = require('passport-facebook').Strategy
const FacebookTokenStrategy = require('passport-facebook-token')

const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

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

let strategy_FACEBOOK = 
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'displayName', 'email', 'photos', 'gender']
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ where: { email: profile._json.email } })
      .then(user => {
        console.log(profile._json.picture.data)
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name: profile.displayName,
            email: profile._json.email,
            password: hash,
            phone_number: null,
            location: '',
            gender: profile.gender || undefined,
            birthday: null,
            avatar: profile._json.picture.data.url,
            DistrictId: undefined
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  })

// passport.use('facebookToken', new FacebookTokenStrategy(
//   {
//     clientID: process.env.FACEBOOK_ID,
//     clientSecret: process.env.FACEBOOK_SECRET,
//   },
//   async (accessToken, refreshToken, profile, done, res) => {
//     console.log('inside facebook strategy')
//     //log to view the profile email
//     console.log(`profile email: ${profile.emails[0].value}`)
//     console.log(accessToken)
//     console.log(refreshToken)
//     console.log(profile)

//     //check if there is a existing user in database either
//     //with the user email or corresponding facebookid
//     const existingUser = await User.findOne({
//       where: {
//         [Sequelize.Op.or]: [
//           {email: { [Sequelize.Op.eq]: profile.emails[0].value} },
//           {facebookId: { [Sequelize.Op.eq]: profile.id } }
//         ]
//       },
//       attributes: ['id', 'email', 'facebookid']
//     });
//     //if user exists, then return the existing user
//     if (existingUser) {
//       return done(null, existingUser);
//     }

//     //if user does not exist, then create a new record in database
//     //with user email and facebook id.
//     const newUser = await User.create({
//       email: profile.emails[0].value,
//       facebookId: profile.id !== null ? profile.id : null,
//     });

//     if (typeof newUser !== 'undefined' && newUser !== null) {
//       console.log('record inserted successfully');
//       done(null, newUser)
//     }
//   }
// ))

passport.use(strategy_JWT)
passport.use(strategy_FACEBOOK)

module.exports = passport