import { eEthereumNetwork, IBaseConfiguration } from './types';

export const { MARKET_NAME } = process.env;

export const Configs: { [key: string]: IBaseConfiguration } = {
  [eEthereumNetwork.main]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 43200, // 12h
    PriceFeed_threshold: 100, // 1%
    PriceFeed_operator: '',
    PriceFeed_owner: '',
    HOPE_address: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
    chainlinkEthUsdAggregatorProxy: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    chainlinkBtcUsdAggregatorProxy: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
    Automation_operator: '',
    Automation_owner: '',
    Aggregator_owner: '',
    FallbackOracle_operator: '',
    FallbackOracle_owner: '',
  },
  [eEthereumNetwork.base_main]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 43200, // 12h
    PriceFeed_threshold: 100, // 1%
    PriceFeed_operator: '',
    PriceFeed_owner: '',
    HOPE_address: '',
    chainlinkEthUsdAggregatorProxy: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
    chainlinkBtcUsdAggregatorProxy: '0xCCADC697c55bbB68dc5bCdf8d3CBe83CdD4E071E',
    Automation_operator: '',
    Automation_owner: '',
    Aggregator_owner: '',
    FallbackOracle_operator: '',
    FallbackOracle_owner: '',
  },
  [eEthereumNetwork.arbi_main]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 43200, // 12h
    PriceFeed_threshold: 100, // 1%
    PriceFeed_operator: '',
    PriceFeed_owner: '',
    HOPE_address: '',
    chainlinkEthUsdAggregatorProxy: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
    chainlinkBtcUsdAggregatorProxy: '0x6ce185860a4963106506C203335A2910413708e9',
    Automation_operator: '',
    Automation_owner: '',
    Aggregator_owner: '',
    FallbackOracle_operator: '',
    FallbackOracle_owner: '',
  },
  [eEthereumNetwork.goerli]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 43200, // 12h
    PriceFeed_threshold: 100, // 1%
    PriceFeed_operator: '0x3141f8D6BE4e4d9137577798C1e127Db81D196d7',
    PriceFeed_owner: '0xc6C1eF70746F6Bed0A43C912B2B2047f25d3eA87',
    HOPE_address: '0xdC857E0d4C850deAe3a7735390243d3c444E552F',
    chainlinkEthUsdAggregatorProxy: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    chainlinkBtcUsdAggregatorProxy: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
    Automation_operator: '0x3141f8D6BE4e4d9137577798C1e127Db81D196d7',
    Automation_owner: '0xc6C1eF70746F6Bed0A43C912B2B2047f25d3eA87',
    Aggregator_owner: '0xc6C1eF70746F6Bed0A43C912B2B2047f25d3eA87',
    FallbackOracle_operator: '0x3141f8D6BE4e4d9137577798C1e127Db81D196d7',
    FallbackOracle_owner: '0xc6C1eF70746F6Bed0A43C912B2B2047f25d3eA87',
  },
  [eEthereumNetwork.arbi_goerli]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 43200, // 12h
    PriceFeed_threshold: 100, // 1%
    PriceFeed_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    PriceFeed_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    HOPE_address: '0x26100653722f1304B172f0B07e83dB60b9ef0296',
    chainlinkEthUsdAggregatorProxy: '0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08',
    chainlinkBtcUsdAggregatorProxy: '0x6550bc2301936011c1334555e62A87705A81C12C',
    Automation_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    Automation_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    Aggregator_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    FallbackOracle_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    FallbackOracle_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
  },
  [eEthereumNetwork.base_goerli]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 43200, // 12h
    PriceFeed_threshold: 100, // 1%
    PriceFeed_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    PriceFeed_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    HOPE_address: '0x26100653722f1304B172f0B07e83dB60b9ef0296',
    chainlinkEthUsdAggregatorProxy: '0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2',
    chainlinkBtcUsdAggregatorProxy: '0xAC15714c08986DACC0379193e22382736796496f',
    Automation_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    Automation_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    Aggregator_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    FallbackOracle_operator: '0x1Ee532cf775be02E0B306571e3555321FC75988d',
    FallbackOracle_owner: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
  },
  [eEthereumNetwork.sepolia]: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 14400, // 4h
    PriceFeed_threshold: 50, // 0.5%
    PriceFeed_operator: '0x22363A093C81E56b39F3551DbFa011f8A4952Da2',
    PriceFeed_owner: '0xfAabAc253c7fb43f2e3275CeBfDb34839c4eefA5',
    HOPE_address: '0x498C60F24E078efA5B34a952c5777aDa39C1bADB',
    chainlinkEthUsdAggregatorProxy: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    chainlinkBtcUsdAggregatorProxy: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
    Automation_operator: '0x22363A093C81E56b39F3551DbFa011f8A4952Da2',
    Automation_owner: '0xfAabAc253c7fb43f2e3275CeBfDb34839c4eefA5',
    Aggregator_owner: '0xfAabAc253c7fb43f2e3275CeBfDb34839c4eefA5',
    FallbackOracle_operator: '0x22363A093C81E56b39F3551DbFa011f8A4952Da2',
    FallbackOracle_owner: '0xfAabAc253c7fb43f2e3275CeBfDb34839c4eefA5',
  },
  hardhat: {
    PriceFeed_decimals: 8,
    PriceFeed_heartbeat: 3600,
    PriceFeed_threshold: 100,
    PriceFeed_operator: '',
    PriceFeed_owner: '',
    HOPE_address: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
    chainlinkEthUsdAggregatorProxy: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    chainlinkBtcUsdAggregatorProxy: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
    Automation_operator: '',
    Automation_owner: '',
    Aggregator_owner: '',
    FallbackOracle_operator: '',
    FallbackOracle_owner: '',
  },
};

export default Configs;
