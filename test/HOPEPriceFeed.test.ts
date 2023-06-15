import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, ZERO_ADDRESS, ProtocolErrors } from '../helpers/constants';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
declare var hre: HardhatRuntimeEnvironment;

describe('HOPEPriceFeed', () => {
  let ETHMockAggregatorAddress: string;
  let BTCMockAggregatorAddress: string;
  let CRVMockAggregatorAddress: string;
  let ETHPrice = MOCK_CHAINLINK_AGGREGATORS_PRICES.ETH;
  let BTCPrice = MOCK_CHAINLINK_AGGREGATORS_PRICES.WBTC;
  let CRVPrice = MOCK_CHAINLINK_AGGREGATORS_PRICES.CRV;
  let ETHFactor = 10;
  let BTCFactor = 1;
  let CRVFactor = 100;
  let HOPETotalSupply = parseUnits('20000000000', 18);
  const K = 1080180484347501;
  const ETHMaskAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const BTCMaskAddress = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';

  async function deployTestFixture() {
    const [owner, addr1, ...addrs] = await ethers.getSigners();

    const MintableERC20 = await ethers.getContractFactory('MintableERC20');
    const CRVMockToken = await MintableERC20.deploy('CRV', 'CRV', 18);
    console.log('MintableERC20 CRV deploy address: ', CRVMockToken.address);
    const HOPEMockToken = await MintableERC20.deploy('HOPE', 'HOPE', 18);
    console.log('MintableERC20 HOPE deploy address: ', HOPEMockToken.address);

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
    const CRVMockAggregator = await MockAggregator.deploy(CRVPrice);
    console.log('CRVMockAggregator deploy address: ', CRVMockAggregator.address);
    ETHMockAggregatorAddress = ETHMockAggregator.address;
    BTCMockAggregatorAddress = BTCMockAggregator.address;
    CRVMockAggregatorAddress = CRVMockAggregator.address;

    return {
      owner,
      addr1,
      CRVMockToken,
      HOPEMockToken,
      ETHMockAggregator,
      BTCMockAggregator,
      priceFeed,
    };
  }

  it('Owner set reserve tokens', async () => {
    const { owner, addr1, priceFeed } = await loadFixture(deployTestFixture);

    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    expect(await priceFeed.connect(owner).setReserveTokens(tokens, sources, factors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(tokens, sources, factors);

    expect(await priceFeed.getReserveTokens()).to.deep.eq(tokens);

    expect(await priceFeed.getReserveTokenConfig(ETHMaskAddress)).to.deep.eq([
      ETHMockAggregatorAddress,
      ETHFactor,
      true,
    ]);
  });

  it('A non-owner user tries to set reserve tokens', async () => {
    const { owner, addr1, priceFeed } = await loadFixture(deployTestFixture);

    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    await expect(priceFeed.connect(addr1).setReserveTokens(tokens, sources, factors)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );

    expect(await priceFeed.getReserveTokens()).to.deep.eq([]);
  });

  it('Owner add reserve tokens', async () => {
    const { owner, addr1, CRVMockToken, priceFeed } = await loadFixture(deployTestFixture);

    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    expect(await priceFeed.connect(owner).setReserveTokens(tokens, sources, factors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(tokens, sources, factors);

    expect(await priceFeed.getReserveTokens()).to.deep.eq(tokens);

    let addedTokens = [CRVMockToken.address];
    let addedSources = [CRVMockAggregatorAddress];
    let addedFactors = [CRVFactor];
    expect(await priceFeed.connect(owner).setReserveTokens(addedTokens, addedSources, addedFactors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(addedTokens, addedSources, addedFactors);

    expect(await priceFeed.getReserveTokens()).to.deep.eq(tokens.concat(addedTokens));

    expect(await priceFeed.getReserveTokenConfig(CRVMockToken.address)).to.deep.eq([
      CRVMockAggregatorAddress,
      CRVFactor,
      true,
    ]);
  });

  it('Owner del reserve tokens', async () => {
    const { owner, addr1, priceFeed } = await loadFixture(deployTestFixture);

    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    expect(await priceFeed.connect(owner).setReserveTokens(tokens, sources, factors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(tokens, sources, factors);

    expect(await priceFeed.getReserveTokens()).to.deep.eq(tokens);
    expect(await priceFeed.getReserveTokenConfig(ETHMaskAddress)).to.deep.eq([
      ETHMockAggregatorAddress,
      ETHFactor,
      true,
    ]);

    let delTokens = [ETHMaskAddress];
    let delSources = [ETHMockAggregatorAddress];
    let delFactors = [0];
    expect(await priceFeed.connect(owner).setReserveTokens(delTokens, delSources, delFactors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(delTokens, delSources, delFactors);

    expect(await priceFeed.getReserveTokens()).to.deep.eq(tokens);

    expect(await priceFeed.getReserveTokenConfig(ETHMaskAddress)).to.deep.eq([ETHMockAggregatorAddress, 0, true]);
  });

  it('Get HOPE total supply', async () => {
    const { owner, addr1, HOPEMockToken, priceFeed } = await loadFixture(deployTestFixture);

    await HOPEMockToken.connect(owner)['mint(uint256)'](HOPETotalSupply);
    expect(await priceFeed.getHOPETotalSupply()).to.be.eq(HOPETotalSupply);
  });

  it('Get reserve price', async () => {
    const { owner, addr1, priceFeed } = await loadFixture(deployTestFixture);

    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    expect(await priceFeed.connect(owner).setReserveTokens(tokens, sources, factors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(tokens, sources, factors);

    expect(await priceFeed.getReservePrice(ETHMaskAddress)).to.be.eq(ETHPrice);
    expect(await priceFeed.getReservePrice(BTCMaskAddress)).to.be.eq(BTCPrice);
  });

  it('Get HOPE price', async () => {
    const { owner, addr1, HOPEMockToken, priceFeed } = await loadFixture(deployTestFixture);

    await HOPEMockToken.connect(owner)['mint(uint256)'](HOPETotalSupply);

    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    expect(await priceFeed.connect(owner).setReserveTokens(tokens, sources, factors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(tokens, sources, factors);

    // target Price
    let targetPrice = HOPETotalSupply.mul(K)
      .div(parseUnits('1', 20))
      .mul(ETHFactor)
      .mul(ETHPrice)
      .add(HOPETotalSupply.mul(K).div(parseUnits('1', 20)).mul(BTCPrice))
      .div(HOPETotalSupply);
    console.log('targetPrice: ', targetPrice.toString());

    expect(await priceFeed.latestAnswer()).to.be.eq(targetPrice.toBigInt());
  });

  it('Get the price of HOPE when the price is greater than 1', async () => {
    const { owner, addr1, HOPEMockToken, ETHMockAggregator, BTCMockAggregator, priceFeed } = await loadFixture(
      deployTestFixture
    );

    await HOPEMockToken.connect(owner)['mint(uint256)'](HOPETotalSupply);

    // setReserveTokens
    let tokens = [ETHMaskAddress, BTCMaskAddress];
    let sources = [ETHMockAggregatorAddress, BTCMockAggregatorAddress];
    let factors = [ETHFactor, BTCFactor];
    expect(await priceFeed.connect(owner).setReserveTokens(tokens, sources, factors))
      .to.emit(priceFeed, 'ReserveUpdate')
      .withArgs(tokens, sources, factors);

    // change reserve price
    expect(await priceFeed.getReservePrice(ETHMaskAddress)).to.be.eq(ETHPrice);
    expect(await priceFeed.getReservePrice(BTCMaskAddress)).to.be.eq(BTCPrice);
    let newETHPrice = parseUnits('4000', 8);
    let newBTCPrice = parseUnits('60000', 8);
    await ETHMockAggregator.connect(addr1).setLatestAnswer(newETHPrice);
    await BTCMockAggregator.connect(addr1).setLatestAnswer(newBTCPrice);
    expect(await priceFeed.getReservePrice(ETHMaskAddress)).to.be.eq(newETHPrice);
    expect(await priceFeed.getReservePrice(BTCMaskAddress)).to.be.eq(newBTCPrice);

    expect(await priceFeed.latestAnswer()).to.be.eq(parseUnits('1', 8));
  });
});
