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
    PriceFeed_threshold: 50, // 0.5%
    PriceFeed_operator: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    HOPE_address: '0x70C8C67CfbE228c7437Ec586a751a408e23355F4',
    chainlinkEthUsdAggregatorProxy: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    chainlinkBtcUsdAggregatorProxy: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
    Automation_operator: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    FallbackOracle_operator: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
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
