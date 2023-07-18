import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES } from '../helpers/constants';
import { BigNumber } from 'ethers';

describe('WBTCPriceFeed', () => {
  async function deployTestFixture() {
    const [owner, addr1, ...addrs] = await ethers.getSigners();

    const MockAggregator = await ethers.getContractFactory('MockAggregator');
    const BTCMockAggregator = await MockAggregator.deploy(MOCK_CHAINLINK_AGGREGATORS_PRICES.BTC);
    console.log('BTCMockAggregator deploy address: ', BTCMockAggregator.address);
    const WBTC_BTCMockAggregator = await MockAggregator.deploy(MOCK_CHAINLINK_AGGREGATORS_PRICES.WBTC_BTC);
    console.log('WBTC_BTCMockAggregator deploy address: ', WBTC_BTCMockAggregator.address);

    const WBTCSynchronicityPriceAdapter = await ethers.getContractFactory('WBTCSynchronicityPriceAdapter');
    const wBTCPriceAdapterPegToBase = await WBTCSynchronicityPriceAdapter.deploy(
      BTCMockAggregator.address,
      WBTC_BTCMockAggregator.address,
      8
    );
    console.log('WBTCSynchronicityPriceAdapter deploy address: ', wBTCPriceAdapterPegToBase.address);

    return {
      owner,
      addr1,
      addrs,
      BTCMockAggregator,
      WBTC_BTCMockAggregator,
      wBTCPriceAdapterPegToBase,
    };
  }

  it('Get latest answer', async () => {
    const { owner, BTCMockAggregator, WBTC_BTCMockAggregator, wBTCPriceAdapterPegToBase } = await loadFixture(
      deployTestFixture
    );
    const assetToPegDecimals = await WBTC_BTCMockAggregator.decimals();
    const assetToPegAnswer = BigNumber.from(MOCK_CHAINLINK_AGGREGATORS_PRICES.WBTC_BTC);
    const pegToBaseDecimals = await BTCMockAggregator.decimals();
    const pegToBaseAnswer = BigNumber.from(MOCK_CHAINLINK_AGGREGATORS_PRICES.BTC);
    const DENOMINATOR = ethers.utils.parseUnits('1', assetToPegDecimals + pegToBaseDecimals);
    let answer = assetToPegAnswer
      .mul(pegToBaseAnswer)
      .mul(10 ** 8)
      .div(DENOMINATOR);
    expect(await wBTCPriceAdapterPegToBase.latestAnswer()).to.be.eq(answer);
  });
});
