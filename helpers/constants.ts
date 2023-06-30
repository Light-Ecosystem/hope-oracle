import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { eEthereumNetwork, iParamsPerNetwork, SymbolMap, tEthereumAddress, ITokenAddress } from './types';
import { parseEther, parseUnits } from 'ethers/lib/utils';
declare var hre: HardhatRuntimeEnvironment;

export const DEFAULT_NAMED_ACCOUNTS = {
  deployer: {
    default: 0,
  },
  operator: {
    default: 1,
  },
};

export const TESTNET_PRICE_AGGR_PREFIX = `-TestnetPriceAggregator-FallbackOracle`;

export const HOPEPriceDecimal: Record<string, number> = {
  main: 8,
  [eEthereumNetwork.goerli]: 8,
  [eEthereumNetwork.sepolia]: 8,
  hardhat: 8,
};

export const HOPEPriceHeartbeat: Record<string, number> = {
  main: 3600,
  [eEthereumNetwork.goerli]: 3600,
  [eEthereumNetwork.sepolia]: 3600,
  hardhat: 3600,
};

export const HOPEPriceThreshold: Record<string, number> = {
  main: 100,
  [eEthereumNetwork.goerli]: 100,
  [eEthereumNetwork.sepolia]: 100,
  hardhat: 100,
};

export const HOPEAddress: Record<string, string> = {
  main: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
  [eEthereumNetwork.goerli]: '0x12843dFa0eaf7017de47cD46218618B0991E238e',
  [eEthereumNetwork.sepolia]: '0x784388A036cb9c8c680002F43354E856f816F844',
  hardhat: '0xD5C33721220Bc75f0BBD970E64D5807350DEB3C5',
};

export const chainlinkEthUsdAggregatorProxy: Record<string, string> = {
  main: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
  [eEthereumNetwork.goerli]: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
  [eEthereumNetwork.sepolia]: '0xb8eDE1c9cE926117D5e0D82b6B0e03cf5fC26d60',
  hardhat: '0xD5C33721220Bc75f0BBD970E64D5807350DEB3C5',
};

export const chainlinkBtcUsdAggregatorProxy: Record<string, string> = {
  main: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
  [eEthereumNetwork.goerli]: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
  [eEthereumNetwork.sepolia]: '0xd981d04700477a58d3e83F6A025f881B156Ba20e',
  hardhat: '0xD5C33721220Bc75f0BBD970E64D5807350DEB3C5',
};

export const MOCK_CHAINLINK_AGGREGATORS_PRICES: { [key: string]: string } = {
  HOPE: parseUnits('0.7', 8).toString(),
  StakingHOPE: parseUnits('0.7', 8).toString(),
  WETH: parseUnits('2001', 8).toString(),
  ETH: parseUnits('2001', 8).toString(),
  DAI: parseUnits('1.001', 8).toString(),
  USDC: parseUnits('1.001', 8).toString(),
  USDT: parseUnits('1.001', 8).toString(),
  BTC: parseUnits('30001', 8).toString(),
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
    DAI: '0xc527C4003B0554A5703FA666D7D45dB205e3de99',
    LINK: '0x027b143919AE292f61386AA6dE06f892e1C947d9',
    USDC: '0x6A9d4913AC8266A1dEbCfC6d5B6Ea275Fd19cD85',
    WBTC: '0x8520E10eA26c761a98bE06eA252cd30E83f4FB4B',
    WETH: '0x218B00cfb6f4ae38c43c83d1E6eBA8f25FD2324C',
    USDT: '0x62D8460025DE81982C843B14E7F18Ff2273ea491',
    HOPE: '0x784388A036cb9c8c680002F43354E856f816F844',
    StakingHOPE: '0x092c325a98e50BE78A140cD043D49904fFB8Ea1F',
    EURS: '0x0fdcBABb76c0A60a9F28e60940027C48dF88347A',
  },
  [eEthereumNetwork.main]: {
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    HOPE: '0xc353Bf07405304AeaB75F4C2Fac7E88D6A68f98e',
    EURS: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
  },
  [eEthereumNetwork.goerli]: {
    HOPE: ZERO_ADDRESS,
    DAI: ZERO_ADDRESS,
    LINK: ZERO_ADDRESS,
    USDC: ZERO_ADDRESS,
    WBTC: ZERO_ADDRESS,
    WETH: ZERO_ADDRESS,
    USDT: ZERO_ADDRESS,
    EURS: ZERO_ADDRESS,
  },
  hardhat: {
    DAI: '0xc527C4003B0554A5703FA666D7D45dB205e3de99',
    LINK: '0x027b143919AE292f61386AA6dE06f892e1C947d9',
    USDC: '0x6A9d4913AC8266A1dEbCfC6d5B6Ea275Fd19cD85',
    WBTC: '0x8520E10eA26c761a98bE06eA252cd30E83f4FB4B',
    WETH: '0x218B00cfb6f4ae38c43c83d1E6eBA8f25FD2324C',
    USDT: '0x62D8460025DE81982C843B14E7F18Ff2273ea491',
    HOPE: '0x784388A036cb9c8c680002F43354E856f816F844',
    StakingHOPE: '0x092c325a98e50BE78A140cD043D49904fFB8Ea1F',
    EURS: '0x0fdcBABb76c0A60a9F28e60940027C48dF88347A',
  },
};

export const getChainlinkOracles = async (network: eEthereumNetwork) => {
  const isLive = hre.config.networks[network].live;
  if (isLive) {
    console.log('[NOTICE] Using ChainlinkAggregator from configuration file');

    return {};
  }
  console.log('[WARNING] Using deployed Mock Price Aggregators instead of ChainlinkAggregator from configuration file');
  const reserves = ReserveAssets[network] as SymbolMap<tEthereumAddress>;
  const reservesKeys = Object.keys(reserves);
  const allDeployments = await hre.deployments.all();
  const testnetKeys = Object.keys(allDeployments).filter(
    (key) =>
      key.includes(TESTNET_PRICE_AGGR_PREFIX) && reservesKeys.includes(key.replace(TESTNET_PRICE_AGGR_PREFIX, ''))
  );
  return testnetKeys.reduce<ITokenAddress>((acc, key) => {
    const symbol = key.replace(TESTNET_PRICE_AGGR_PREFIX, '');
    acc[symbol] = allDeployments[key].address;
    return acc;
  }, {});
};

export const getPairsTokenAggregator = (
  allAssetsAddresses: {
    [tokenSymbol: string]: tEthereumAddress;
  },
  aggregatorsAddresses: { [tokenSymbol: string]: tEthereumAddress }
): [string[], string[]] => {
  const { ETH, USD, ...assetsAddressesWithoutEth } = allAssetsAddresses;

  const pairs = Object.entries(assetsAddressesWithoutEth).map(([tokenSymbol, tokenAddress]) => {
    const aggregatorAddressIndex = Object.keys(aggregatorsAddresses).findIndex((value) => value === tokenSymbol);
    const [, aggregatorAddress] = (Object.entries(aggregatorsAddresses) as [string, tEthereumAddress][])[
      aggregatorAddressIndex
    ];
    if (!aggregatorAddress) throw `Missing aggregator for ${tokenSymbol}`;
    if (!tokenAddress) throw `Missing token address for ${tokenSymbol}`;
    return [tokenAddress, aggregatorAddress];
  }) as [string, string][];

  const mappedPairs = pairs.map(([asset]) => asset);
  const mappedAggregators = pairs.map(([, source]) => source);

  return [mappedPairs, mappedAggregators];
};

export enum ProtocolErrors {
  CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN = '5', // 'The caller of the function is not an asset listing or pool admin'
  INCONSISTENT_PARAMS_LENGTH = '76', // 'Array parameters that should be equal length are not'
  ZERO_ADDRESS_NOT_VALID = '77', // 'Zero address not valid'
  FAILOVER_ALREADY_ACTIVE = '92', // Failover is already active
  FAILOVER_ALREADY_DEACTIVATED = '93', // Failover is already deactivated
}
