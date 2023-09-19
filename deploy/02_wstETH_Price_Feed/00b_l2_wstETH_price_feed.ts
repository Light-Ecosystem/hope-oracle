import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { eEthereumNetwork } from '../../helpers/types';
import { DeployIDs } from '../../helpers/constants';
import { isL2Network } from '../../helpers/tx';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eEthereumNetwork;
  const isLive = hre.config.networks[network].live;
  const isL2 = isL2Network(network);
  let assetToPegAggregatorAddress, pegToBaseAggregatorAddress;

  if (network === eEthereumNetwork.arbi_main) {
    assetToPegAggregatorAddress = '0xb523AE262D20A936BC152e6023996e46FDC2A95D'; // wstETH / ETH
    pegToBaseAggregatorAddress = '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612'; // ETH / USD
  } else if (network === eEthereumNetwork.base_main) {
    assetToPegAggregatorAddress = '0xa669E5272E60f78299F4824495cE01a3923f4380'; // wstETH / ETH
    pegToBaseAggregatorAddress = '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70'; // ETH / USD
  }
  const decimals = 8;

  // deploy wstETH price feed
  if (isLive && isL2) {
    console.log('[NOTICE] Deployment of wBTC price feed');
    await deploy(DeployIDs.WstETHSynchronicityPriceAdapterL2_ID, {
      from: deployer,
      contract: 'WstETHSynchronicityPriceAdapterL2',
      args: [pegToBaseAggregatorAddress, assetToPegAggregatorAddress, decimals],
      log: true,
    });
  }
};

// This script can only be run successfully once per market, core version, and network
func.id = `WstETHL2PriceFeed`;

func.tags = ['WstETHL2PriceFeed'];

export default func;
