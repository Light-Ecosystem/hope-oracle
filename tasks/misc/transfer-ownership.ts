import { task } from 'hardhat/config';
import { getWalletBalances, waitForTx } from '../../helpers/tx';
import {
  getHOPEPriceFeed,
  getHopeAutomation,
  getHopeAggregator,
  getHopeFallbackOracle,
} from '../../helpers/contract-getter';
import { Configs } from '../../helpers/configs';

task(`transfer-ownership`, 'Transfer ownership for each contract').setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as string;

    const HOPEPriceFeed = await getHOPEPriceFeed();
    console.log('HOPEPriceFeed Address:', HOPEPriceFeed.address);
    console.log(`HOPEPriceFeed Transfer Ownership...\n`);
    await waitForTx(await HOPEPriceFeed.transferOwnership(Configs[network].PriceFeed_owner));

    const HopeAutomation = await getHopeAutomation();
    console.log('HopeAutomation Address:', HopeAutomation.address);
    console.log(`HopeAutomation Transfer Ownership...\n`);
    await waitForTx(await HopeAutomation.transferOwnership(Configs[network].Automation_owner));

    const HopeAggregator = await getHopeAggregator();
    console.log('HopeAggregator Address:', HopeAggregator.address);
    console.log(`HopeAggregator Transfer Ownership...\n`);
    await waitForTx(await HopeAggregator.transferOwnership(Configs[network].Aggregator_owner));

    const HopeFallbackOracle = await getHopeFallbackOracle();
    console.log('HopeFallbackOracle Address:', HopeFallbackOracle.address);
    console.log(`HopeFallbackOracle Transfer Ownership...\n`);
    await waitForTx(await HopeFallbackOracle.transferOwnership(Configs[network].FallbackOracle_owner));
  }
);
