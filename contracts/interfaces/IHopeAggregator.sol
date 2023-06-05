// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

interface IHopeAggregator {
    function transmit(uint256 _answer) external;
}