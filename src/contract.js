const Neon = require('@cityofzion/neon-js')

module.exports = {
  getTokensOfAddress: async function() {
    // call contract and get list of tokens
    const param1 = new Neon.sc.ContractParam('String', 'tokensDataOfOwner')
    const param2 = Neon.sc.ContractParam.byteArray('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', 'address')
    const param3 = new Neon.sc.ContractParam('Integer', 0)

    const client = new Neon.rpc.RPCClient('http://localhost:30333')

    const query = await client.invoke('0x1df02e9a393ef97c4e216b2a68c69052c9d000e0', param1, Neon.sc.ContractParam.array(param2), param3)

    console.log(query)

    //sb.emitAppCall('0x1df02e9a393ef97c4e216b2a68c69052c9d000e0', 'tokensDataOfOwner', 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', 0)
    //const result = await rpc.Query.invokeScript(sb.str).execute('http://localhost:10332')
    //console.log(result)
  }
}
