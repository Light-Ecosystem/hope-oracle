import { task } from 'hardhat/config';
import { getWalletBalances, waitForTx } from '../../helpers/tx';
import { getHOPEPriceFeed, getHopeAutomation, getHopeFallbackOracle } from '../../helpers/contract-getter';
import { HOPEPriceFeed_Operator, HopeAutomation_Operator, HopeFallbackOracle_Operator } from '../../helpers/configs';

task(`set-operators`, 'Setup operators for each contract').setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as string;

    const HOPEPriceFeed = await getHOPEPriceFeed();
    console.log('HOPEPriceFeed Address:', HOPEPriceFeed.address);
    console.log(`HOPEPriceFeed Setting Operator...\n`);
    await waitForTx(await HOPEPriceFeed.addOperator(HOPEPriceFeed_Operator[network]));

    const HopeAutomation = await getHopeAutomation();
    console.log('HopeAutomation Address:', HopeAutomation.address);
    console.log(`HopeAutomation Setting Operator...\n`);
    await waitForTx(await HopeAutomation.addOperator(HopeAutomation_Operator[network]));

    const HopeFallbackOracle = await getHopeFallbackOracle();
    console.log('HopeFallbackOracle Address:', HopeFallbackOracle.address);
    console.log(`HopeFallbackOracle Setting Operator...\n`);
    await waitForTx(await HopeFallbackOracle.addOperator(HopeFallbackOracle_Operator[network]));
  }
);
