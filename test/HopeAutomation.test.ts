import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { parseUnits, zeroPad } from 'ethers/lib/utils';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, ZERO_ADDRESS, ProtocolErrors } from '../helpers/constants';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { BigNumber } from 'ethers';
declare var hre: HardhatRuntimeEnvironment;

describe('HopeAutomation', () => {
  let decimals = 8;
  let description = 'HOPE/USD';
  let heartbeat = 3600;
  let threshold = 100;
  let ETHMockAggregatorAddress: string;
  let BTCMockAggregatorAddress: string;
  let ETHPrice = MOCK_CHAINLINK_AGGREGATORS_PRICES.ETH;
  let BTCPrice = MOCK_CHAINLINK_AGGREGATORS_PRICES.WBTC;
  let ETHFactor = 10;
  let BTCFactor = 1;
  let HOPETotalSupply = parseUnits('20000000000', 18);
  let targetPrice: BigNumber;
  const K = 1080180484347501;
  const ETHMaskAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const BTCMaskAddress = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';

  async function deployTestFixture() {
    const [owner, addr1, ...addrs] = await ethers.getSigners();

    const MintableERC20 = await ethers.getContractFactory('MintableERC20');
    const HOPEMockToken = await MintableERC20.deploy('HOPE', 'HOPE', 18);
    console.log('MintableERC20 HOPE deploy address: ', HOPEMockToken.address);

    // HOPEPriceFeed
    const HOPEPriceFeed = await ethers.getContractFactory('HOPEPriceFeed');
    const priceFeed = await HOPEPriceFeed.deploy(ETHMaskAddress, ETHMaskAddress, HOPEMockToken.address, K);
    console.log('HOPEPriceFeed deploy address: ', priceFeed.address);

    const MockAggregator = await ethers.getContractFactory('MockAggregator');
    const ETHMockAggregator = await MockAggregator.deploy(ETHPrice);
    await ETHMockAggregator.addOperator(addr1.address);
    console.log('ETHMockAggregator deploy address: ', ETHMockAggregator.address);
    const BTCMockAggregator = await MockAggregator.deploy(BTCPrice);
    await BTCMockAggregator.addOperator(addr1.address);
    console.log('BTCMockAggregator deploy address: ', BTCMockAggregator.address);
    ETHMockAggregatorAddress = ETHMockAggregator.address;
    BTCMockAggregatorAddress = BTCMockAggregator.address;
    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    await priceFeed.connect(owner).setReserveTokens(tokens, sources, factors)
    // mint HOPE
    await HOPEMockToken.connect(owner)['mint(uint256)'](HOPETotalSupply);

    // HopeAggregator
    const HopeAggregator = await ethers.getContractFactory('HopeAggregator');
    const hopeAggregator = await HopeAggregator.deploy(decimals, description);
    console.log('HopeAggregator deploy address: ', hopeAggregator.address);

    // HopeAutomation
    const HopeAutomation = await ethers.getContractFactory('HopeAutomation');
    const hopeAutomation = await HopeAutomation.deploy(priceFeed.address, hopeAggregator.address, heartbeat, threshold);
    console.log('HopeAutomation deploy address: ', hopeAutomation.address);

    // update transmitter
    await hopeAggregator.connect(owner).updateTransmitter(hopeAutomation.address);

    targetPrice = HOPETotalSupply.mul(K)
      .div(parseUnits('1', 20))
      .mul(ETHFactor)
      .mul(ETHPrice)
      .add(HOPETotalSupply.mul(K).div(parseUnits('1', 20)).mul(BTCPrice))
      .div(HOPETotalSupply);

    return {
      owner,
      addr1,
      HOPEMockToken,
      ETHMockAggregator,
      BTCMockAggregator,
      priceFeed,
      hopeAggregator,
      hopeAutomation,
    };
  }

  it('Owner set heartbeat', async () => {
    const { owner, addr1, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.heartbeat()).to.be.eq(heartbeat);
    let newHeartbeat = 7200;
    await hopeAutomation.setHeartbeat(newHeartbeat)
    expect(await hopeAutomation.heartbeat()).to.be.eq(newHeartbeat);
  });

  it('A non-owner user tries to set heartbeat', async () => {
    const { owner, addr1, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.heartbeat()).to.be.eq(heartbeat);
    await expect(hopeAutomation.connect(addr1).setHeartbeat(0)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Owner set deviationThreshold', async () => {
    const { owner, addr1, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.deviationThreshold()).to.be.eq(threshold);
    let newThreshold = 10;
    await hopeAutomation.setDeviationThreshold(newThreshold)
    expect(await hopeAutomation.deviationThreshold()).to.be.eq(newThreshold);
  });

  it('A non-owner user tries to set deviationThreshold', async () => {
    const { owner, addr1, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.deviationThreshold()).to.be.eq(threshold);
    await expect(hopeAutomation.connect(addr1).setDeviationThreshold(10)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Owner set priceFeed', async () => {
    const { owner, addr1, priceFeed, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.priceFeed()).to.be.eq(priceFeed.address);
    await hopeAutomation.setHOPEPriceFeed(ZERO_ADDRESS)
    expect(await hopeAutomation.priceFeed()).to.be.eq(ZERO_ADDRESS);
  });

  it('A non-owner user tries to set priceFeed', async () => {
    const { owner, addr1, priceFeed, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.priceFeed()).to.be.eq(priceFeed.address);
    await expect(hopeAutomation.connect(addr1).setHOPEPriceFeed(ZERO_ADDRESS)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Owner set aggregator', async () => {
    const { owner, addr1, hopeAggregator, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.aggregator()).to.be.eq(hopeAggregator.address);
    await hopeAutomation.setAggregator(ZERO_ADDRESS)
    expect(await hopeAutomation.aggregator()).to.be.eq(ZERO_ADDRESS);
  });

  it('A non-owner user tries to set aggregator', async () => {
    const { owner, addr1, hopeAggregator, hopeAutomation } = await loadFixture(deployTestFixture);

    expect(await hopeAutomation.aggregator()).to.be.eq(hopeAggregator.address);
    await expect(hopeAutomation.connect(addr1).setAggregator(ZERO_ADDRESS)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('The status returned by the checkUpkeep, and the latest price of HOPE from Aggregator', async () => {
    const { owner, addr1, ETHMockAggregator, BTCMockAggregator, priceFeed, hopeAggregator, hopeAutomation } = await loadFixture(deployTestFixture);
    expect(await priceFeed.latestAnswer()).to.be.eq(targetPrice.toBigInt());
    expect(await hopeAutomation.checkUpkeep('0x00')).to.deep.eq([true, '0x']);
    await hopeAutomation.performUpkeep('0x00');
    expect(await hopeAggregator.latestAnswer()).to.be.eq(targetPrice.toBigInt());
    
    // test heartbeat
    expect(await hopeAutomation.checkUpkeep('0x00')).to.deep.eq([false, '0x']);
    await hre.ethers.provider.send('evm_increaseTime', [heartbeat]);
    await hre.ethers.provider.send('evm_mine', []);

    expect(await priceFeed.latestAnswer()).to.be.eq(targetPrice.toBigInt());
    expect(await hopeAutomation.checkUpkeep('0x00')).to.deep.eq([true, '0x']);
    await hopeAutomation.performUpkeep('0x00');
    expect(await hopeAggregator.latestAnswer()).to.be.eq(targetPrice.toBigInt());
    
    // test deviationThreshold
    expect(await hopeAutomation.checkUpkeep('0x00')).to.deep.eq([false, '0x']);
    let newETHPrice = parseUnits('4000', 8);
    let newBTCPrice = parseUnits('60000', 8);
    await ETHMockAggregator.connect(addr1).setLatestAnswer(newETHPrice);
    await BTCMockAggregator.connect(addr1).setLatestAnswer(newBTCPrice);
    expect(await priceFeed.getReservePrice(ETHMaskAddress)).to.be.eq(newETHPrice);
    expect(await priceFeed.getReservePrice(BTCMaskAddress)).to.be.eq(newBTCPrice);

    expect(await priceFeed.latestAnswer()).to.be.eq(parseUnits('1', 8));
    expect(await hopeAutomation.checkUpkeep('0x00')).to.deep.eq([true, '0x']);
    await hopeAutomation.performUpkeep('0x00');
    expect(await hopeAggregator.latestAnswer()).to.be.eq(parseUnits('1', 8));
  })
});
