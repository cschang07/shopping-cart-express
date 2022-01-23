if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const cors = require('cors') //
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')

const PORT = process.env.PORT || 3000

app.engine('handlebars', handlebars.engine({ helpers: require('./config/handlebars-helpers')}))
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
//cors
app.use(cors())
//bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(express.urlencoded({ defaultLayout: 'main', extended: true }))
app.use(methodOverride('_method'))
//setup passport
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json')
  next()
})


require('./routes')(app) // 0111

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})