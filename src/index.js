const service = require('./contract')

function neoKey(contract, tokenProperty) {
  return (req, res, next) => {
    console.log('checkTokenForExistance')
    service.checkTokenForExistance(contract, req.user.address, tokenProperty).then(result => {
      console.log('checkTokenForExistance', result)
      if (result) {
        next()
      }
      return res.sendStatus(401)
    })
  }
}

module.exports = neoKey
