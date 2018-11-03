const neoKey = require('../src')
const express = require('express')
const app = express()
const passport = require('passport')
const PassportNeo = require('passport-neo')
const bodyParser = require('body-parser')
const cors = require('cors')

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

var session = require('express-session')
var FileStore = require('session-file-store')(session)

app.use(
  session({
    store: new FileStore({}),
    secret: 'test'
  })
)

app.use(cors({ credentials: true }))
app.use(bodyParser.json())
app.use(express.static('neokey/dist'))

app.use((res, req, next) => {
  console.log('got new request')
  console.log('path', res.path)
  console.log('method', res.method)
  next()
})

app.use(passport.initialize()) // Used to initialize passport
app.use(passport.session()) // Used to persist login sessions
app.use((res, req, next) => {
  console.log('q')
  next()
})

const onAuth = ({ challengeId, address }, done) => {
  console.log(challengeId, address)
  if (!challengeId === 'test') {
    done(new Error('User did not sign the right challenge.'))
  }
  done(null, { id: 'test-user', address })
}

const NeoStrategy = new PassportNeo(onAuth)

passport.use(NeoStrategy)

app.use((res, req, next) => {
  console.log('dd')
  next()
})

app.post('/login', passport.authenticate('neo'), (req, res) => {
  return res.sendStatus(200)
})

function isUserAuthenticated(req, res, next) {
  if (req.user) {
    console.log('is authenticated')
    next()
  } else {
    res.sendStatus(401)
  }
}

app.get('/secret', isUserAuthenticated, neoKey, (req, res) => {
  return res.status(200).json({
    secret: `Hello NEO user with ${req.user.address} address!`
  })
})

app.listen(3000)
