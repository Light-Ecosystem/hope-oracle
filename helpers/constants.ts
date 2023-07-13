import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { eEthereumNetwork, iParamsPerNetwork, SymbolMap, tEthereumAddress, ITokenAddress } from './types';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { MARKET_NAME } from './configs';
declare var hre: HardhatRuntimeEnvironment;

export const DEFAULT_NAMED_ACCOUNTS = {
  deployer: {
    default: 0,
  },
  operator: {
    default: 1,
  },
};

export const MOCK_CHAINLINK_AGGREGATORS_PRICES: { [key: string]: string } = {
  HOPE: parseUnits('0.7', 8).toString(),
  stHOPE: parseUnits('0.7', 8).toString(),
  WETH: parseUnits('2001', 8).toString(),
  ETH: parseUnits('2001', 8).toString(),
  DAI: parseUnits('1.001', 8).toString(),
  USDC: parseUnits('1.001', 8).toString(),
  USDT: parseUnits('1.001', 8).toString(),
  BTC: parseUnits('30001', 8).toString(),
  WBTC: parseUnits('30001', 8).toString(),
  WBTC_BTC: parseUnits('0.99895', 8).toString(),
  USD: parseUnits('1', 8).toString(),
  LINK: parseUnits('5', 8).toString(),
  CRV: parseUnits('6', 8).toString(),
  BAL: parseUnits('19.70', 8).toString(),
  REW: parseUnits('1', 8).toString(),
  EURS: parseUnits('1.127', 8).toString(),
  ONE: parseUnits('0.28', 8).toString(),
  WONE: parseUnits('0.28', 8).toString(),
  WAVAX: parseUnits('86.59', 8).toString(),
  WFTM: parseUnits('2.42', 8).toString(),
  WMATIC: parseUnits('1.40', 8).toString(),
  SUSD: parseUnits('1', 8).toString(),
  SUSHI: parseUnits('2.95', 8).toString(),
  GHST: parseUnits('2.95', 8).toString(),
  AGEUR: parseUnits('1.126', 8).toString(),
  JEUR: parseUnits('1.126', 8).toString(),
  DPI: parseUnits('149', 8).toString(),
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ReserveAssets: iParamsPerNetwork<SymbolMap<tEthereumAddress>> = {
  [eEthereumNetwork.sepolia]: {
    DAI: '0xAd4979AE4a275c4f6bc194c14C3b3CFBcD435abb',
    USDC: '0x06446E7Bd1f211C3189cfeCF3CDE488757eb5e4f',
    WBTC: '0xAF48F7c5866c0Fd63492bAc0b7816c1933c4D43a',
    WETH: '0xE55a23aaFb3a712BFae5BE96E0f61C745dedf33C',
    USDT: '0x76127399A0CafeDB59615A93A7ACF8552c1aEE4c',
    HOPE: '0x70C8C67CfbE228c7437Ec586a751a408e23355F4',
    stHOPE: '0x03D69A55579496821D8FdF0769F0C1a4A195788A',
  },
  [eEthereumNetwork.main]: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    HOPE: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
    stHOPE: '0xF5C6d9Fc73991F687f158FE30D4A77691a9Fd4d8',
  },
  [eEthereumNetwork.goerli]: {
    DAI: '0x5B71dC777A8aDCba065A644e30BBEeB8fCca273f',
    USDT: '0x3da37B4A2F5172580411DdcddDCcae857f9a7aE6',
    USDC: '0x235eBFC0bE0E58cF267D1c5BCb8c03a002A711ed',
    WETH: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    HOPE: '0x9bA97e0913Dd0fbd4E5fedA936db9D1f1C632273',
    stHOPE: '0x89009881287EB51256141265B2f250b9960AaeE5',
  },
  hardhat: {
    USDC: '0x6A9d4913AC8266A1dEbCfC6d5B6Ea275Fd19cD85',
    WBTC: '0x8520E10eA26c761a98bE06eA252cd30E83f4FB4B',
    WETH: '0x218B00cfb6f4ae38c43c83d1E6eBA8f25FD2324C',
    USDT: '0x62D8460025DE81982C843B14E7F18Ff2273ea491',
    HOPE: '0x784388A036cb9c8c680002F43354E856f816F844',
    stHOPE: '0x092c325a98e50BE78A140cD043D49904fFB8Ea1F',
  },
};

export const DeployIDs = {
  HOPEPriceFeed_ID: `HOPEPriceFeed-${MARKET_NAME}`,
  HopeAggregator_ID: `HopeAggregator-${MARKET_NAME}`,
  HopeAutomation_ID: `HopeAutomation-${MARKET_NAME}`,
  HopeOracle_ID: `HopeOracle-${MARKET_NAME}`,
  HopeFallbackOracle_ID: `HopeFallbackOracle-${MARKET_NAME}`,
  CLSynchronicityPriceAdapterPegToBase_ID: `HopeWBTCPriceFeed-${MARKET_NAME}`,
  TESTNET_PRICE_AGGR_PREFIX: `-TestnetPriceAggregator-FallbackOracle`,
};

export enum ProtocolErrors {
  CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN = '5', // 'The caller of the function is not an asset listing or pool admin'
  INCONSISTENT_PARAMS_LENGTH = '76', // 'Array parameters that should be equal length are not'
  ZERO_ADDRESS_NOT_VALID = '77', // 'Zero address not valid'
  FAILOVER_ALREADY_ACTIVE = '92', // Failover is already active
  FAILOVER_ALREADY_DEACTIVATED = '93', // Failover is already deactivated
}
