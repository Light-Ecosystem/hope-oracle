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
    PriceFeed_heartbeat: 43200, // 12h
    PriceFeed_threshold: 50, // 0.5%
    PriceFeed_operator: '0x3141f8D6BE4e4d9137577798C1e127Db81D196d7',
    HOPE_address: '0x9bA97e0913Dd0fbd4E5fedA936db9D1f1C632273',
    chainlinkEthUsdAggregatorProxy: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    chainlinkBtcUsdAggregatorProxy: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
    Automation_operator: '0x3141f8D6BE4e4d9137577798C1e127Db81D196d7',
    FallbackOracle_operator: '0x3141f8D6BE4e4d9137577798C1e127Db81D196d7',
  },
  [eEthereumNetwork.sepolia]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 14400, // 4h
    PriceFeed_threshold: 50, // 0.5%
    PriceFeed_operator: '0x22363A093C81E56b39F3551DbFa011f8A4952Da2',
    HOPE_address: '0x498C60F24E078efA5B34a952c5777aDa39C1bADB',
    chainlinkEthUsdAggregatorProxy: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    chainlinkBtcUsdAggregatorProxy: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
    Automation_operator: '0x22363A093C81E56b39F3551DbFa011f8A4952Da2',
    FallbackOracle_operator: '0x22363A093C81E56b39F3551DbFa011f8A4952Da2',
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
