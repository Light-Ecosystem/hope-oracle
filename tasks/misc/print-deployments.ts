import { task } from 'hardhat/config';
import { getWalletBalances } from '../../helpers/tx';

task(`print-deployments`).setAction(async (_, { deployments, getNamedAccounts, ...hre }) => {
  const allDeployments = await deployments.all();

  let formattedDeployments: { [k: string]: { address: string } } = {};

  console.log('\nAccounts after deployment');
  console.log('========');
  console.table(await getWalletBalances());

  // Print deployed contracts
  console.log('\nDeployments');
  console.log('===========');
  Object.keys(allDeployments).forEach((key) => {
      formattedDeployments[key] = {
        address: allDeployments[key].address,
      };
  });
  console.table(formattedDeployments);
});
