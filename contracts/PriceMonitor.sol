// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceMonitor is AutomationCompatibleInterface {
    AggregatorV3Interface public priceFeed;
    uint256 public lastPrice;
    uint256 public threshold;
    uint256 public lastUpdatedAt;

    event PriceUpdated(int256 newPrice, uint256 timestamp);
    event ThresholdUpdated(uint256 newThreshold);

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function updatePrice() public {
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        lastPrice = uint256(price);
        lastUpdatedAt = updatedAt;
        emit PriceUpdated(price, updatedAt);
    }

    function setThreshold(uint256 _threshold) public {
        threshold = _threshold;
        emit ThresholdUpdated(_threshold);
    }

    function isThresholdBreached() public view returns (bool) {
        return lastPrice < threshold;
    }

    // --- Chainlink Automation ---

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        upkeepNeeded = uint256(price) != lastPrice && updatedAt > lastUpdatedAt;
        performData = "";
        return (upkeepNeeded, performData);
    }


    function performUpkeep(bytes calldata) external override {
        updatePrice();
    }
}
