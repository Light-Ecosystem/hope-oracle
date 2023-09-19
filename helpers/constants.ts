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
  HOPE: parseUnits('0.55', 8).toString(),
  stHOPE: parseUnits('0.55', 8).toString(),
  WETH: parseUnits('2001', 8).toString(),
  ETH: parseUnits('2001', 8).toString(),
  wstETH: parseUnits('2100', 8).toString(),
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
    DAI: '0xc46EE5F997e71075871a7703e4DE68C0EA228c83',
    USDT: '0x6E572751AaE03719Cd0b53B3551db323eA2e2050',
    USDC: '0xD218270a11a3a8E614Ebf8AE8FD3D269a52ac114',
    WETH: '0x6209f6CADe90416BecaAA48Ca693D2652ecc36D9',
    wstETH: '0xf963aB230E0F2cF77dd6F834075D0cfa790BD443',
    WBTC: '0x3740A76b06653bb3f00bD7EEF0A8E8aA32B2B6c5',
    HOPE: '0x498C60F24E078efA5B34a952c5777aDa39C1bADB',
    stHOPE: '0x04c3dc90DD5d90De92Fa226697CF17c5875f63Af',
  },
  [eEthereumNetwork.main]: {
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    HOPE: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
    stHOPE: '0xF5C6d9Fc73991F687f158FE30D4A77691a9Fd4d8',
  },
  [eEthereumNetwork.arbi_main]: {
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    wstETH: '0x5979D7b546E38E414F7E9822514be443A4800529',
    WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    HOPE: '',
    stHOPE: '',
  },
  [eEthereumNetwork.base_main]: {
    USDT: '',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    WETH: '0x4200000000000000000000000000000000000006',
    wstETH: '',
    WBTC: '',
    HOPE: '',
    stHOPE: '',
  },
  [eEthereumNetwork.goerli]: {
    USDT: '0x1C6Cf7Df9dFC87d2C373FF12F713e3222356783f',
    USDC: '0x832c2B8efb16Ffabc73e1F23D31f3B574Ff0b7F6',
    WETH: '0x6Cc53D3AeaEe7aAfbd2Ac304AA64d017E6cb4f2a',
    wstETH: '0x050af32f9FEA93231fCFf7a44181A2a7dA9b4A80',
    WBTC: '0x5e457e88503c47C85C106edB4e27208bBBA26d7f',
    HOPE: '0xdC857E0d4C850deAe3a7735390243d3c444E552F',
    stHOPE: '0x09B4621e2A9dBd37550dC4923E60Ff0782Ef9250',
  },
  [eEthereumNetwork.arbi_goerli]: {
    USDT: '0x1C6Cf7Df9dFC87d2C373FF12F713e3222356783f',
    USDC: '0x832c2B8efb16Ffabc73e1F23D31f3B574Ff0b7F6',
    WETH: '0x6Cc53D3AeaEe7aAfbd2Ac304AA64d017E6cb4f2a',
    wstETH: '0x050af32f9FEA93231fCFf7a44181A2a7dA9b4A80',
    WBTC: '0x5e457e88503c47C85C106edB4e27208bBBA26d7f',
    HOPE: '0xdC857E0d4C850deAe3a7735390243d3c444E552F',
    stHOPE: '0x09B4621e2A9dBd37550dC4923E60Ff0782Ef9250',
  },
  [eEthereumNetwork.base_goerli]: {
    USDT: '0x1C6Cf7Df9dFC87d2C373FF12F713e3222356783f',
    USDC: '0x832c2B8efb16Ffabc73e1F23D31f3B574Ff0b7F6',
    WETH: '0x6Cc53D3AeaEe7aAfbd2Ac304AA64d017E6cb4f2a',
    wstETH: '0x050af32f9FEA93231fCFf7a44181A2a7dA9b4A80',
    WBTC: '0x5e457e88503c47C85C106edB4e27208bBBA26d7f',
    HOPE: '0xdC857E0d4C850deAe3a7735390243d3c444E552F',
    stHOPE: '0x09B4621e2A9dBd37550dC4923E60Ff0782Ef9250',
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
  HopeAggregatorL2_ID: `HopeAggregatorL2-${MARKET_NAME}`,
  HopeAutomation_ID: `HopeAutomation-${MARKET_NAME}`,
  HopeOracle_ID: `HopeOracle-${MARKET_NAME}`,
  HopeFallbackOracle_ID: `HopeFallbackOracle-${MARKET_NAME}`,
  WBTCSynchronicityPriceAdapter_ID: `HopeWBTCPriceFeed-${MARKET_NAME}`,
  WstETHSynchronicityPriceAdapter_ID: `HopeWstETHPriceFeed-${MARKET_NAME}`,
  WstETHSynchronicityPriceAdapterL2_ID: `HopeWstETHL2PriceFeed-${MARKET_NAME}`,
  TESTNET_PRICE_AGGR_PREFIX: `-TestnetPriceAggregator-FallbackOracle`,
};

export enum ProtocolErrors {
  CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN = '5', // 'The caller of the function is not an asset listing or pool admin'
  INCONSISTENT_PARAMS_LENGTH = '76', // 'Array parameters that should be equal length are not'
  ZERO_ADDRESS_NOT_VALID = '77', // 'Zero address not valid'
  FAILOVER_ALREADY_ACTIVE = '92', // Failover is already active
  FAILOVER_ALREADY_DEACTIVATED = '93', // Failover is already deactivated
}
