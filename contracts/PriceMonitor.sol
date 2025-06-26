// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceMonitor {
    AggregatorV3Interface public priceFeed;
    uint256 public lastPrice;
    uint256 public threshold;

    event PriceUpdated(int256 newPrice, uint256 timestamp);
    event ThresholdUpdated(uint256 newThreshold);

    constructor(address _priceFeed, uint256 _initialThreshold) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        threshold = _initialThreshold;
    }

    function updatePrice() public {
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        lastPrice = uint256(price);
        emit PriceUpdated(price, updatedAt);
    }

    function setThreshold(uint256 _threshold) public {
        threshold = _threshold;
        emit ThresholdUpdated(_threshold);
    }

    function isThresholdBreached() public view returns (bool) {
        return lastPrice < threshold;
    }
}
