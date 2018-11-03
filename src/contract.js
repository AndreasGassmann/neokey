const Neon = require('@cityofzion/neon-js')

module.exports = {
  checkTokenForExistance: async function(
    contract = '0x191e1e266c93b6400017fcd3157871fa4be92945',
    address = 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',
    check = 'test'
  ) {
    const client = new Neon.rpc.RPCClient('http://localhost:30333')

    const query = await client.invokeFunction(
      contract,
      'tokensDataOfOwner',
      Neon.sc.ContractParam.byteArray(address, 'address'),
      new Neon.sc.ContractParam('Integer', 0)
    )

    const result = Neon.sc.StackItem.deserialize(query.stack[0].value)

    const deserialized = result.value.map(obj => {
      let responseObj = {}
      responseObj[Buffer.from(obj.key.value, 'hex').toString()] = Buffer.from(obj.value.value, 'hex').toString()
      return responseObj
    })

    return check === deserialized.find(obj => obj['properties/\u0001'])['properties/\u0001']
  }
}
