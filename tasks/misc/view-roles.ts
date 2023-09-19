import { task } from 'hardhat/config';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { isL2Network } from '../../helpers/tx';
import {
  getHOPEPriceFeed,
  getHopeAutomation,
  getHopeAggregator,
  getHopeAggregatorL2,
  getHopeFallbackOracle,
} from '../../helpers/contract-getter';
import { Configs } from '../../helpers/configs';
import { eEthereumNetwork } from '../../helpers/types';

task(`view-roles`, 'View current admin of each role and contract').setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
    const isL2 = isL2Network(network);
    let result;

    const HOPEPriceFeed = await getHOPEPriceFeed();
    const HopeFallbackOracle = await getHopeFallbackOracle();
    if (!isL2) {
      const HopeAutomation = await getHopeAutomation();
      const HopeAggregator = await getHopeAggregator();
      result = [
        {
          role: 'HOPEPriceFeed owner',
          address: await HOPEPriceFeed.owner(),
          assert: (await HOPEPriceFeed.owner()) === Configs[network].PriceFeed_owner,
        },
        {
          role: 'HopeAutomation owner',
          address: await HopeAutomation.owner(),
          assert: (await HopeAutomation.owner()) === Configs[network].Automation_owner,
        },
        {
          role: 'HopeAggregator owner',
          address: await HopeAggregator.owner(),
          assert: (await HopeAggregator.owner()) === Configs[network].Aggregator_owner,
        },
        {
          role: 'HopeFallbackOracle owner',
          address: await HopeFallbackOracle.owner(),
          assert: (await HopeFallbackOracle.owner()) === Configs[network].FallbackOracle_owner,
        },
        {
          role: 'HOPEPriceFeed operator',
          address: (await HOPEPriceFeed.isOperator(Configs[network].PriceFeed_operator))
            ? Configs[network].PriceFeed_operator
            : ZERO_ADDRESS,
          assert: await HOPEPriceFeed.isOperator(Configs[network].PriceFeed_operator),
        },
        {
          role: 'HopeAutomation operator',
          address: (await HopeAutomation.isOperator(Configs[network].Automation_operator))
            ? Configs[network].Automation_operator
            : ZERO_ADDRESS,
          assert: await HopeAutomation.isOperator(Configs[network].Automation_operator),
        },
        {
          role: 'HopeAggregator operator',
          address: (await HopeAggregator.isOperator(HopeAutomation.address)) ? HopeAutomation.address : ZERO_ADDRESS,
          assert: await HopeAggregator.isOperator(HopeAutomation.address),
        },
        {
          role: 'HopeFallbackOracle operator',
          address: (await HopeFallbackOracle.isOperator(Configs[network].FallbackOracle_operator))
            ? Configs[network].FallbackOracle_operator
            : ZERO_ADDRESS,
          assert: await HopeFallbackOracle.isOperator(Configs[network].FallbackOracle_operator),
        },
      ];
    } else {
      const HopeAggregatorL2 = await getHopeAggregatorL2();

      result = [
        {
          role: 'HOPEPriceFeed owner',
          address: await HOPEPriceFeed.owner(),
          assert: (await HOPEPriceFeed.owner()) === Configs[network].PriceFeed_owner,
        },
        {
          role: 'HopeAggregatorL2 owner',
          address: await HopeAggregatorL2.owner(),
          assert: (await HopeAggregatorL2.owner()) === Configs[network].Aggregator_owner,
        },
        {
          role: 'HopeFallbackOracle owner',
          address: await HopeFallbackOracle.owner(),
          assert: (await HopeFallbackOracle.owner()) === Configs[network].FallbackOracle_owner,
        },
        {
          role: 'HOPEPriceFeed operator',
          address: (await HOPEPriceFeed.isOperator(Configs[network].PriceFeed_operator))
            ? Configs[network].PriceFeed_operator
            : ZERO_ADDRESS,
          assert: await HOPEPriceFeed.isOperator(Configs[network].PriceFeed_operator),
        },
        {
          role: 'HopeAggregatorL2 operator',
          address: (await HopeAggregatorL2.isOperator(Configs[network].PriceFeed_operator))
            ? Configs[network].PriceFeed_operator
            : ZERO_ADDRESS,
          assert: await HopeAggregatorL2.isOperator(Configs[network].PriceFeed_operator),
        },
        {
          role: 'HopeFallbackOracle operator',
          address: (await HopeFallbackOracle.isOperator(Configs[network].FallbackOracle_operator))
            ? Configs[network].FallbackOracle_operator
            : ZERO_ADDRESS,
          assert: await HopeFallbackOracle.isOperator(Configs[network].FallbackOracle_operator),
        },
      ];
    }

    console.table(result);
  }
);
