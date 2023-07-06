import { task } from 'hardhat/config';
import { DeployIDs, ZERO_ADDRESS, ReserveAssets, MOCK_CHAINLINK_AGGREGATORS_PRICES } from '../../helpers/constants';
import { getChainlinkOracles, getPairsTokenAggregator } from '../../helpers/contract-getter';
import { eEthereumNetwork, SymbolMap, tEthereumAddress } from '../../helpers/types';
import { parseUnits } from 'ethers/lib/utils';
import Bluebird from 'bluebird';

task(`deploy-HopeOracle`).setAction(async (_, { ...hre }) => {
  const { getNamedAccounts, deployments, ethers } = hre;
  const { deploy } = deployments;
  const { deployer, operator } = await getNamedAccounts();
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;

  const isLive = hre.config.networks[network].live;
  const reserves = ReserveAssets[network] as SymbolMap<tEthereumAddress>;
  if (!isLive) {
    console.log('[NOTICE] Deployment of testnet price aggregators');

    let symbols = Object.keys(reserves);

    // Iterate each token symbol and deploy a mock aggregator
    await Bluebird.each(symbols, async (symbol) => {
      let price = MOCK_CHAINLINK_AGGREGATORS_PRICES[symbol];
      if (!price) {
        throw `[ERROR] Missing mock price for asset ${symbol} at MOCK_CHAINLINK_AGGREGATORS_PRICES constant located at src/constants.ts`;
      }
      await deploy(`${symbol}${DeployIDs.TESTNET_PRICE_AGGR_PREFIX}`, {
        args: [price],
        from: deployer,
        log: true,
        contract: 'MockAggregator',
      });
    });
  }

  const chainlinkAggregators = await getChainlinkOracles(network);
  console.log('chainlinkAggregators', chainlinkAggregators);

  const [assets, sources] = getPairsTokenAggregator(reserves, chainlinkAggregators);

  const HopeOracle = await deploy(DeployIDs.HopeOracle_ID, {
    from: deployer,
    contract: 'HopeOracle',
    args: [assets, sources, ZERO_ADDRESS, ZERO_ADDRESS, parseUnits('1', '8')],
    log: true,
  });

  console.log('HopeOracle deployed at:', HopeOracle.address);

  if (!isLive) {
    // Set HopeOracle Operator
    const HopeFallbackOracleInstance = await ethers.getContractAt(HopeOracle.abi, HopeOracle.address);
    await HopeFallbackOracleInstance.addOperator(operator);
  }
});
