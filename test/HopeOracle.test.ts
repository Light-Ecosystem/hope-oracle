import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, ZERO_ADDRESS, ProtocolErrors } from '../helpers/constants';

describe('HopeOracle', () => {
  let fallbackPrice = parseUnits('1', 18);
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
    const FallbackMockAggregator = await MockAggregator.deploy(fallbackPrice);
    console.log('FallbackMockAggregator deploy address: ', FallbackMockAggregator.address);

    const HopeOracle = await ethers.getContractFactory('HopeOracle');
    const hopeOracle = await HopeOracle.deploy([], [], ZERO_ADDRESS, ZERO_ADDRESS, parseUnits('1', '8'));
    console.log('HopeOracle deploy address: ', hopeOracle.address);
    await hopeOracle.connect(owner).addOperator(addr1.address);

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
      FallbackMockAggregator,
      hopeOracle,
      hopeFallbackOracle,
    };
  }

  it('Owner add operator', async () => {
    const { owner, addr1, hopeOracle } = await loadFixture(deployTestFixture);
    expect(await hopeOracle.isOperator(owner.address)).to.be.eq(false);
    await hopeOracle.connect(owner).addOperator(owner.address);
    expect(await hopeOracle.isOperator(owner.address)).to.be.eq(true);
  });

  it('Owner add address 0x00 as operator', async () => {
    const { owner, addr1, hopeOracle } = await loadFixture(deployTestFixture);

    await expect(hopeOracle.connect(owner).addOperator(ZERO_ADDRESS)).to.be.revertedWith(
      ProtocolErrors.ZERO_ADDRESS_NOT_VALID
    );
  });

  it('A non-owner user tries to add operator', async () => {
    const { owner, addr1, hopeOracle } = await loadFixture(deployTestFixture);
    expect(await hopeOracle.isOperator(owner.address)).to.be.eq(false);
    await expect(hopeOracle.connect(addr1).addOperator(owner.address)).to.be.revertedWith(
      `Ownable: caller is not the owner`
    );
    expect(await hopeOracle.isOperator(owner.address)).to.be.eq(false);
  });

  it('Owner remove operator', async () => {
    const { owner, addr1, hopeOracle } = await loadFixture(deployTestFixture);
    expect(await hopeOracle.isOperator(addr1.address)).to.be.eq(true);
    await hopeOracle.connect(owner).removeOperator(addr1.address);
    expect(await hopeOracle.isOperator(addr1.address)).to.be.eq(false);
  });

  it('Owner remove address 0x00 as operator', async () => {
    const { owner, addr1, hopeOracle } = await loadFixture(deployTestFixture);

    await expect(hopeOracle.connect(owner).removeOperator(ZERO_ADDRESS)).to.be.revertedWith(
      ProtocolErrors.ZERO_ADDRESS_NOT_VALID
    );
  });

  it('A non-owner user tries to remove operator', async () => {
    const { owner, addr1, hopeOracle } = await loadFixture(deployTestFixture);
    expect(await hopeOracle.isOperator(addr1.address)).to.be.eq(true);
    await expect(hopeOracle.connect(addr1).removeOperator(addr1.address)).to.be.revertedWith(
      `Ownable: caller is not the owner`
    );
    expect(await hopeOracle.isOperator(addr1.address)).to.be.eq(true);
  });

  it('Operator set fallback oracle', async () => {
    const { owner, addr1, hopeOracle, hopeFallbackOracle } = await loadFixture(deployTestFixture);

    // no fallback oracle
    expect(await hopeOracle.getFallbackOracle()).to.be.eq(ZERO_ADDRESS);

    // Set fallback oracle
    await hopeOracle.connect(addr1).setFallbackOracle(hopeFallbackOracle.address);

    expect(await hopeOracle.getFallbackOracle()).to.be.eq(hopeFallbackOracle.address);
  });

  it('A non-operator user tries to set fallback oracle', async () => {
    const { owner, addr1, hopeOracle, hopeFallbackOracle } = await loadFixture(deployTestFixture);

    // no fallback oracle
    expect(await hopeOracle.getFallbackOracle()).to.be.eq(ZERO_ADDRESS);

    // Set fallback oracle
    await expect(hopeOracle.connect(owner).setFallbackOracle(hopeFallbackOracle.address)).to.be.revertedWith(
      `AccessControl: account ${owner.address.toLowerCase()} is missing role ${role}`
    );

    expect(await hopeOracle.getFallbackOracle()).to.be.eq(ZERO_ADDRESS);
  });

  it('Operator activate failover of asset', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, hopeOracle } = await loadFixture(deployTestFixture);

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);

    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(false);

    // activate asset failover
    await hopeOracle.connect(addr1).activateFailover(mockToken.address);

    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(true);

    // reactivate asset failover
    await expect(hopeOracle.connect(addr1).activateFailover(mockToken.address)).to.be.rejectedWith(
      ProtocolErrors.FAILOVER_ALREADY_ACTIVE
    );
  });

  it('A non-operator user tries to activate failover of asset', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, hopeOracle } = await loadFixture(deployTestFixture);

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);

    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(false);

    // activate asset failover by non-operator
    await expect(hopeOracle.connect(owner).activateFailover(mockToken.address)).to.be.revertedWith(
      `AccessControl: account ${owner.address.toLowerCase()} is missing role ${role}`
    );
    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(false);
  });

  it('Operator deactivate failover of asset', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, hopeOracle } = await loadFixture(deployTestFixture);

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);

    // activate asset failover
    await hopeOracle.connect(addr1).activateFailover(mockToken.address);

    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(true);
    // deactivate asset failover
    expect(await hopeOracle.connect(addr1).deactivateFailover(mockToken.address))
      .to.emit(hopeOracle, 'FailoverDeactivated')
      .withArgs(mockToken.address);
    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(false);

    // redeactivate asset failover
    await expect(hopeOracle.connect(addr1).deactivateFailover(mockToken.address)).to.be.rejectedWith(
      ProtocolErrors.FAILOVER_ALREADY_DEACTIVATED
    );
  });

  it('A non-operator user tries to activate failover of asset', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, hopeOracle } = await loadFixture(deployTestFixture);

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);

    // activate asset failover
    await hopeOracle.connect(addr1).activateFailover(mockToken.address);

    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(true);

    // activate asset failover by non-operator
    await expect(hopeOracle.connect(owner).deactivateFailover(mockToken.address)).to.be.revertedWith(
      `AccessControl: account ${owner.address.toLowerCase()} is missing role ${role}`
    );
    expect(await hopeOracle.getFailoverStatusOfAsset(mockToken.address)).to.be.eq(true);
  });

  it('Operator set a new asset source', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, hopeOracle } = await loadFixture(deployTestFixture);

    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);

    const sourcesPrices = await (await hopeOracle.getAssetsPrices([mockToken.address])).map((x) => x.toString());
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);
    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(CRVPrice);
    expect(sourcesPrices).to.eql([CRVPrice]);
  });

  it('Operator update an existing asset source', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, ZeroMockAggregator, hopeOracle } = await loadFixture(
      deployTestFixture
    );

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);
    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(CRVPrice);

    // Update asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [ZeroMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, ZeroMockAggregator.address);
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZeroMockAggregator.address);
    await expect(hopeOracle.getAssetPrice(mockToken.address)).to.be.revertedWithoutReason();
  });

  it('Operator tries to set a new asset source with wrong input params (revert expected)', async () => {
    const { owner, addr1, mockToken, hopeOracle } = await loadFixture(deployTestFixture);

    await expect(hopeOracle.connect(addr1).setAssetSources([mockToken.address], [])).to.be.revertedWith(
      ProtocolErrors.INCONSISTENT_PARAMS_LENGTH
    );
  });

  it('Get price of BASE_CURRENCY asset', async () => {
    const { hopeOracle } = await loadFixture(deployTestFixture);

    // Check returns the fixed price BASE_CURRENCY_UNIT
    expect(await hopeOracle.getAssetPrice(await hopeOracle.BASE_CURRENCY())).to.be.eq(
      await hopeOracle.BASE_CURRENCY_UNIT()
    );
  });

  it('A non-operator user tries to set a new asset source (revert expected)', async () => {
    const { owner, addr1, mockToken, CRVMockAggregator, hopeOracle } = await loadFixture(deployTestFixture);

    await expect(
      hopeOracle.connect(owner).setAssetSources([mockToken.address], [CRVMockAggregator.address])
    ).to.be.revertedWith(`AccessControl: account ${owner.address.toLowerCase()} is missing role ${role}`);
  });

  it('Get price of BASE_CURRENCY asset with registered asset source for its address', async () => {
    const { owner, addr1, mockToken, CRVPrice, CRVMockAggregator, hopeOracle } = await loadFixture(deployTestFixture);

    // Add asset source for BASE_CURRENCY address
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);

    // Check returns the fixed price BASE_CURRENCY_UNIT
    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(CRVPrice);
  });

  it('Get price of asset with no asset source', async () => {
    const { addr1, mockToken, FallbackMockAggregator, hopeOracle, hopeFallbackOracle } = await loadFixture(
      deployTestFixture
    );
    // Set fallback oracle
    await hopeOracle.connect(addr1).setFallbackOracle(hopeFallbackOracle.address);
    // Register price on FallbackOracle
    expect(
      await hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [FallbackMockAggregator.address])
    )
      .to.emit(hopeFallbackOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, FallbackMockAggregator.address);

    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);

    // Returns 0 price
    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(fallbackPrice);
  });

  it('Get price of asset with 0 price and no fallback price', async () => {
    const { addr1, mockToken, hopeOracle, ZeroMockAggregator, hopeFallbackOracle } = await loadFixture(
      deployTestFixture
    );

    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [ZeroMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, ZeroMockAggregator.address);

    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZeroMockAggregator.address);
    await expect(hopeOracle.getAssetPrice(mockToken.address)).to.be.revertedWithoutReason();
  });

  it('Get price of asset with 0 price but non-zero fallback price', async () => {
    const { addr1, mockToken, hopeOracle, ZeroMockAggregator, hopeFallbackOracle, FallbackMockAggregator } =
      await loadFixture(deployTestFixture);

    // Set fallback oracle
    await hopeOracle.connect(addr1).setFallbackOracle(hopeFallbackOracle.address);
    // Register price on FallbackOracle
    expect(
      await hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [FallbackMockAggregator.address])
    )
      .to.emit(hopeFallbackOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, FallbackMockAggregator.address);

    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);

    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [ZeroMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, ZeroMockAggregator.address);

    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZeroMockAggregator.address);
    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(fallbackPrice);
  });

  it('Get price of asset with failover activated and no fallback price', async () => {
    const { addr1, mockToken, hopeOracle, CRVMockAggregator, hopeFallbackOracle, FallbackMockAggregator } =
      await loadFixture(deployTestFixture);
    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);
    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);

    // activate Failover
    expect(await hopeOracle.connect(addr1).activateFailover(mockToken.address))
      .to.emit(hopeOracle, 'FailoverActivated')
      .withArgs(mockToken.address);

    await expect(hopeOracle.getAssetPrice(mockToken.address)).to.be.revertedWithoutReason();
  });

  it('Get price of asset with failover activated and fallback price', async () => {
    const { addr1, mockToken, hopeOracle, CRVMockAggregator, hopeFallbackOracle, FallbackMockAggregator } =
      await loadFixture(deployTestFixture);

    // Set fallback oracle
    await hopeOracle.connect(addr1).setFallbackOracle(hopeFallbackOracle.address);
    // Register price on FallbackOracle
    expect(
      await hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [FallbackMockAggregator.address])
    )
      .to.emit(hopeFallbackOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, FallbackMockAggregator.address);
    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);
    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);

    // activate Failover
    expect(await hopeOracle.connect(addr1).activateFailover(mockToken.address))
      .to.emit(hopeOracle, 'FailoverActivated')
      .withArgs(mockToken.address);

    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(fallbackPrice);
  });

  it('Get price of asset with failover deactivated and no fallback price', async () => {
    const { addr1, mockToken, CRVPrice, hopeOracle, CRVMockAggregator, hopeFallbackOracle, FallbackMockAggregator } =
      await loadFixture(deployTestFixture);
    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);
    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);

    // activate Failover
    expect(await hopeOracle.connect(addr1).activateFailover(mockToken.address))
      .to.emit(hopeOracle, 'FailoverActivated')
      .withArgs(mockToken.address);

    await expect(hopeOracle.getAssetPrice(mockToken.address)).to.be.revertedWithoutReason();

    // deactivate Failover
    expect(await hopeOracle.connect(addr1).deactivateFailover(mockToken.address))
      .to.emit(hopeOracle, 'FailoverDeactivated')
      .withArgs(mockToken.address);

    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(CRVPrice);
  });

  it('Get price of asset with failover deactivated and fallback price', async () => {
    const { addr1, mockToken, CRVPrice, hopeOracle, CRVMockAggregator, hopeFallbackOracle, FallbackMockAggregator } =
      await loadFixture(deployTestFixture);

    // Set fallback oracle
    await hopeOracle.connect(addr1).setFallbackOracle(hopeFallbackOracle.address);
    // Register price on FallbackOracle
    expect(
      await hopeFallbackOracle.connect(addr1).setAssetSources([mockToken.address], [FallbackMockAggregator.address])
    )
      .to.emit(hopeFallbackOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, FallbackMockAggregator.address);
    // Asset has no source
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(ZERO_ADDRESS);
    // Add asset source
    expect(await hopeOracle.connect(addr1).setAssetSources([mockToken.address], [CRVMockAggregator.address]))
      .to.emit(hopeOracle, 'AssetSourceUpdated')
      .withArgs(mockToken.address, CRVMockAggregator.address);
    expect(await hopeOracle.getSourceOfAsset(mockToken.address)).to.be.eq(CRVMockAggregator.address);

    // activate Failover
    expect(await hopeOracle.connect(addr1).activateFailover(mockToken.address))
      .to.emit(hopeOracle, 'FailoverActivated')
      .withArgs(mockToken.address);

    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(fallbackPrice);

    // deactivate Failover
    expect(await hopeOracle.connect(addr1).deactivateFailover(mockToken.address))
      .to.emit(hopeOracle, 'FailoverDeactivated')
      .withArgs(mockToken.address);

    expect(await hopeOracle.getAssetPrice(mockToken.address)).to.be.eq(CRVPrice);
  });
});
