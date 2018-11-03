const neoKey = require('../src')
const express = require('express')
const app = express()
const passport = require('passport')
const PassportNeo = require('passport-neo')
const bodyParser = require('body-parser')

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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('neokey/dist'))

app.use((res, req, next) => {
  console.log('got new request')
  console.log('path', res.path)
  console.log('method', res.method)
  next()
})
app.use(neoKey)
app.use(passport.initialize()) // Used to initialize passport
app.use(passport.session()) // Used to persist login sessions
app.use((res, req, next) => {
  console.log('q')
  next()
})
const onAuth = ({ challengeId, address }, done) => {
  if (!challengeId === 'test') {
    done(new Error('User did not sign the right challenge.'))
  }
  done(null, { id: 'test-user', address })
}

const NeoStrategy = new PassportNeo(onAuth)

passport.use(NeoStrategy)

app.get('/login', (req, res) => {
  res.send(`<html><head>
  <script>
/*
  $.ajax({
    url: 'http://localhost:3000/login',
    type: 'POST',
    data: JSON.stringify({
      address: 'test'
    }),
    contentType: 'application/json',
    success: function(res) {
      return alert("res: " + res);
    }
  });*/
  </script>
  </head>
  <form action="/login" method="post">
  <input name="challengeId" placeholder="challengeId" /><br />
  <input name="signature" placeholder="signature" /><br />
  <input name="publickey" placeholder="publickey" /><br />
  <button type="submit">Submit</button>
  </form>
  </html>`)
})

app.use((res, req, next) => {
  console.log('dd')
  next()
})
app.post('/login', passport.authenticate('neo'))

app.use((res, req, next) => {
  console.log('dasdfd')
  next()
})
/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})
*/
function isUserAuthenticated(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.send('You must login!')
  }
}

app.get('/secret', isUserAuthenticated, (req, res) => {
  res.send(`Hello NEO user with ${req.user.address} address!`)
})

app.listen(3000)
