import { task } from 'hardhat/config';
import { isL2Network, waitForTx } from '../../helpers/tx';
import { eEthereumNetwork } from '../../helpers/types';
import {
  getHOPEPriceFeed,
  getHopeAutomation,
  getHopeFallbackOracle,
  getHopeAggregatorL2,
} from '../../helpers/contract-getter';
import { Configs } from '../../helpers/configs';

task(`setup-operators`, 'Setup operators for each contract').setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
    const isL2 = isL2Network(network);

    const HOPEPriceFeed = await getHOPEPriceFeed();
    console.log('HOPEPriceFeed Address:', HOPEPriceFeed.address);
    console.log(`HOPEPriceFeed Setting Operator...\n`);
    await waitForTx(await HOPEPriceFeed.addOperator(Configs[network].PriceFeed_operator));

    const HopeFallbackOracle = await getHopeFallbackOracle();
    console.log('HopeFallbackOracle Address:', HopeFallbackOracle.address);
    console.log(`HopeFallbackOracle Setting Operator...\n`);
    await waitForTx(await HopeFallbackOracle.addOperator(Configs[network].FallbackOracle_operator));

    if (isL2) {
      const HopeAggregatorL2 = await getHopeAggregatorL2();
      console.log('HopeAggregatorL2 Address:', HopeAggregatorL2.address);
      console.log(`HopeAggregatorL2 Setting Operator...\n`);
      await waitForTx(await HopeAggregatorL2.addOperator(Configs[network].PriceFeed_operator));

      return;
    }

    const HopeAutomation = await getHopeAutomation();
    console.log('HopeAutomation Address:', HopeAutomation.address);
    console.log(`HopeAutomation Setting Operator...\n`);
    await waitForTx(await HopeAutomation.addOperator(Configs[network].Automation_operator));
  }
);
