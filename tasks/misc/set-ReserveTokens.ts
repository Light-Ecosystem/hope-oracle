import { task } from 'hardhat/config';
import { waitForTx } from '../../helpers/tx';
import { Configs } from '../../helpers/configs';
import { getHOPEPriceFeed } from '../../helpers/contract-getter';

task(`set-reserveTokens`, 'Setup reserve tokens for HOPEPriceFeed').setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as string;

    const { deployer, operator } = await getNamedAccounts();

    const ETHMaskAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const BTCMaskAddress = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';

    const HOPEPriceFeed = await getHOPEPriceFeed();
    console.log('HOPEPriceFeed Address:', HOPEPriceFeed.address);
    console.log('HOPEPriceFeed Setting ReserveTokens...\n');

    await waitForTx(
      await HOPEPriceFeed.connect(await hre.ethers.getSigner(operator)).setReserveTokens(
        [ETHMaskAddress, BTCMaskAddress],
        [Configs[network].chainlinkEthUsdAggregatorProxy, Configs[network].chainlinkBtcUsdAggregatorProxy],
        [10, 1]
      )
    );
  }
);
