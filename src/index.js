const acl = require('acl')

export default function(req, res, next) {
  const acl = new acl(new acl.memoryBackend())
  console.log('LOGGED')
  next()
}
