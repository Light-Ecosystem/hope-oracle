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

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, ethers } = hre;
  const { deploy } = deployments;
  const { deployer, operator } = await getNamedAccounts();
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
  const isLive = hre.config.networks[network].live;

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

  // 1.1 Set HOPEPriceFeed Operator
  if (!isLive) {
    console.log(`\nHOPEPriceFeed Setting Operator...`);
    const HOPEPriceFeedInstance = await ethers.getContractAt(HOPEPriceFeed.abi, HOPEPriceFeed.address);
    await waitForTx(await HOPEPriceFeedInstance.addOperator(operator));

    // 1.2 Set Reserve Tokens
    console.log(`\nHOPEPriceFeed Setting Reserve Tokens...`);
    await waitForTx(
      await HOPEPriceFeedInstance.connect(await ethers.getSigner(operator)).setReserveTokens(
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
  const HopeAutomation = await deploy('HopeAutomation', {
    from: deployer,
    contract: 'HopeAutomation',
    args: [HOPEPriceFeed.address, HopeAggregator.address, HOPEPriceHeartbeat[network], HOPEPriceThreshold[network]],
    log: true,
  });

  // 3.1 add HopeAutomation Operator
  if (!isLive) {
    console.log(`\nHopeAutomation Setting Operator...`);
    const HopeAutomationInstance = await ethers.getContractAt(HopeAutomation.abi, HopeAutomation.address);
    await waitForTx(await HopeAutomationInstance.addOperator(operator));
  }

  // 4 Set HopeAggregator Operator
  const HopeAggregatorInstance = await ethers.getContractAt(HopeAggregator.abi, HopeAggregator.address);
  await waitForTx(await HopeAggregatorInstance.addOperator(HopeAutomation.address));
};

// This script can only be run successfully once per market, core version, and network
func.id = `HOPEPriceFeed`;

func.tags = ['HOPEPrice', 'HOPEPriceFeed'];

export default func;
