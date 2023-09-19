import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { Configs } from '../../helpers/configs';
import { DeployIDs } from '../../helpers/constants';
import { eEthereumNetwork } from '../../helpers/types';
import { waitForTx, isL2Network } from '../../helpers/tx';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, ethers } = hre;
  const { deploy } = deployments;
  const { deployer, operator } = await getNamedAccounts();
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
  const isL2 = isL2Network(network);

  const ETHMaskAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const BTCMaskAddress = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const K = 1080180484347501;

  // 1. Deploy HOPEPriceFeed
  console.log(`\nDeploying HOPEPriceFeed...`);
  console.log('HOPE Address:', Configs[network].HOPE_address);

  const HOPEPriceFeed = await deploy(DeployIDs.HOPEPriceFeed_ID, {
    from: deployer,
    contract: 'HOPEPriceFeed',
    args: [ETHMaskAddress, BTCMaskAddress, Configs[network].HOPE_address, K],
    log: true,
  });

  if (isL2) {
    // 2. Deploy HopeAggregatorL2
    await deploy(DeployIDs.HopeAggregatorL2_ID, {
      from: deployer,
      contract: 'HopeAggregatorL2',
      args: [HOPEPriceFeed.address, Configs[network].PriceFeed_decimals, 'HOPE/USD'],
      log: true,
    });

    return;
  }

  // 2. Deploy HopeAggregator
  const HopeAggregator = await deploy(DeployIDs.HopeAggregator_ID, {
    from: deployer,
    contract: 'HopeAggregator',
    args: [Configs[network].PriceFeed_decimals, 'HOPE/USD'],
    log: true,
  });

  // 3. Deploy HopeAutomation
  const HopeAutomation = await deploy(DeployIDs.HopeAutomation_ID, {
    from: deployer,
    contract: 'HopeAutomation',
    args: [
      HOPEPriceFeed.address,
      HopeAggregator.address,
      Configs[network].PriceFeed_heartbeat,
      Configs[network].PriceFeed_threshold,
    ],
    log: true,
  });

  // 4 Set HopeAggregator Operator
  const HopeAggregatorInstance = await ethers.getContractAt(HopeAggregator.abi, HopeAggregator.address);
  await waitForTx(await HopeAggregatorInstance.addOperator(HopeAutomation.address));
};

// This script can only be run successfully once per market, core version, and network
func.id = `HOPEPriceFeed`;

func.tags = ['HOPEPrice', 'HOPEPriceFeed'];

export default func;
