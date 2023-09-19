// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.17;

import {HopeOneRole} from '../access/HopeOneRole.sol';
import {IHOPEPriceFeed} from '../interfaces/IHOPEPriceFeed.sol';
import {IAggregatorInterface} from '../interfaces/IAggregatorInterface.sol';

contract HopeAggregatorL2 is HopeOneRole, IAggregatorInterface {
  uint256 public constant override version = 1;
  IHOPEPriceFeed public feed;
  uint8 public immutable override decimals;
  string public override description; // 'HOPE/USD'

  event FeedUpdated(address feed, uint256 timestamp, address operator);

  constructor(address _feed, uint8 _decimals, string memory _description) {
    feed = IHOPEPriceFeed(_feed);
    decimals = _decimals;
    description = _description;
  }

  function setFeed(address _feed) external onlyRole(OPERATOR_ROLE) {
    require(_feed != address(0), 'HopeAggregatorL2: Invalid feed address');
    feed = IHOPEPriceFeed(_feed);
    emit FeedUpdated(_feed, block.timestamp, msg.sender);
  }

  function latestAnswer() external view override returns (int256) {
    return _getAnswer();
  }

  function _getAnswer() internal view returns (int256) {
    uint256 answer = feed.latestAnswer();
    return int256(answer);
  }
}
