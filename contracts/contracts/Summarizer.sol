// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOracle.sol";

contract Summarizer is Ownable {
    struct ChatRun {
        address owner;
        IOracle.Message[] messages;
        uint messagesCount;
    }

    event OracleAddressUpdated(address indexed newOracleAddress);
    event ChatCreated(address indexed owner, uint indexed chatId);

    mapping(string asin => uint chatRunId) public asinChatRuns;
    mapping(uint => ChatRun) public chatRuns;
    uint public chatRunsCount;
    address public oracleAddress;
    string public prompt;

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    constructor(
        address initialOracleAddress,
        string memory initialPrompt
    ) Ownable(msg.sender) {
        oracleAddress = initialOracleAddress;
        prompt = initialPrompt;
    }

    /// ***************************
    /// ***** OWNER FUNCTIONS *****
    /// ***************************

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function setPrompt(string memory newPrompt) public onlyOwner {
        prompt = newPrompt;
    }

    /// ***************************
    /// ***** USER FUNCTIONS ******
    /// ***************************

    function createSummary(string memory asin, string memory reviews) public {
        // Update counter
        uint currentChatRunId = chatRunsCount + 1;
        chatRunsCount++;
        // Define message
        string memory messageContent = string.concat(prompt, reviews);
        IOracle.Message memory message = createTextMessage(
            "user",
            messageContent
        );
        // Create chat run
        ChatRun storage run = chatRuns[currentChatRunId];
        run.owner = msg.sender;
        run.messages.push(message);
        run.messagesCount = 1;
        // Send request
        IOracle(oracleAddress).createLlmCall(currentChatRunId);
        // Save chat run to asin
        asinChatRuns[asin] = currentChatRunId;
        // Emit event
        emit ChatCreated(msg.sender, currentChatRunId);
    }

    /// *****************************
    /// ***** ORACLE FUNCTIONS ******
    /// *****************************

    function onOracleLlmResponse(
        uint runId,
        string memory response,
        string memory
    ) public onlyOracle {
        ChatRun storage run = chatRuns[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked("user")),
            "No message to respond to"
        );
        IOracle.Message memory message = createTextMessage(
            "assistant",
            response
        );
        run.messages.push(message);
        run.messagesCount++;
    }

    /// ***************************
    /// ***** VIEW FUNCTIONS ******
    /// ***************************

    // @dev This function is required for Oracle
    function getMessageHistory(
        uint chatId
    ) public view returns (IOracle.Message[] memory) {
        return chatRuns[chatId].messages;
    }

    function getSummary(
        string memory asin
    ) public view returns (string memory) {
        uint runId = asinChatRuns[asin];
        ChatRun storage run = chatRuns[runId];
        if (run.messagesCount == 2) {
            return run.messages[1].content[0].value;
        }
        return "";
    }

    /// *******************************
    /// ***** INTERNAL FUNCTIONS ******
    /// *******************************

    function createTextMessage(
        string memory role,
        string memory content
    ) private pure returns (IOracle.Message memory) {
        IOracle.Message memory newMessage = IOracle.Message({
            role: role,
            content: new IOracle.Content[](1)
        });
        newMessage.content[0].contentType = "text";
        newMessage.content[0].value = content;
        return newMessage;
    }
}
