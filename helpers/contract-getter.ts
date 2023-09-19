import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { eEthereumNetwork, SymbolMap, tEthereumAddress, ITokenAddress } from './types';
import { ReserveAssets, DeployIDs } from './constants';
import { HOPEPriceFeed, HopeAutomation, HopeFallbackOracle } from '../typechain';
import { getContract } from './tx';

declare var hre: HardhatRuntimeEnvironment;

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
      key.includes(DeployIDs.TESTNET_PRICE_AGGR_PREFIX) &&
      reservesKeys.includes(key.replace(DeployIDs.TESTNET_PRICE_AGGR_PREFIX, ''))
  );
  return testnetKeys.reduce<ITokenAddress>((acc, key) => {
    const symbol = key.replace(DeployIDs.TESTNET_PRICE_AGGR_PREFIX, '');
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
  if (Object.keys(allAssetsAddresses).length === 0 || Object.keys(aggregatorsAddresses).length === 0) return [[], []];

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

export const getHOPEPriceFeed = async (address?: tEthereumAddress): Promise<HOPEPriceFeed> =>
  getContract('HOPEPriceFeed', address || (await hre.deployments.get(DeployIDs.HOPEPriceFeed_ID)).address);

export const getHopeAutomation = async (address?: tEthereumAddress): Promise<HopeAutomation> =>
  getContract('HopeAutomation', address || (await hre.deployments.get(DeployIDs.HopeAutomation_ID)).address);

export const getHopeAggregator = async (address?: tEthereumAddress): Promise<HopeAutomation> =>
  getContract('HopeAggregator', address || (await hre.deployments.get(DeployIDs.HopeAggregator_ID)).address);

export const getHopeAggregatorL2 = async (address?: tEthereumAddress): Promise<HopeAutomation> =>
  getContract('HopeAggregatorL2', address || (await hre.deployments.get(DeployIDs.HopeAggregatorL2_ID)).address);

export const getHopeFallbackOracle = async (address?: tEthereumAddress): Promise<HopeFallbackOracle> =>
  getContract('HopeFallbackOracle', address || (await hre.deployments.get(DeployIDs.HopeFallbackOracle_ID)).address);
