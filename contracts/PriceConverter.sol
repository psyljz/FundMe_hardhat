// SPDX-License-Identifier:MIT

// 声明编译器版本
//  ^ 
// 

// 从npm中导入包
// @chainlink

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
pragma solidity ^0.8.7;

library PriceConverter{

     function getLatestPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {

     
            
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();

        return uint256(price)*1E10;
    }

    function getETHconversion(uint256 ETHamount ,AggregatorV3Interface priceFeed)internal view returns(uint256){
        
 
        uint amount = ETHamount*getLatestPrice(priceFeed) /1E18;

        return amount /1E18;


    }


}