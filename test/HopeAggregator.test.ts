import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, ZERO_ADDRESS, ProtocolErrors } from '../helpers/constants';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
declare var hre: HardhatRuntimeEnvironment;

describe('HopeAggregator', () => {
  let decimals = 8;
  let description = 'HOPE/USD';
  let HOPEPrice1 = 59000045;
  let HOPEPrice2 = 100000000;

  async function deployTestFixture() {
    const [owner, addr1, ...addrs] = await ethers.getSigners();

    const HopeAggregator = await ethers.getContractFactory('HopeAggregator');
    const hopeAggregator = await HopeAggregator.deploy(decimals, description);
    console.log('HopeAggregator deploy address: ', hopeAggregator.address);

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
  });

  it('Owner update the transmitter address', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);
    // no transmitter address
    expect(await hopeAggregator.transmitter()).to.be.eq(ZERO_ADDRESS);

    // Update transmitter address
    expect(await hopeAggregator.connect(owner).updateTransmitter(addr1.address))
      .to.emit(hopeAggregator, 'TransmitterUpdated')
      .withArgs(addr1.address);

    // check transmitter address
    expect(await hopeAggregator.transmitter()).to.be.eq(addr1.address);
  });

  it('A non-owner user tries to update the transmitter', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);
    // no transmitter address
    expect(await hopeAggregator.transmitter()).to.be.eq(ZERO_ADDRESS);

    // Update transmitter address
    await expect(hopeAggregator.connect(addr1).updateTransmitter(addr1.address)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );

    // check transmitter address
    expect(await hopeAggregator.transmitter()).to.be.eq(ZERO_ADDRESS);
  });

  it('Price submitted once by transmitter', async () => {
    const { owner, addr1, hopeAggregator } = await loadFixture(deployTestFixture);
    // no transmitter address
    expect(await hopeAggregator.transmitter()).to.be.eq(ZERO_ADDRESS);

    // Update transmitter address
    expect(await hopeAggregator.connect(owner).updateTransmitter(addr1.address))
      .to.emit(hopeAggregator, 'TransmitterUpdated')
      .withArgs(addr1.address);

    // transmit
    const transmitTime1 = Date.parse(new Date().toString()) / 1000;
    expect(await hopeAggregator.connect(addr1).transmit(HOPEPrice1))
      .to.emit(hopeAggregator, 'AnswerUpdated')
      .withArgs(HOPEPrice1, 1, transmitTime1);

    // lastestAnswer
    expect(await hopeAggregator.latestAnswer()).to.be.eq(HOPEPrice1);

    // latestTimestamp
    let latestTimestamp = await hopeAggregator.latestTimestamp();
    expect(Math.abs(latestTimestamp - transmitTime1)).to.be.lessThanOrEqual(10);

    // latestRound
    expect(await hopeAggregator.latestRound()).to.be.eq(1);

    // getAnswer
    expect(await hopeAggregator.getAnswer(1)).to.be.eq(HOPEPrice1);

    // getTimestamp
    latestTimestamp = await hopeAggregator.getTimestamp(1);
    expect(Math.abs(latestTimestamp - transmitTime1)).to.be.lessThanOrEqual(10);

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
    // no transmitter address
    expect(await hopeAggregator.transmitter()).to.be.eq(ZERO_ADDRESS);

    // Update transmitter address
    expect(await hopeAggregator.connect(owner).updateTransmitter(addr1.address))
      .to.emit(hopeAggregator, 'TransmitterUpdated')
      .withArgs(addr1.address);

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
    expect(Math.abs(latestTimestamp - transmitTime2)).to.be.lessThanOrEqual(10);

    // latestRound
    expect(await hopeAggregator.latestRound()).to.be.eq(2);

    // getAnswer
    expect(await hopeAggregator.getAnswer(2)).to.be.eq(HOPEPrice2);

    // getTimestamp
    latestTimestamp = await hopeAggregator.getTimestamp(2);
    expect(Math.abs(latestTimestamp - transmitTime2)).to.be.lessThanOrEqual(10);

    // getRoundData
    const roundData = await hopeAggregator.getRoundData(2);
    // console.log(`roundData: ${roundData}`);

    // getLatestRoundData
    const latestRoundData = await hopeAggregator.latestRoundData();
    // console.log(`latestRoundData: ${latestRoundData}`);

    expect(roundData).to.be.deep.eq(latestRoundData);
  });
});
