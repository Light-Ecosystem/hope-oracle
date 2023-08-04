import { task } from 'hardhat/config';
import { ZERO_ADDRESS } from '../../helpers/constants';
import {
  getHOPEPriceFeed,
  getHopeAutomation,
  getHopeAggregator,
  getHopeFallbackOracle,
} from '../../helpers/contract-getter';
import { Configs } from '../../helpers/configs';

task(`view-roles`, 'View current admin of each role and contract').setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as string;

    const HOPEPriceFeed = await getHOPEPriceFeed();
    const HopeAutomation = await getHopeAutomation();
    const HopeAggregator = await getHopeAggregator();
    const HopeFallbackOracle = await getHopeFallbackOracle();

    const result = [
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

    console.table(result);
  }
);
