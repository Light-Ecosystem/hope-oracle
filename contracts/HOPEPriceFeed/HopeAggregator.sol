// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import {Ownable2Step} from '../dependencies/openzeppelin/Ownable2Step.sol';
import {AggregatorV2V3Interface} from '../dependencies/chainlink/AggregatorV2V3Interface.sol';
import {IHopeAggregator} from '../interfaces/IHopeAggregator.sol';

contract HopeAggregator is Ownable2Step, IHopeAggregator, AggregatorV2V3Interface {
  uint256 public constant override version = 1;
  uint8 public immutable override decimals;
  string public override description; // 'HOPE/USD'
  address public transmitter;
  uint80 internal roundId;

  struct Transmission {
    int192 answer; // 192 bits ought to be enough for anyone
    uint64 timestamp;
  }
  mapping(uint80 /* aggregator round ID */ => Transmission) internal transmissions;

  event TransmitterUpdated(address newTransmitter);

  modifier isTransmitter() {
    require(msg.sender == transmitter, 'HopeAggregator: caller is not the transmitter');
    _;
  }

  constructor(uint8 _decimals, string memory _description) {
    decimals = _decimals;
    description = _description;
  }

  function updateTransmitter(address newTransmitter) external onlyOwner {
    transmitter = newTransmitter;
    emit TransmitterUpdated(newTransmitter);
  }

  function transmit(uint256 _answer) external override isTransmitter {
    roundId++;
    int192 currentPrice = int192(int256(_answer));
    transmissions[roundId] = Transmission(currentPrice, uint64(block.timestamp));
    emit AnswerUpdated(currentPrice, roundId, uint64(block.timestamp));
  }

  function latestAnswer() external view override returns (int256) {
    return transmissions[roundId].answer;
  }

  function latestTimestamp() external view override returns (uint256) {
    return transmissions[roundId].timestamp;
  }

  function latestRound() external view override returns (uint256) {
    return roundId;
  }

  function getAnswer(uint256 _roundId) external view override returns (int256) {
    return transmissions[uint80(_roundId)].answer;
  }

  function getTimestamp(uint256 _roundId) external view override returns (uint256) {
    return transmissions[uint80(_roundId)].timestamp;
  }

  function getRoundData(uint80 _roundId) external view override returns (uint80, int256, uint256, uint256, uint80) {
    Transmission memory transmission = transmissions[_roundId];
    return (_roundId, transmission.answer, transmission.timestamp, transmission.timestamp, _roundId);
  }

  function latestRoundData() external view override returns (uint80, int256, uint256, uint256, uint80) {
    Transmission memory transmission = transmissions[roundId];
    return (roundId, transmission.answer, transmission.timestamp, transmission.timestamp, roundId);
  }
}
