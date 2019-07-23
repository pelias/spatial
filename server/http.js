/**
  The http server improves performance on multicore machines by using the
  node core 'cluster' module to fork worker processes.

  The default setting is to use all available CPUs, this will spawn 32 child
  processes on a 32 core machine.

  If you would like to disable this feature (maybe because you are running
  inside a container) then you can do so by setting the env var CPUS=1

  You may also specify exactly how many child processes you would like to
  spawn by setting the env var to a numeric value >1, eg CPUS=4

  If the CPUS env var is set less than 1 or greater than os.cpus().length
  then the default setting will be used (using all available cores).
**/

const _ = require('lodash')
const os = require('os')
const morgan = require('morgan')
const express = require('express')
const cluster = require('cluster')
const through = require('through2')
const handlebars = require('express-handlebars')
const helpers = require('handlebars-helpers')()
const QueryService = require('../service/QueryService')
const logger = require('pelias-logger').get('geometry')

// select the amount of cpus we will use
const envCpus = parseInt(process.env.CPUS, 10)
const cpus = Math.min(Math.max(envCpus || Infinity, 1), os.cpus().length)

// optionally override port/host using env var
var PORT = process.env.PORT || 3000
var HOST = process.env.HOST || undefined
var app = express()

function log () {
  morgan.token('url', req => {
    // if there's a DNT header, just return '/' as the URL
    if (['DNT', 'dnt', 'do_not_track'].some(header => _.has(req.headers, header))) {
      return _.get(req, 'route.path')
    } else {
      return req.originalUrl
    }
  })

  // 'short' format includes response time but leaves out date
  return morgan('short', {
    stream: through(function write (ln, _, next) {
      logger.info(ln.toString().trim())
      next()
    })
  })
}

// make sure that logging is the first thing that happens for all endpoints
app.use(log())

// view engine setup
app.set('views', `${__dirname}/demo/views/`)
app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultView: 'default',
  helpers: helpers
}))
app.set('view engine', '.hbs')

// init service
const service = new QueryService({
  readonly: true,
  filename: process.argv[2] || 'geo.db'
})

// store $service on app
app.locals.service = service

// generic http headers
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.header('Charset', 'utf8')
    if (req.url.startsWith('/explore')) {
      // demo pages
      res.header('Cache-Control', 'public, max-age=3600') // 1 hour
    } else {
      // api endpoints
      res.header('Cache-Control', 'public, max-age=7200') // 2 hours
    }
    next()
  })
}

// routes
app.get('/place/:source/:id', require('./routes/place'))
app.get('/place/:source/:id/geometry', require('./routes/geometry').all)
app.get('/place/:source/:id/geometry/:role', require('./routes/geometry').one)
app.get('/place/:source/:id/relationship/intersects', require('./routes/relationship').intersects)
app.get('/place/:source/:id/relationship/contains', require('./routes/relationship').contains)
app.get('/place/:source/:id/relationship/within', require('./routes/relationship').within)
app.get('/place/:source/:id/property', require('./routes/property'))
app.get('/place/:source/:id/name', require('./routes/name'))
app.get('/place/:source/:id/hierarchy', require('./routes/hierarchy'))
app.get('/query/pip', require('./routes/pip'))
app.get('/query/pip/_view/pelias/:lon/:lat', require('./routes/pip_pelias'))
app.get('/query/search', require('./routes/search'))
app.get('/ontology', require('./routes/ontology'))
app.get('/ontology/:class', require('./routes/ontology'))
app.get('/ontology/:class/:type', require('./routes/ontology'))

// demo pages
app.use('/explore', express.static(`${__dirname}/demo`))
app.get('/explore/place/:source/:id', require('./routes/demo').place)
app.get('/explore/pip', require('./routes/demo').pip)
app.get('/explore/ontology', require('./routes/demo').ontology.enumerate)
app.get('/explore/ontology/:class/:type', require('./routes/demo').ontology.search)
app.use('/', (req, res) => { res.redirect('/explore/pip') })

// handle SIGTERM (required for fast docker restarts)
process.on('SIGTERM', () => { app.close() })

// start multi-threaded server
if (cpus > 1) {
  if (cluster.isMaster) {
    console.error('[master] using %d cpus', cpus)

    // worker exit event
    cluster.on('exit', worker => {
      console.error('[master] worker died', worker.process.pid)
    })

    // worker fork event
    cluster.on('fork', worker => {
      console.error('[master] worker forked', worker.process.pid)
    })

    // fork workers
    for (var c = 0; c < cpus; c++) {
      cluster.fork()
    }
  } else {
    app.listen(PORT, HOST, () => {
      console.error('[worker %d] listening on %s:%s', process.pid, HOST || '0.0.0.0', PORT)
    })
  }

  // start single-threaded server
} else {
  console.error('[master] using %d cpus', cpus)

  app.listen(PORT, HOST, () => {
    console.log('[master] listening on %s:%s', HOST || '0.0.0.0', PORT)
  })
}
