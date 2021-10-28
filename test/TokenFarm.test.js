const { assert } = require("chai");

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

        await daiToken.transfer(investor, tokens("100"), {from: owner})
    })


    describe("Mock DAI Deployment", async () => {
        it("has a name", async () => {
          const name = await daiToken.name();
          assert.equal(name, "Mock DAI Token")
        })
    })

    describe("Dapp Token Deployment", async () => {
        it("has a name", async () => {
          const name = await dappToken.name();
          assert.equal(name, "WOLFGANG Token")
        })
    })

    describe("Token Farm Deployment", async () => {
        it("has a name", async () => {
          const name = await tokenFarm.name();
          assert.equal(name, "Dapp Token Farm")
        })
    })

    it("contract has tokens", async () => {
        let balance = await dappToken.balanceOf(tokenFarm.address)
        assert.equal(balance.toString(), tokens("1000000"))
    })

    describe("Farming tokens", async () => {
        it("Rewards investors for staking mDai tokens", async () => {
            let result 
            
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("100"), "investor Mock Dai wallet balance correct before staking")

            //stake mock dai tokens
            await daiToken.approve(tokenFarm.address, tokens("100"), {from: investor})
            await tokenFarm.stakeTokens(tokens("100"), {from: investor})

            //check staking result
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("0"), "investor Mock Dai wallet balance correct after staking")

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens("100"), "Token Farm Mock Dai balance correct after staking")
            
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens("100"), "investor staking balance correct after staking")

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), "true", "investor staking status correct after staking")

            await tokenFarm.issueTokens({from: owner})

            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("100"), "investor DApp wallet balance correct after issuance")

            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            //unstake mock dai tokens
            await tokenFarm.unstakeTokens({from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("100"), "investor Mock Dai wallet balance correct after unstaking")

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens("0"), "Token Farm Mock DAI balance correct after unstaking")

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens("0"), "investor staking balance correct after unstaking")

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), "false", "investor staking balance correct after unstaking")
        })
    })
})