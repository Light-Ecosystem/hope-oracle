import fs from 'fs';
import path from 'path';
import { eEthereumNetwork, iParamsPerNetwork } from './types';
require('dotenv').config();

export const INFURA_KEY = process.env.INFURA_KEY || '';
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const MNEMONIC = process.env.MNEMONIC || '';

export const getInfuraKey = (net: eEthereumNetwork) => {
  switch (net) {
    case eEthereumNetwork.main:
      return process.env.GORLI_INFURA_KEY || INFURA_KEY;
    case eEthereumNetwork.goerli:
      return process.env.GORLI_INFURA_KEY || INFURA_KEY;
    case eEthereumNetwork.sepolia:
      return process.env.SEPOLIA_INFURA_KEY || INFURA_KEY;
    default:
      return INFURA_KEY;
  }
};

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
  [eEthereumNetwork.main]: `https://mainnet.infura.io/v3/${getInfuraKey(eEthereumNetwork.main)}`,
  [eEthereumNetwork.coverage]: 'http://localhost:8555',
  [eEthereumNetwork.hardhat]: 'http://localhost:8545',

  [eEthereumNetwork.goerli]: `https://goerli.infura.io/v3/${getInfuraKey(eEthereumNetwork.goerli)}`,
  [eEthereumNetwork.sepolia]: `https://sepolia.infura.io/v3/${getInfuraKey(eEthereumNetwork.sepolia)}`,
};

export const LIVE_NETWORKS: iParamsPerNetwork<boolean> = {
  [eEthereumNetwork.main]: true,
};

export const loadTasks = (taskFolders: string[]): void =>
  taskFolders.forEach((folder) => {
    const tasksPath = path.join(__dirname, '../tasks', folder);
    fs.readdirSync(tasksPath)
      .filter((pth) => pth.includes('.ts') || pth.includes('.js'))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });

export const getCommonNetworkConfig = (networkName: eEthereumNetwork, chainId?: number) => ({
  url: NETWORKS_RPC_URL[networkName] || '',
  chainId,
  accounts: [`${process.env.ACCOUNT1_SECRETKEY}`, `${process.env.ACCOUNT2_SECRETKEY}`],
  // ...((!!MNEMONICS[networkName] || !!MNEMONIC) && {
  //   accounts: {
  //     mnemonic: MNEMONICS[networkName] || MNEMONIC,
  //     path: MNEMONIC_PATH,
  //     initialIndex: 0,
  //     count: 10,
  //   },
  // }),
  live: LIVE_NETWORKS[networkName] || false,
});

const MNEMONICS: iParamsPerNetwork<string> = {
  [eEthereumNetwork.sepolia]: process.env.TEST_MNEMONIC,
  [eEthereumNetwork.goerli]: process.env.TEST_MNEMONIC,
};

export const hardhatNetworkSettings = {
  chainId: 31337,
  accounts: !!MNEMONIC
    ? {
        mnemonic: MNEMONIC,
        path: MNEMONIC_PATH,
        initialIndex: 0,
        count: 10,
      }
    : undefined,
};

export const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || '';
