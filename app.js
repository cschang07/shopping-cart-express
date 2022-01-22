const express = require('express')
const app = express()

const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')

const PORT = process.env.PORT || 3000

app.engine('handlebars', handlebars.engine({ helpers: require('./config/handlebars-helpers')}))
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// app.use(express.urlencoded({ defaultLayout: 'main', extended: true }))
app.use(methodOverride('_method'))

//setup passport
app.use(passport.initialize())
app.use(passport.session())




require('./routes')(app) // 0111

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})