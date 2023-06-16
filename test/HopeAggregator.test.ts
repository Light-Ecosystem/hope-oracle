import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, ZERO_ADDRESS, ProtocolErrors } from '../helpers/constants';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
declare var hre: HardhatRuntimeEnvironment;

describe('HopeAggregator', () => {
  let decimals = 8;
  let description = 'HOPE/USD';
  let HOPEPrice1 = 59000045;
  let HOPEPrice2 = 100000000;
  let role = '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929';

  async function deployTestFixture() {
    const [owner, addr1, ...addrs] = await ethers.getSigners();

    const HopeAggregator = await ethers.getContractFactory('HopeAggregator');
    const hopeAggregator = await HopeAggregator.deploy(decimals, description);
    console.log('HopeAggregator deploy address: ', hopeAggregator.address);
    await hopeAggregator.addOperator(addr1.address);

    return {
      owner,
      addr1,
      hopeAggregator,
    };
  }

  it('Base informations', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);

    // decimals
    expect(await hopeAggregator.decimals()).to.be.eq(decimals);
    // description
    expect(await hopeAggregator.description()).to.be.eq(description);
    // isOperator
    expect(await hopeAggregator.isOperator(owner.address)).to.be.eq(false);
    expect(await hopeAggregator.isOperator(addr1.address)).to.be.eq(true);
  });

  it('Owner add operator', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);
    expect(await hopeAggregator.isOperator(owner.address)).to.be.eq(false);
    await hopeAggregator.connect(owner).addOperator(owner.address);
    expect(await hopeAggregator.isOperator(owner.address)).to.be.eq(true);
  });

  it('Owner add address 0x00 as operator', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);

    await expect(hopeAggregator.connect(owner).addOperator(ZERO_ADDRESS)).to.be.revertedWith(
      ProtocolErrors.ZERO_ADDRESS_NOT_VALID
    );
  });

  it('A non-owner user tries to add operator', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);
    expect(await hopeAggregator.isOperator(owner.address)).to.be.eq(false);
    await expect(hopeAggregator.connect(addr1).addOperator(owner.address)).to.be.revertedWith(
      `Ownable: caller is not the owner`
    );
    expect(await hopeAggregator.isOperator(owner.address)).to.be.eq(false);
  });

  it('Owner remove operator', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);
    expect(await hopeAggregator.isOperator(addr1.address)).to.be.eq(true);
    await hopeAggregator.connect(owner).removeOperator(addr1.address);
    expect(await hopeAggregator.isOperator(addr1.address)).to.be.eq(false);
  });

  it('Owner remove address 0x00 as operator', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);

    await expect(hopeAggregator.connect(owner).removeOperator(ZERO_ADDRESS)).to.be.revertedWith(
      ProtocolErrors.ZERO_ADDRESS_NOT_VALID
    );
  });

  it('A non-owner user tries to remove operator', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);
    expect(await hopeAggregator.isOperator(addr1.address)).to.be.eq(true);
    await expect(hopeAggregator.connect(addr1).removeOperator(addr1.address)).to.be.revertedWith(
      `Ownable: caller is not the owner`
    );
    expect(await hopeAggregator.isOperator(addr1.address)).to.be.eq(true);
  });

  it('A non-operator user tries to transmit', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);

    // transmit
    await expect(hopeAggregator.connect(owner).transmit(HOPEPrice1)).to.be.revertedWith(
      `AccessControl: account ${owner.address.toLowerCase()} is missing role ${role}`
    );
  });

  it('Price submitted once by transmitter', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);

    // transmit
    const transmitTime1 = Date.parse(new Date().toString()) / 1000;
    expect(await hopeAggregator.connect(addr1).transmit(HOPEPrice1))
      .to.emit(hopeAggregator, 'AnswerUpdated')
      .withArgs(HOPEPrice1, 1, transmitTime1);

    // lastestAnswer
    expect(await hopeAggregator.latestAnswer()).to.be.eq(HOPEPrice1);

    // latestTimestamp
    let latestTimestamp = await hopeAggregator.latestTimestamp();
    expect(Math.abs(latestTimestamp - transmitTime1)).to.be.lessThanOrEqual(12);

    // latestRound
    expect(await hopeAggregator.latestRound()).to.be.eq(1);

    // getAnswer
    expect(await hopeAggregator.getAnswer(1)).to.be.eq(HOPEPrice1);

    // getTimestamp
    latestTimestamp = await hopeAggregator.getTimestamp(1);
    expect(Math.abs(latestTimestamp - transmitTime1)).to.be.lessThanOrEqual(12);

    // getRoundData
    const roundData = await hopeAggregator.getRoundData(1);
    // console.log(`roundData: ${roundData}`);

    // getLatestRoundData
    const latestRoundData = await hopeAggregator.latestRoundData();
    // console.log(`latestRoundData: ${latestRoundData}`);

    expect(roundData).to.be.deep.eq(latestRoundData);
  });

  it('Price submitted twice by transmitter', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);

    // transmit --> 1
    const transmitTime1 = Date.parse(new Date().toString()) / 1000;
    expect(await hopeAggregator.connect(addr1).transmit(HOPEPrice1))
      .to.emit(hopeAggregator, 'AnswerUpdated')
      .withArgs(HOPEPrice1, 1, transmitTime1);

    // transmit --> 2
    const forwardTime = 1000;
    await hre.ethers.provider.send('evm_increaseTime', [forwardTime]);
    await hre.ethers.provider.send('evm_mine', []);
    const transmitTime2 = transmitTime1 + forwardTime;
    expect(await hopeAggregator.connect(addr1).transmit(HOPEPrice2))
      .to.emit(hopeAggregator, 'AnswerUpdated')
      .withArgs(HOPEPrice2, 2, transmitTime2);

    // lastestAnswer
    expect(await hopeAggregator.latestAnswer()).to.be.eq(HOPEPrice2);

    // latestTimestamp
    let latestTimestamp = await hopeAggregator.latestTimestamp();
    expect(Math.abs(latestTimestamp - transmitTime2)).to.be.lessThanOrEqual(12);

    // latestRound
    expect(await hopeAggregator.latestRound()).to.be.eq(2);

    // getAnswer
    expect(await hopeAggregator.getAnswer(2)).to.be.eq(HOPEPrice2);

    // getTimestamp
    latestTimestamp = await hopeAggregator.getTimestamp(2);
    expect(Math.abs(latestTimestamp - transmitTime2)).to.be.lessThanOrEqual(12);

    // getRoundData
    const roundData = await hopeAggregator.getRoundData(2);
    // console.log(`roundData: ${roundData}`);

    // getLatestRoundData
    const latestRoundData = await hopeAggregator.latestRoundData();
    // console.log(`latestRoundData: ${latestRoundData}`);

    expect(roundData).to.be.deep.eq(latestRoundData);
  });
});
