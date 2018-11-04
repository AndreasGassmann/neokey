const service = require('./contract')

function neoKey(contract, tokenProperty) {
  return (req, res, next) => {
    service.checkTokenForExistance(contract, req.user.address, tokenProperty).then(result => {
      req.tokens = []
      if (result.length > 0) {
        req.tokens = result
      }
      return next()
    })
  }
}

module.exports = neoKey
