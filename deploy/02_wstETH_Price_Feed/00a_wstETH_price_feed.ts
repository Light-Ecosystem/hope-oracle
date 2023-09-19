import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { eEthereumNetwork } from '../../helpers/types';
import { DeployIDs } from '../../helpers/constants';
import { isL2Network } from '../../helpers/tx';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
  const isLive = hre.config.networks[network].live;
  const isL2 = isL2Network(network);

  const ethToBaseAggregatorAddress = '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'; // ETH/USD
  const stEthAddress = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'; // stETH

  // deploy wstETH price feed
  if (isLive && !isL2) {
    console.log('[NOTICE] Deployment of wstETH price feed');
    await deploy(DeployIDs.WstETHSynchronicityPriceAdapter_ID, {
      from: deployer,
      contract: 'WstETHSynchronicityPriceAdapter',
      args: [ethToBaseAggregatorAddress, stEthAddress],
      log: true,
    });
  }
};

// This script can only be run successfully once per market, core version, and network
func.id = `WstETHPriceFeed`;

func.tags = ['WstETHPriceFeed'];

export default func;
