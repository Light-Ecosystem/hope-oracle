import { eEthereumNetwork, IBaseConfiguration } from './types';

export const { MARKET_NAME } = process.env;

export const Configs: { [key: string]: IBaseConfiguration } = {
  [eEthereumNetwork.main]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 3600,
    PriceFeed_threshold: 100,
    PriceFeed_operator: '',
    HOPE_address: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
    chainlinkEthUsdAggregatorProxy: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    chainlinkBtcUsdAggregatorProxy: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
    Automation_operator: '',
    FallbackOracle_operator: '',
  },
  [eEthereumNetwork.goerli]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 3600,
    PriceFeed_threshold: 100,
    PriceFeed_operator: '',
    HOPE_address: '0x12843dFa0eaf7017de47cD46218618B0991E238e',
    chainlinkEthUsdAggregatorProxy: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    chainlinkBtcUsdAggregatorProxy: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
    Automation_operator: '',
    FallbackOracle_operator: '',
  },
  [eEthereumNetwork.sepolia]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 3600,
    PriceFeed_threshold: 100,
    PriceFeed_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    HOPE_address: '0x784388A036cb9c8c680002F43354E856f816F844',
    chainlinkEthUsdAggregatorProxy: '0xb8eDE1c9cE926117D5e0D82b6B0e03cf5fC26d60',
    chainlinkBtcUsdAggregatorProxy: '0xd981d04700477a58d3e83F6A025f881B156Ba20e',
    Automation_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    FallbackOracle_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
  },
  hardhat: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 3600,
    PriceFeed_threshold: 100,
    PriceFeed_operator: '',
    HOPE_address: '0xD5C33721220Bc75f0BBD970E64D5807350DEB3C5',
    chainlinkEthUsdAggregatorProxy: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    chainlinkBtcUsdAggregatorProxy: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
    Automation_operator: '',
    FallbackOracle_operator: '',
  },
};

export default Configs;
