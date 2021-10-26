pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm"; 
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;
    

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public{
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public {

        require(_amount > 0, "amount must be greater than 0");

        daiToken.transferFrom(msg.sender, address(this), _amount);
        //update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        //updating staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function issueToken() public{
        require(msg.sender == owner, "only the owner can call this function");
        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
                }
            }
        }

//     function withdrawTokens() public{
//         for(uint i = 0; i < stakers.length; i++){
//             if(isStaking[stakers[i]]){
//                 dappToken.transferFrom(address(this), stakers[i], stakingBalance[stakers[i]]);
//                 isStaking[stakers[i]] = false;
//     }
}