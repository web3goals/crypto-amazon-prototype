// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Checkout is Ownable, ReentrancyGuard {
    struct Deal {
        string asin;
        address seller;
        address buyer;
        string buyerName;
        string buyerAddress;
        uint256 date;
        uint paymentAmount;
    }

    AggregatorV3Interface private _chainlinkDataFeed;
    int _customChainlinkDataFeedAnswer;
    IERC20 private _paymentToken;
    Deal[] private _deals;
    mapping(address seller => uint256 balance) _balances;
    mapping(address seller => uint256 sales) _sales;
    mapping(address buyer => uint256 purchases) _purchases;

    // TODO: Add customChainlinkDataFeedAnswer
    constructor(
        address chainlinkDataFeed,
        address paymentToken
    ) Ownable(msg.sender) {
        _chainlinkDataFeed = AggregatorV3Interface(chainlinkDataFeed);
        _paymentToken = IERC20(paymentToken);
    }

    /// ***************************
    /// ***** OWNER FUNCTIONS *****
    /// ***************************

    function setPaymentToken(address paymentToken) external onlyOwner {
        _paymentToken = IERC20(paymentToken);
    }

    function setChainlinkDataFeed(
        address chainlinkDataFeed
    ) external onlyOwner {
        _chainlinkDataFeed = AggregatorV3Interface(chainlinkDataFeed);
    }

    function setCustomChainlinkDataFeedAnswer(
        int customChainlinkDataFeedAnswer
    ) external onlyOwner {
        _customChainlinkDataFeedAnswer = customChainlinkDataFeedAnswer;
    }

    /// ***************************
    /// ***** USER FUNCTIONS ******
    /// ***************************

    function buyProduct(
        string memory asin,
        address seller,
        string memory buyerName,
        string memory buyerAddress,
        uint256 paymentAmount
    ) external nonReentrant {
        // Transfer tokens
        require(
            _paymentToken.transferFrom(
                msg.sender,
                address(this),
                paymentAmount
            ),
            "Failed to transfer payment to contract"
        );
        // Save deal
        Deal memory deal = Deal(
            asin,
            seller,
            msg.sender,
            buyerName,
            buyerAddress,
            block.timestamp,
            paymentAmount
        );
        _deals.push(deal);
        // Update balance
        _balances[seller] += paymentAmount;
        // Update counters
        _sales[seller] += 1;
        _purchases[msg.sender] += 1;
    }

    function withdrawBalance() external nonReentrant {
        require(_balances[msg.sender] > 0, "Balance is zero");
        // Transfer tokens
        require(
            _paymentToken.transfer(msg.sender, _balances[msg.sender]),
            "Failed to transfer balance to caller"
        );
        // Update seller balance
        _balances[msg.sender] = 0;
    }

    /// ***************************
    /// ***** VIEW FUNCTIONS ******
    /// ***************************

    function getSales(address seller) external view returns (Deal[] memory) {
        Deal[] memory deals = new Deal[](_sales[seller]);
        uint index = 0;
        for (uint256 i = 0; i < _deals.length; i++) {
            if (_deals[i].seller == seller) {
                deals[index] = _deals[i];
                index += 1;
            }
        }
        return deals;
    }

    function getPurchases(address buyer) external view returns (Deal[] memory) {
        Deal[] memory deals = new Deal[](_purchases[buyer]);
        uint index = 0;
        for (uint256 i = 0; i < _deals.length; i++) {
            if (_deals[i].buyer == buyer) {
                deals[index] = _deals[i];
                index += 1;
            }
        }
        return deals;
    }

    function getBalance(address seller) external view returns (uint) {
        return _balances[seller];
    }

    function getPaymentToken() external view returns (address) {
        return address(_paymentToken);
    }

    function getChainlinkDataFeedAnswer() external view returns (int) {
        if (address(_chainlinkDataFeed) == address(0)) {
            return _customChainlinkDataFeedAnswer;
        }
        (, int answer, , , ) = _chainlinkDataFeed.latestRoundData();
        return answer;
    }
}
