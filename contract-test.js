const contract = require('./src/contract')
;(async () => {
  let result = await contract.getTokensOfAddress()
  console.log(result)
})()
