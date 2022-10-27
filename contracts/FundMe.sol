// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;
import "./PriceConverter.sol";

error FundMe_NotOwner();

/** @title A  contract for crowd funding
 *  @author liujingze
 *  @notice
 *  @dev this implements
 *
 */
contract FundMe {
    //Type
    using PriceConverter for uint256;

    // Sate variables
    uint256 public constant MINMUM_USD = 10;

    address immutable i_owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    address[] public fonder;
    mapping(address => uint256) public founderList;

    function fund() public payable {
        // set a minimm fund
        // number=5;

        require(
            msg.value.getETHconversion(priceFeed) > MINMUM_USD,
            "Didn't send enoug ETH"
        );
        fonder.push(msg.sender);

        founderList[msg.sender] += msg.value;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    modifier onlyOwer() {
        // 节约gas
        if (msg.sender != i_owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    function withdraw() public onlyOwer {
        for (
            uint256 founderindex = 0;
            founderindex < fonder.length;
            founderindex++
        ) {
            address founderAddress = fonder[founderindex];

            founderList[founderAddress] = 0;
        }

        fonder = new address[](0);

        //transfer

        // payable(msg.sender).transfer(address(this).balance);
        // bool sendSucuss = payable(msg.sender).send(address(this).balance);
        // require(sendSucuss,"send failed");
        (bool callSucuss, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucuss, "call failed");
    }

        
}
