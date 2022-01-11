const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000

// app.engine('handlebars', 
// exphbs.engine({ defaultLayout: 'main' }),
//   helpers: require('./config/handlebars-helpers'))
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})