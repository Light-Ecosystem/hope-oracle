import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {
  HOPEAddress,
  HOPEPriceDecimal,
  HOPEPriceHeartbeat,
  HOPEPriceThreshold,
  chainlinkBtcUsdAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from '../../helpers/constants';
import { eEthereumNetwork } from '../../helpers/types';
import { waitForTx } from '../../helpers/tx';
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;

  const ETHMaskAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const BTCMaskAddress = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const K = 1080180484347501;

  // 1. Deploy HOPEPriceFeed
  console.log(`\nDeploying HOPEPriceFeed...`);
  console.log('HOPE Address:', HOPEAddress[network]);

  const HOPEPriceFeed = await deploy('HOPEPriceFeed', {
    from: deployer,
    contract: 'HOPEPriceFeed',
    args: [ETHMaskAddress, BTCMaskAddress, HOPEAddress[network], K],
    log: true,
  });

  // 1.1 Set Reserve Tokens
  if (network !== eEthereumNetwork.main) {
    console.log(`\nHOPEPriceFeed Setting Reserve Tokens...`);

    const HOPEPriceFeedInstance = await ethers.getContractAt(HOPEPriceFeed.abi, HOPEPriceFeed.address);
    await waitForTx(
      await HOPEPriceFeedInstance.setReserveTokens(
        [ETHMaskAddress, BTCMaskAddress],
        [chainlinkEthUsdAggregatorProxy[network], chainlinkBtcUsdAggregatorProxy[network]],
        [10, 1]
      )
    );
  }

  // 2. Deploy HopeAggregator
  const HopeAggregator = await deploy('HopeAggregator', {
    from: deployer,
    contract: 'HopeAggregator',
    args: [HOPEPriceDecimal[network], 'HOPE/USD'],
    log: true,
  });

  // 3. Deploy HopeAutomation
  const HopeAutomationInstance = await deploy('HopeAutomation', {
    from: deployer,
    contract: 'HopeAutomation',
    args: [HOPEPriceFeed.address, HopeAggregator.address, HOPEPriceHeartbeat[network], HOPEPriceThreshold[network]],
    log: true,
  });

  // 4. HopeAggregator Update Transmitter
  const HopeAggregatorInstance = await ethers.getContractAt(HopeAggregator.abi, HopeAggregator.address);
  await waitForTx(await HopeAggregatorInstance.updateTransmitter(HopeAutomationInstance.address));
};

// This script can only be run successfully once per market, core version, and network
func.id = `HOPEPriceFeed`;

func.tags = ['HOPEPrice', 'HOPEPriceFeed'];

export default func;
