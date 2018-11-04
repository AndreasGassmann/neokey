const Neon = require('@cityofzion/neon-js')

module.exports = {
  async makeQuery(contract, address, offset) {
    const client = new Neon.rpc.RPCClient('http://localhost:30333')

    const query = await client.invokeFunction(
      contract,
      'tokensDataOfOwner',
      Neon.sc.ContractParam.byteArray(address, 'address'),
      new Neon.sc.ContractParam('Integer', offset)
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

    const propertyList = deserialized.filter(obj => obj[Object.keys(obj).find(prop => prop.startsWith('properties'))])
    return propertyList.map(obj => obj[Object.keys(obj)[0]])
  },
  checkTokenForExistance: async function(contract, address, tokenProperty) {
    const client = new Neon.rpc.RPCClient('http://localhost:30333')
    const balanceOf = await client.invokeFunction(contract, 'balanceOf', Neon.sc.ContractParam.byteArray(address, 'address'))

    const tokenCount = parseInt(balanceOf.stack[0].value, 16)

    const list = []

    for (let i = 0; i < tokenCount; i = i + 4) {
      let tokens = await this.makeQuery(contract, address, i)
      console.log(tokens)
      list.push(...tokens)
    }

    console.log(list)

    return list
  }
}
