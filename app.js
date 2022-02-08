if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const path = require('path');
const session = require('express-session')

const PORT = process.env.PORT || 3000

const app = express()

// app.engine('handlebars', handlebars.engine({ helpers: require('./config/handlebars-helpers') }))
// app.set('view engine', 'handlebars')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// view engine setup
app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}));


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
  // name: 'MyCoolWebAppCookieName', // This needs to be unique per-host.
  cookie: {
    httpOnly: false
  }
}))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'https://mingmoth.github.io/shop-forum');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://mingmoth.github.io/shop-forum')
//   res.header('Access-Control-Allow-Credentials', true)
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
//   res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json')
//   next()
// })

require('./routes')(app) // 0111

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})