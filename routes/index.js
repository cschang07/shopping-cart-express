let routes = require('./routes');
let apis = require('./apis')
let auth = require('./auth')

module.exports = (app) => {
  app.use('/', routes);
  app.use('/api', apis)
  app.use('/auth', auth)
}