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

app.get('/api/authenticated', isUserAuthenticated, (req, res) => {
  console.log('is authenticated!')
  return res.sendStatus(200)
})

app.post('/api/login', passport.authenticate('neo'), (req, res) => {
  return res.status(200).json({
    address: req.user.address
  })
})

app.get('/api/logout', (req, res) => {
  req.logout()
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

app.get('/api/secret', isUserAuthenticated, neoKey('0x191e1e266c93b6400017fcd3157871fa4be92945', 'test'), (req, res) => {
  return res.status(200).json({
    secret: `Hello NEO user with ${req.user.address} address!`
  })
})

app.get('/api/doors', isUserAuthenticated, neoKey('0x191e1e266c93b6400017fcd3157871fa4be92945', 'test'), (req, res) => {
  const doors = [
    {
      id: 'FB181-00',
      name: 'Förrlibuckstrasse 181 - Main Entrance'
    },
    {
      id: 'FB181-01',
      name: 'Förrlibuckstrasse 181 - 1. Floor Entrance'
    },
    {
      id: 'FB181-02',
      name: 'Förrlibuckstrasse 181 - 2. Floor Entrance'
    },
    {
      id: 'FB181-03',
      name: 'Förrlibuckstrasse 181 - 3. Floor Entrance'
    },
    {
      id: 'FB181-04',
      name: 'Förrlibuckstrasse 181 - 4. Floor Entrance'
    },
    {
      id: 'PW51-00',
      name: 'Pfingstweidstrasse 51 - Main Entrance'
    },
    {
      id: 'PW51-01',
      name: 'Pfingstweidstrasse 51 - 1. Floor Entrance'
    },
    {
      id: 'PW51-02',
      name: 'Pfingstweidstrasse 51 - 2. Floor Entrance'
    }
  ]
  return res.status(200).json(
    doors.map(obj => {
      obj.allowed = req.tokens.find(token => token === obj.id) ? true : false
      return obj
    })
  )
})

app.listen(3000)
