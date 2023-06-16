import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, ZERO_ADDRESS, ProtocolErrors } from '../helpers/constants';

describe('HopeFallbackOracle', () => {
  const role = '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929';

  async function deployTestFixture() {
    const [owner, addr1, ...addrs] = await ethers.getSigners();

    const MintableERC20 = await ethers.getContractFactory('MintableERC20');
    const mockToken = await MintableERC20.deploy('Mock', 'Mock', 18);
    console.log('MintableERC20 deploy address: ', mockToken.address);

    const MockAggregator = await ethers.getContractFactory('MockAggregator');
    const CRVPrice = MOCK_CHAINLINK_AGGREGATORS_PRICES.CRV;
    const CRVMockAggregator = await MockAggregator.deploy(CRVPrice);
    console.log('CRVMockAggregator deploy address: ', CRVMockAggregator.address);
    const ZeroMockAggregator = await MockAggregator.deploy(0);
    console.log('ZeroMockAggregator deploy address: ', ZeroMockAggregator.address);

    const HopeFallbackOracle = await ethers.getContractFactory('HopeFallbackOracle');
    const hopeFallbackOracle = await HopeFallbackOracle.deploy([], [], ZERO_ADDRESS, parseUnits('1', '8'));
    console.log('HopeFallbackOracle deploy address: ', hopeFallbackOracle.address);
    await hopeFallbackOracle.connect(owner).addOperator(addr1.address);

    return {
      owner,
      addr1,
      addrs,
      mockToken,
      CRVPrice,
      CRVMockAggregator,
      ZeroMockAggregator,
      hopeFallbackOracle,
    };
  }

  it('Owner add operator', async () => {
    const { owner, addr1, hopeFallbackOracle } = await loadFixture(deployTestFixture);
    expect(await hopeFallbackOracle.isOperator(owner.address)).to.be.eq(false);
    await hopeFallbackOracle.connect(owner).addOperator(owner.address);
    expect(await hopeFallbackOracle.isOperator(owner.address)).to.be.eq(true);
  });

  it('Owner add address 0x00 as operator', async () => {
    const { owner, addr1, hopeFallbackOracle } = await loadFixture(deployTestFixture);

    await expect(hopeFallbackOracle.connect(owner).addOperator(ZERO_ADDRESS)).to.be.revertedWith(
      ProtocolErrors.ZERO_ADDRESS_NOT_VALID
    );
  });

  it('A non-owner user tries to add operator', async () => {
    const { owner, addr1, hopeFallbackOracle } = await loadFixture(deployTestFixture);
    expect(await hopeFallbackOracle.isOperator(owner.address)).to.be.eq(false);
    await expect(hopeFallbackOracle.connect(addr1).addOperator(owner.address)).to.be.revertedWith(
      `Ownable: caller is not the owner`
    );
    expect(await hopeFallbackOracle.isOperator(owner.address)).to.be.eq(false);
  });

  it('Owner remove operator', async () => {
    const { owner, addr1, hopeFallbackOracle } = await loadFixture(deployTestFixture);
    expect(await hopeFallbackOracle.isOperator(addr1.address)).to.be.eq(true);
    await hopeFallbackOracle.connect(owner).removeOperator(addr1.address);
    expect(await hopeFallbackOracle.isOperator(addr1.address)).to.be.eq(false);
  });

  it('Owner remove address 0x00 as operator', async () => {
    const { owner, addr1, hopeFallbackOracle } = await loadFixture(deployTestFixture);

    await expect(hopeFallbackOracle.connect(owner).removeOperator(ZERO_ADDRESS)).to.be.revertedWith(
      ProtocolErrors.ZERO_ADDRESS_NOT_VALID
    );
  });

  it('A non-owner user tries to remove operator', async () => {
    const { owner, addr1, hopeFallbackOracle } = await loadFixture(deployTestFixture);
    expect(await hopeFallbackOracle.isOperator(addr1.address)).to.be.eq(true);
    await expect(hopeFallbackOracle.connect(addr1).removeOperator(addr1.address)).to.be.revertedWith(
      `Ownable: caller is not the owner`
    );
    expect(await hopeFallbackOracle.isOperator(addr1.address)).to.be.eq(true);
  });

  it('Operator set a new asset source', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, hopeFallbackOracle } = await loadFixture(
      deployTestFixture
    );

    // Asset has no source
    expect(await hopeFallbackOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);

    // Add asset source
    expect(await hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeFallbackOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);

    const sourcesPrices = await (
      await hopeFallbackOracle.getAssetsPrices([mockToken.address])
    ).map((x) => x.toString());
    expect(await hopeFallbackOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);
    expect(await hopeFallbackOracle.getAssetPrice(mockToken.address)).to.be.eq(CRVPrice);
    expect(sourcesPrices).to.eql([CRVPrice]);
  });

  it('Operator update an existing asset source', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, ZeroMockAggregator, hopeFallbackOracle } =
      await loadFixture(deployTestFixture);

    // Add asset source
    expect(await hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeFallbackOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);
    expect(await hopeFallbackOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);
    expect(await hopeFallbackOracle.getAssetPrice(mockToken.address)).to.be.eq(CRVPrice);

    // Update asset source
    expect(await hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [ZeroMockAggregator.address]))
      .to.emit(hopeFallbackOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, ZeroMockAggregator.address);
    expect(await hopeFallbackOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZeroMockAggregator.address);
    expect(await hopeFallbackOracle.getAssetPrice(mockToken.address)).to.be.eq(0);
  });

  it('Operator tries to set a new asset source with wrong input params (revert expected)', async () => {
    const { owner, addr1, mockToken, hopeFallbackOracle } = await loadFixture(deployTestFixture);

    await expect(hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [])).to.be.revertedWith(
      ProtocolErrors.INCONSISTENT_PARAMS_LENGTH
    );
  });

  it('Get price of BASE_CURRENCY asset', async () => {
    const { hopeFallbackOracle } = await loadFixture(deployTestFixture);

    // Check returns the fixed price BASE_CURRENCY_UNIT
    expect(await hopeFallbackOracle.getAssetPrice(await hopeFallbackOracle.BASE_CURRENCY())).to.be.eq(
      await hopeFallbackOracle.BASE_CURRENCY_UNIT()
    );
  });

  it('A non-operator user tries to set a new asset source (revert expected)', async () => {
    const { owner, addr1, mockToken, CRVMockAggregator, hopeFallbackOracle } = await loadFixture(deployTestFixture);

    await expect(
      hopeFallbackOracle.connect(owner).setAssetSources([mockToken.address], [CRVMockAggregator.address])
    ).to.be.revertedWith(`AccessControl: account ${owner.address.toLowerCase()} is missing role ${role}`);
  });

  it('Get price of asset with no asset source', async () => {
    const { mockToken, hopeFallbackOracle } = await loadFixture(deployTestFixture);

    // Asset has no source
    expect(await hopeFallbackOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);

    await expect(hopeFallbackOracle.getAssetPrice(mockToken.address)).to.be.revertedWithoutReason();
    await expect(hopeFallbackOracle.getAssetsPrices([mockToken.address])).to.be.revertedWithoutReason();
  });
});
