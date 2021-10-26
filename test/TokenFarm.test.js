const DappToken = artifacts.require("DappToken")
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
.use(require("chai-as-promised"))
.should()

function tokens(n) {
    return web3.utils.toWei(n, "ether")
}

contract("TokenFarm", ([owner, investor]) => {

    let daiToken, dappToken, tokenFarm;

    before(async () => {
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        await dappToken.transfer(tokenFarm.address,tokens("1000000"))

        await daiToken.transfer(accounts[1], tokens("100"), {from: accounts[0]})
    })


    describe("Mock DAI Deployment", async () => {
        it("has a name", async () => {
          const name = await daiToken.name();
          assert.equal(name, "Mock DAI Token")
        })
    })
})