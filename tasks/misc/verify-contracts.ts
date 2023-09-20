import { task } from 'hardhat/config';
import { isL2Network, waitForTx } from '../../helpers/tx';
import {
  getHOPEPriceFeed,
  getHopeAutomation,
  getHopeAggregator,
  getHopeFallbackOracle,
  getHopeAggregatorL2,
  getChainlinkOracles,
  getPairsTokenAggregator,
} from '../../helpers/contract-getter';
import { ZERO_ADDRESS, ReserveAssets } from '../../helpers/constants';
import { parseUnits } from 'ethers/lib/utils';
import { Configs } from '../../helpers/configs';
import { eEthereumNetwork, tEthereumAddress, SymbolMap } from '../../helpers/types';

task(`verify-contracts`, 'Verify contract').setAction(async (_, { deployments, getNamedAccounts, ...hre }) => {
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
  const isL2 = isL2Network(network);
  const ETHMaskAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const BTCMaskAddress = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';
  const K = 1080180484347501;

  // Verify HOPEPriceFeed
  const HOPEPriceFeed = await getHOPEPriceFeed();
  console.log(`- Verifying HOPEPriceFeed:`);
  try {
    await hre.run('verify:verify', {
      address: HOPEPriceFeed.address,
      constructorArguments: [ETHMaskAddress, BTCMaskAddress, Configs[network].HOPE_address, K],
    });
  } catch (error) {
    console.error(error);
  }

  // Verify HopeFallbackOracle
  const HopeFallbackOracle = await getHopeFallbackOracle();
  const chainlinkAggregators = await getChainlinkOracles(network);
  console.log('chainlinkAggregators', chainlinkAggregators);
  const reserves = ReserveAssets[network] as SymbolMap<tEthereumAddress>;
  const [assets, sources] = getPairsTokenAggregator(reserves, chainlinkAggregators);
  console.log(`- Verifying HopeFallbackOracle:`);
  try {
    await hre.run('verify:verify', {
      address: HopeFallbackOracle.address,
      constructorArguments: [assets, sources, ZERO_ADDRESS, parseUnits('1', '8')],
    });
  } catch (error) {
    console.error(error);
  }

  if (isL2) {
    // Verify HopeAggregatorL2
    const HopeAggregatorL2 = await getHopeAggregatorL2();
    console.log(`- Verifying HopeAggregatorL2:`);
    try {
      await hre.run('verify:verify', {
        address: HopeAggregatorL2.address,
        constructorArguments: [HOPEPriceFeed.address, Configs[network].PriceFeed_decimals, 'HOPE/USD'],
      });
    } catch (error) {
      console.error(error);
    }

    return;
  }

  // Verify HopeAggregator
  const HopeAggregator = await getHopeAggregator();
  console.log(`- Verifying HopeAggregator:`);
  try {
    await hre.run('verify:verify', {
      address: HopeAggregator.address,
      constructorArguments: [Configs[network].PriceFeed_decimals, 'HOPE/USD'],
    });
  } catch (error) {
    console.error(error);
  }

  // Verify HopeAutomation
  const HopeAutomation = await getHopeAutomation();
  console.log(`- Verifying HopeAutomation:`);
  try {
    await hre.run('verify:verify', {
      address: HopeAutomation.address,
      constructorArguments: [
        HOPEPriceFeed.address,
        HopeAggregator.address,
        Configs[network].PriceFeed_heartbeat,
        Configs[network].PriceFeed_threshold,
      ],
    });
  } catch (error) {
    console.error(error);
  }
});
