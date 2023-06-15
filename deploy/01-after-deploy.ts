// Docs: https://hardhat.org/plugins/hardhat-deploy.html#deploy-hooks
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

/**
 * The following script runs after the deployment starts
 */

const func: DeployFunction = async function ({ getNamedAccounts, deployments, ...hre }: HardhatRuntimeEnvironment) {
  await hre.run('print-deployments');
};

func.tags = ['after-deploy'];
func.runAtTheEnd = true;
export default func;
