import { Contract, ContractTransaction, Signer } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import Bluebird from 'bluebird';
import { formatEther } from 'ethers/lib/utils';

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
