import { task } from 'hardhat/config';
import { getWalletBalances, waitForTx } from '../../helpers/tx';
import { getHOPEPriceFeed, getHopeAutomation, getHopeFallbackOracle } from '../../helpers/contract-getter';
import { Configs } from '../../helpers/configs';

task(`setup-operators`, 'Setup operators for each contract').setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as string;

    const HOPEPriceFeed = await getHOPEPriceFeed();
    console.log('HOPEPriceFeed Address:', HOPEPriceFeed.address);
    console.log(`HOPEPriceFeed Setting Operator...\n`);
    await waitForTx(await HOPEPriceFeed.addOperator(Configs[network].PriceFeed_operator));

    const HopeAutomation = await getHopeAutomation();
    console.log('HopeAutomation Address:', HopeAutomation.address);
    console.log(`HopeAutomation Setting Operator...\n`);
    await waitForTx(await HopeAutomation.addOperator(Configs[network].Automation_operator));

    const HopeFallbackOracle = await getHopeFallbackOracle();
    console.log('HopeFallbackOracle Address:', HopeFallbackOracle.address);
    console.log(`HopeFallbackOracle Setting Operator...\n`);
    await waitForTx(await HopeFallbackOracle.addOperator(Configs[network].FallbackOracle_operator));
  }
);
