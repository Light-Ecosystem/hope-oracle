import { string } from 'hardhat/internal/core/params/argumentTypes';
import { eEthereumNetwork } from './types';

export const { MARKET_NAME } = process.env;

export const HOPEPriceDecimal: Record<string, number> = {
  [eEthereumNetwork.main]: 8,
  [eEthereumNetwork.goerli]: 8,
  [eEthereumNetwork.sepolia]: 8,
  hardhat: 8,
};

export const HOPEPriceHeartbeat: Record<string, number> = {
  [eEthereumNetwork.main]: 3600,
  [eEthereumNetwork.goerli]: 3600,
  [eEthereumNetwork.sepolia]: 3600,
  hardhat: 3600,
};

export const HOPEPriceThreshold: Record<string, number> = {
  [eEthereumNetwork.main]: 100,
  [eEthereumNetwork.goerli]: 100,
  [eEthereumNetwork.sepolia]: 100,
  hardhat: 100,
};

export const HOPEAddress: Record<string, string> = {
  [eEthereumNetwork.main]: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
  [eEthereumNetwork.goerli]: '0x12843dFa0eaf7017de47cD46218618B0991E238e',
  [eEthereumNetwork.sepolia]: '0x784388A036cb9c8c680002F43354E856f816F844',
  hardhat: '0xD5C33721220Bc75f0BBD970E64D5807350DEB3C5',
};

export const chainlinkEthUsdAggregatorProxy: Record<string, string> = {
  [eEthereumNetwork.main]: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
  [eEthereumNetwork.goerli]: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
  [eEthereumNetwork.sepolia]: '0xb8eDE1c9cE926117D5e0D82b6B0e03cf5fC26d60',
  hardhat: '0xD5C33721220Bc75f0BBD970E64D5807350DEB3C5',
};

export const chainlinkBtcUsdAggregatorProxy: Record<string, string> = {
  [eEthereumNetwork.main]: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
  [eEthereumNetwork.goerli]: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
  [eEthereumNetwork.sepolia]: '0xd981d04700477a58d3e83F6A025f881B156Ba20e',
  hardhat: '0xD5C33721220Bc75f0BBD970E64D5807350DEB3C5',
};

export const HOPEPriceFeed_Operator: Record<string, string> = {
  [eEthereumNetwork.main]: '',
  [eEthereumNetwork.goerli]: '',
  [eEthereumNetwork.sepolia]: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
};

export const HopeAutomation_Operator: Record<string, string> = {
  [eEthereumNetwork.main]: '',
  [eEthereumNetwork.goerli]: '',
  [eEthereumNetwork.sepolia]: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
};

export const HopeFallbackOracle_Operator: Record<string, string> = {
  [eEthereumNetwork.main]: '',
  [eEthereumNetwork.goerli]: '',
  [eEthereumNetwork.sepolia]: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
};
