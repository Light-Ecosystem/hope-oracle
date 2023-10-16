import { Contract, ContractTransaction, Signer } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Receipt } from 'hardhat-deploy/types';
import Bluebird from 'bluebird';
import { formatEther } from 'ethers/lib/utils';
import { tEthereumAddress, eEthereumNetwork } from './types';

declare var hre: HardhatRuntimeEnvironment;

export const waitForTx = async (tx: ContractTransaction) => await tx.wait(1);

interface AccountItem {
  name: string;
  account: string;
  balance: string;
}

export const getWalletBalances = async () => {
  const accounts = await hre.getNamedAccounts();
  const accountTable = await Bluebird.reduce(
    Object.keys(accounts),
    async (acc: AccountItem[], accKey) => {
      acc.push({
        name: accKey,
        account: accounts[accKey],
        balance: formatEther(await hre.ethers.provider.getBalance(accounts[accKey])),
      });
      return acc;
    },
    []
  );
  return accountTable;
};

export const getContract = async <ContractType extends Contract>(
  id: string,
  address?: tEthereumAddress
): Promise<ContractType> => {
  const artifact = await hre.deployments.getArtifact(id);
  return hre.ethers.getContractAt(
    artifact.abi,
    address || (await (await hre.deployments.get(id)).address)
  ) as any as ContractType;
};

export const isL2Network = (networkName: eEthereumNetwork) => {
  switch (networkName) {
    case eEthereumNetwork.arbi_goerli:
      return true;
    case eEthereumNetwork.arbi_main:
      return true;
    case eEthereumNetwork.base_goerli:
      return true;
    case eEthereumNetwork.base_main:
      return true;
    case eEthereumNetwork.hardhat:
      return true;
    default:
      return false;
  }
};

export const fillNoneTransaction = async function (hre: HardhatRuntimeEnvironment, count: number) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { rawTx } = deployments;
  for (let i = 0; i < count; i++) {
    const tx: Receipt = await rawTx({
      from: deployer,
      to: deployer,
      data: '0x',
      log: true,
    });
    console.log(`fillNoneTransaction ${tx.transactionHash}`);
  }
};
