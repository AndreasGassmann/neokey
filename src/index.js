const nodeAcl = require('acl')

function neoKey(req, res, next) {
  const acl = new nodeAcl(new nodeAcl.memoryBackend())
  console.log('LOGGED')
  next()
}

module.exports = neoKey
