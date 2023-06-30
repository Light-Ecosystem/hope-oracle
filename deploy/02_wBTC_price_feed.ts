import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { eEthereumNetwork } from '../helpers/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
  const isLive = hre.config.networks[network].live;

  const assetToPegAggregatorAddress = '0xfdFD9C85aD200c506Cf9e21F1FD8dd01932FBB23'; // WBTC / BTC
  const pegToBaseAggregatorAddress = '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c'; // BTC / USD
  const decimals = 8;

  // deploy wBTC price feed
  if (isLive) {
    await deploy('CLSynchronicityPriceAdapterPegToBase', {
      from: deployer,
      contract: 'CLSynchronicityPriceAdapterPegToBase',
      args: [pegToBaseAggregatorAddress, assetToPegAggregatorAddress, decimals],
      log: true,
    });
  }
};

// This script can only be run successfully once per market, core version, and network
func.id = `WBTCPriceFeed`;

func.tags = ['WBTCPriceFeed'];

export default func;
