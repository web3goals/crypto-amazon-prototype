// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// TODO: Add list with purchases for buyers
contract Checkout is Ownable, ReentrancyGuard {
    struct Sale {
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
    mapping(string asin => Sale[] sales) _sales;
    mapping(address seller => uint256 balance) _balances;

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
        // Save sale
        Sale memory sale = Sale(
            asin,
            seller,
            msg.sender,
            buyerName,
            buyerAddress,
            block.timestamp,
            paymentAmount
        );
        _sales[asin].push(sale);
        // Update seller balance
        _balances[seller] += paymentAmount;
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

    function getSales(
        string memory asin
    ) external view returns (Sale[] memory) {
        return _sales[asin];
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
