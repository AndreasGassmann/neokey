const Neon = require('@cityofzion/neon-js')

module.exports = {
  checkTokenForExistance: async function(contract, address, tokenProperty) {
    const client = new Neon.rpc.RPCClient('http://localhost:30333')

    const query = await client.invokeFunction(
      contract,
      'tokensDataOfOwner',
      Neon.sc.ContractParam.byteArray(address, 'address'),
      new Neon.sc.ContractParam('Integer', 0)
    )

    // no tokens found
    if (query.stack[0].value === '') {
      return false
    }

    // tokens found, deserialize the result
    const result = Neon.sc.StackItem.deserialize(query.stack[0].value)

    const deserialized = result.value.map(obj => {
      let responseObj = {}
      responseObj[Buffer.from(obj.key.value, 'hex').toString()] = Buffer.from(obj.value.value, 'hex').toString()
      return responseObj
    })

    return tokenProperty === deserialized.find(obj => obj['properties/\u0001'])['properties/\u0001']
  }
}
