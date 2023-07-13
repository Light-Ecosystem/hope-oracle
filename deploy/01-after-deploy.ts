// Docs: https://hardhat.org/plugins/hardhat-deploy.html#deploy-hooks
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { eEthereumNetwork } from '../helpers/types';

/**
 * The following script runs after the deployment starts
 */

const func: DeployFunction = async function ({ getNamedAccounts, deployments, ...hre }: HardhatRuntimeEnvironment) {
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
  const isLive = hre.config.networks[network].live;

  // Setup operators for each contract
  await hre.run('set-operators');
  if (!isLive && network !== eEthereumNetwork.goerli) {
    // Setup reserve tokens for HOPEPriceFeed
    await hre.run('set-reserveTokens');
  }

  await hre.run('print-deployments');
};

func.tags = ['after-deploy'];
func.runAtTheEnd = true;
export default func;
