const contract = require('./contract')

function neoKey(req, res, next) {
  console.log('checkTokenForExistance')
  contract.checkTokenForExistance(null, req.user.address, 'test').then(result => {
    console.log('checkTokenForExistance', result)
    if (result) {
      next()
    }
    return res.sendStatus(401)
  })
}

module.exports = neoKey
