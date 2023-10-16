import {
  ETHERSCAN_KEY,
  ARBISCAN_KEY,
  BASESCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  hardhatForkNetworkSettings,
  loadTasks,
} from './helpers/hardhat-config-helpers';
import { eEthereumNetwork } from './helpers/types';
import { DEFAULT_NAMED_ACCOUNTS } from './helpers/constants';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-contract-sizer';
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';

const TASK_FOLDERS = ['misc'];
// Prevent to load tasks before compilation and typechain
loadTasks(TASK_FOLDERS);

const config: HardhatUserConfig = {
  abiExporter: {
    path: './abi', // path to ABI export directory (relative to Hardhat root)
    runOnCompile: true, // whether to automatically export ABIs during compilation
    clear: true, // whether to delete old ABI files in path on compilation
    flat: true, // whether to flatten output directory (may cause name collisions)
    pretty: false, // whether to use interface-style formatting of output for better readability
  },
  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    // Docs for the compiler https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000,
      },
      evmVersion: 'london',
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  networks: {
    // hardhat: hardhatNetworkSettings,
    hardhat: {
      forking: {
        url: `https://1rpc.io/arb`,
        // url: `https://1rpc.io/base`,
        // url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      },
      ...hardhatForkNetworkSettings,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      ...hardhatNetworkSettings,
    },
    main: {
      ...getCommonNetworkConfig(eEthereumNetwork.main, 1),
      verify: {
        etherscan: {
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eEthereumNetwork.arbi_main]: {
      ...getCommonNetworkConfig(eEthereumNetwork.arbi_main, 42161),
      verify: {
        etherscan: {
          apiKey: `${ARBISCAN_KEY}`,
        },
      },
    },
    [eEthereumNetwork.base_main]: {
      ...getCommonNetworkConfig(eEthereumNetwork.base_main, 8453),
      verify: {
        etherscan: {
          apiUrl: 'https://api.basescan.org/api',
          apiKey: `${BASESCAN_KEY}`,
        },
      },
    },
    [eEthereumNetwork.goerli]: {
      ...getCommonNetworkConfig(eEthereumNetwork.goerli, 5),
      verify: {
        etherscan: {
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eEthereumNetwork.sepolia]: {
      ...getCommonNetworkConfig(eEthereumNetwork.sepolia, 11155111),
      verify: {
        etherscan: {
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eEthereumNetwork.arbi_goerli]: {
      ...getCommonNetworkConfig(eEthereumNetwork.arbi_goerli, 421613),
      verify: {
        etherscan: {
          apiKey: `${ARBISCAN_KEY}`,
        },
      },
    },
    [eEthereumNetwork.base_goerli]: {
      ...getCommonNetworkConfig(eEthereumNetwork.base_goerli, 84531),
      verify: {
        etherscan: {
          apiUrl: 'https://api-goerli.basescan.org/api',
          apiKey: `${BASESCAN_KEY}`,
        },
      },
    },
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  etherscan: {
    apiKey: {
      mainnet: `${ETHERSCAN_KEY}`,
      arbitrumOne: `${ARBISCAN_KEY}`,
      goerli: `${ETHERSCAN_KEY}`,
      sepolia: `${ETHERSCAN_KEY}`,
      arbitrumGoerli: `${ARBISCAN_KEY}`,
      baseGoerli: `${BASESCAN_KEY}`,
      baseMainnet: `${BASESCAN_KEY}`,
    },
    customChains: [
      {
        network: 'baseGoerli',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org',
        },
      },
      {
        network: 'baseMainnet',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
    ],
  },
};

export default config;
